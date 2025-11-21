const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

// Chat list page - show all conversations
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get all users with whom current user has chatted, including unread count
        const [conversations] = await db.execute(`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role,
                p.profile_picture,
                (SELECT message FROM messages 
                 WHERE (sender_id = u.id AND receiver_id = ?) 
                    OR (sender_id = ? AND receiver_id = u.id)
                 ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT created_at FROM messages 
                 WHERE (sender_id = u.id AND receiver_id = ?) 
                    OR (sender_id = ? AND receiver_id = u.id)
                 ORDER BY created_at DESC LIMIT 1) as last_message_time,
                (SELECT COUNT(*) FROM messages 
                 WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0) as unread_count
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id != ? 
            AND EXISTS (
                SELECT 1 FROM messages m 
                WHERE (m.sender_id = u.id AND m.receiver_id = ?) 
                   OR (m.sender_id = ? AND m.receiver_id = u.id)
            )
            ORDER BY last_message_time DESC
        `, [userId, userId, userId, userId, userId, userId, userId, userId]);

        res.render('chat/index', { 
            conversations,
            helpers: require('../utils/helpers')
        });
    } catch (error) {
        console.error('Chat list error:', error);
        res.status(500).render('errors/500');
    }
});

// New chat - show all users to start a conversation
router.get('/new', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Get all users except current user
        const [users] = await db.execute(
            'SELECT u.id, u.name, u.email, u.role, p.profile_picture FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id != ? ORDER BY u.name',
            [userId]
        );

        res.render('chat/new', { 
            users,
            helpers: require('../utils/helpers')
        });
    } catch (error) {
        console.error('New chat error:', error);
        res.status(500).render('errors/500');
    }
});

// Chat conversation with specific user
router.get('/:userId', isAuthenticated, async (req, res) => {
    try {
        const currentUserId = req.session.user.id;
        const otherUserId = req.params.userId;

        // Get other user details
        const [otherUser] = await db.execute(
            'SELECT u.id, u.name, u.email, u.role, p.profile_picture FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?',
            [otherUserId]
        );

        if (!otherUser[0]) {
            return res.status(404).render('errors/404');
        }

        // Get all messages between these two users
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

        // Mark messages as read
        await db.execute(
            'UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ? AND is_read = 0',
            [otherUserId, currentUserId]
        );

        res.render('chat/conversation', {
            otherUser: otherUser[0],
            messages,
            helpers: require('../utils/helpers')
        });
    } catch (error) {
        console.error('Conversation error:', error);
        res.status(500).render('errors/500');
    }
});

module.exports = router;
