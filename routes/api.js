/**
 * API Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Like/Unlike post
router.post('/like-post', isAuthenticated, async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.session.user.id;

    if (!post_id) {
        return res.json({ success: false, message: 'Post ID required' });
    }

    try {
        // Check if already liked
        const [existing] = await db.execute(
            'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
            [post_id, user_id]
        );

        let liked = false;

        if (existing.length > 0) {
            // Unlike
            await db.execute(
                'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
                [post_id, user_id]
            );
            await db.execute(
                'UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?',
                [post_id]
            );
            
            // Delete notification
            await db.execute(
                'DELETE FROM notifications WHERE post_id = ? AND from_user_id = ? AND type = "like"',
                [post_id, user_id]
            );
            
            liked = false;
        } else {
            // Like
            await db.execute(
                'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
                [post_id, user_id]
            );
            await db.execute(
                'UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?',
                [post_id]
            );
            
            // Get post owner and liker details
            const [postInfo] = await db.execute(
                'SELECT p.user_id, u.name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
                [post_id]
            );
            
            const [likerInfo] = await db.execute(
                'SELECT name FROM users WHERE id = ?',
                [user_id]
            );
            
            // Create notification for post owner (don't notify yourself)
            if (postInfo[0].user_id !== user_id) {
                const message = `${likerInfo[0].name} liked your post`;
                await db.execute(
                    'INSERT INTO notifications (user_id, from_user_id, post_id, type, message) VALUES (?, ?, ?, "like", ?)',
                    [postInfo[0].user_id, user_id, post_id, message]
                );
            }
            
            liked = true;
        }

        // Get updated count
        const [post] = await db.execute(
            'SELECT likes_count FROM posts WHERE id = ?',
            [post_id]
        );

        res.json({
            success: true,
            liked,
            likes_count: post[0].likes_count
        });

    } catch (error) {
        console.error('Like post error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// Add comment
router.post('/add-comment', isAuthenticated, async (req, res) => {
    const { post_id, comment } = req.body;
    const user_id = req.session.user.id;

    if (!post_id || !comment) {
        return res.json({ success: false, message: 'Post ID and comment required' });
    }

    try {
        // Insert comment
        const [result] = await db.execute(
            'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
            [post_id, user_id, comment]
        );

        // Get post owner and commenter details
        const [postInfo] = await db.execute(
            'SELECT user_id FROM posts WHERE id = ?',
            [post_id]
        );
        
        const [commenterInfo] = await db.execute(
            'SELECT name FROM users WHERE id = ?',
            [user_id]
        );
        
        // Create notification for post owner (don't notify yourself)
        if (postInfo[0].user_id !== user_id) {
            const message = `${commenterInfo[0].name} commented on your post`;
            await db.execute(
                'INSERT INTO notifications (user_id, from_user_id, post_id, type, message) VALUES (?, ?, ?, "comment", ?)',
                [postInfo[0].user_id, user_id, post_id, message]
            );
        }

        // Get the newly created comment with user details
        const [newComment] = await db.execute(
            'SELECT c.*, u.name, u.role FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?',
            [result.insertId]
        );

        res.json({ success: true, message: 'Comment added successfully', comment: newComment[0] });

    } catch (error) {
        console.error('Add comment error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// Get comments for a post
router.get('/get-comments/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const [comments] = await db.execute(
            'SELECT c.*, u.name, u.role FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC',
            [postId]
        );
        res.json({ success: true, comments });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete comment (only comment author or admin)
router.delete('/delete-comment/:commentId', isAuthenticated, async (req, res) => {
    const { commentId } = req.params;
    const user_id = req.session.user.id;
    const user_role = req.session.user.role;

    try {
        // Get comment details
        const [comment] = await db.execute(
            'SELECT user_id FROM comments WHERE id = ?',
            [commentId]
        );

        if (!comment[0]) {
            return res.json({ success: false, message: 'Comment not found' });
        }

        // Check if user is comment author or admin
        if (comment[0].user_id !== user_id && user_role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        // Delete comment
        await db.execute('DELETE FROM comments WHERE id = ?', [commentId]);
        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Share post
router.post('/share-post', isAuthenticated, async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.session.user.id;

    if (!post_id) {
        return res.json({ success: false, message: 'Post ID required' });
    }

    try {
        // Get post owner and sharer details
        const [postInfo] = await db.execute(
            'SELECT user_id FROM posts WHERE id = ?',
            [post_id]
        );
        
        const [sharerInfo] = await db.execute(
            'SELECT name FROM users WHERE id = ?',
            [user_id]
        );
        
        // Create notification for post owner (don't notify yourself)
        if (postInfo[0].user_id !== user_id) {
            const message = `${sharerInfo[0].name} shared your post`;
            await db.execute(
                'INSERT INTO notifications (user_id, from_user_id, post_id, type, message) VALUES (?, ?, ?, "share", ?)',
                [postInfo[0].user_id, user_id, post_id, message]
            );
        }

        res.json({ success: true, message: 'Post shared successfully' });

    } catch (error) {
        console.error('Share post error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// Get notifications
router.get('/notifications', isAuthenticated, async (req, res) => {
    const user_id = req.session.user.id;

    try {
        const [notifications] = await db.execute(
            `SELECT n.*, u.name as from_user_name, pr.profile_picture as from_user_picture,
             p.content as post_content
             FROM notifications n
             JOIN users u ON n.from_user_id = u.id
             LEFT JOIN profiles pr ON u.id = pr.user_id
             LEFT JOIN posts p ON n.post_id = p.id
             WHERE n.user_id = ?
             ORDER BY n.created_at DESC
             LIMIT 50`,
            [user_id]
        );

        res.json({ success: true, notifications });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// Mark notification as read
router.post('/mark-notification-read', isAuthenticated, async (req, res) => {
    const { notification_id } = req.body;
    const user_id = req.session.user.id;

    try {
        await db.execute(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [notification_id, user_id]
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Mark notification read error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// Mark all notifications as read
router.post('/mark-all-notifications-read', isAuthenticated, async (req, res) => {
    const user_id = req.session.user.id;

    try {
        await db.execute(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [user_id]
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// Get unread notification count
router.get('/notifications/count', isAuthenticated, async (req, res) => {
    const user_id = req.session.user.id;

    try {
        const [result] = await db.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
            [user_id]
        );

        res.json({ success: true, count: result[0].count });

    } catch (error) {
        console.error('Get notification count error:', error);
        res.json({ success: false, message: 'Database error' });
    }
});

// ===== CHAT API ENDPOINTS =====

// Send message
router.post('/send-message', isAuthenticated, async (req, res) => {
    const { receiver_id, message } = req.body;
    const sender_id = req.session.user.id;

    if (!receiver_id || !message) {
        return res.json({ success: false, message: 'Receiver ID and message required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [sender_id, receiver_id, message]
        );

        // Get the newly created message with sender details
        const [newMessage] = await db.execute(
            'SELECT m.*, u.name as sender_name, p.profile_picture as sender_picture FROM messages m JOIN users u ON m.sender_id = u.id LEFT JOIN profiles p ON u.id = p.user_id WHERE m.id = ?',
            [result.insertId]
        );

        res.json({ success: true, message: 'Message sent', data: newMessage[0] });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get messages with a specific user
router.get('/get-messages/:userId', isAuthenticated, async (req, res) => {
    const currentUserId = req.session.user.id;
    const otherUserId = req.params.userId;

    try {
        const [messages] = await db.execute(`
            SELECT m.*, 
                   sender.name as sender_name,
                   p.profile_picture as sender_picture
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            LEFT JOIN profiles p ON sender.id = p.user_id
            WHERE (m.sender_id = ? AND m.receiver_id = ?)
               OR (m.sender_id = ? AND m.receiver_id = ?)
            ORDER BY m.created_at ASC
        `, [currentUserId, otherUserId, otherUserId, currentUserId]);

        // Mark received messages as read
        await db.execute(
            'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
            [otherUserId, currentUserId]
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Mark specific message as read
router.post('/mark-message-read/:messageId', isAuthenticated, async (req, res) => {
    const messageId = req.params.messageId;
    const currentUserId = req.session.user.id;

    try {
        await db.execute(
            'UPDATE messages SET is_read = 1 WHERE id = ? AND receiver_id = ?',
            [messageId, currentUserId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Mark message read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get unread message count
router.get('/messages/unread-count', isAuthenticated, async (req, res) => {
    const user_id = req.session.user.id;

    try {
        const [result] = await db.execute(
            'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0',
            [user_id]
        );

        res.json({ success: true, count: result[0].count });
    } catch (error) {
        console.error('Get unread message count error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
