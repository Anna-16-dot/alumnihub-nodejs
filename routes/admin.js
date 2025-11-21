/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAdmin } = require('../middleware/auth');

// Admin Dashboard
router.get('/', isAdmin, (req, res) => {
    db.query(
        `SELECT 
            (SELECT COUNT(*) FROM users) as totalUsers,
            (SELECT COUNT(*) FROM posts) as totalPosts,
            (SELECT COUNT(*) FROM posts WHERE is_approved = 0) as pendingPosts,
            (SELECT COUNT(*) FROM jobs) as totalJobs`,
        (err, stats) => {
            if (err) {
                return res.status(500).render('errors/500', { error: err });
            }

            const statsObj = stats[0];

            db.query(
                `SELECT * FROM posts WHERE is_approved = 0 ORDER BY created_at DESC LIMIT 10`,
                (err, posts) => {
                    if (err) {
                        return res.status(500).render('errors/500', { error: err });
                    }

                    db.query(
                        `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10`,
                        (err, users) => {
                            if (err) {
                                return res.status(500).render('errors/500', { error: err });
                            }

                            res.render('admin/dashboard', {
                                title: 'Admin Dashboard',
                                stats: statsObj,
                                postsAwaitingApproval: posts,
                                recentUsers: users,
                                user: req.session.user
                            });
                        }
                    );
                }
            );
        }
    );
});

// Approve post
router.post('/posts/:id/approve', isAdmin, (req, res) => {
    const postId = req.params.id;

    db.query('UPDATE posts SET is_approved = 1 WHERE id = ?', [postId], (err) => {
        if (err) {
            console.error('Approve post error:', err);
            req.flash('error', 'Error approving post');
            return res.redirect('/admin');
        }
        req.flash('success', 'Post approved successfully');
        res.redirect('/admin');
    });
});

// Delete post
router.post('/posts/:id/delete', isAdmin, (req, res) => {
    const postId = req.params.id;

    db.query('DELETE FROM posts WHERE id = ?', [postId], (err) => {
        if (err) {
            console.error('Delete post error:', err);
            req.flash('error', 'Error deleting post');
            return res.redirect('/admin');
        }
        req.flash('success', 'Post deleted successfully');
        res.redirect('/admin');
    });
});

// Manage Users
router.get('/users', isAdmin, (req, res) => {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    db.query(
        `SELECT id, name, email, role, batch_year, department, created_at, updated_at
         FROM users
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, users) => {
            if (err) {
                console.error('Get users error:', err);
                req.flash('error', 'Error loading users');
                return res.redirect('/admin');
            }

            db.query('SELECT COUNT(*) as total FROM users', (err, countResult) => {
                if (err) {
                    console.error('Count users error:', err);
                    req.flash('error', 'Error loading users');
                    return res.redirect('/admin');
                }

                const totalUsers = countResult[0].total;
                const totalPages = Math.ceil(totalUsers / limit);

                res.render('admin/users', {
                    title: 'Manage Users',
                    users,
                    currentPage: parseInt(page),
                    totalPages,
                    totalUsers,
                    user: req.session.user
                });
            });
        }
    );
});

// Delete User
router.post('/users/:id/delete', isAdmin, (req, res) => {
    const userId = req.params.id;

    // Check if user is trying to delete themselves
    if (parseInt(userId) === req.session.user.id) {
        req.flash('error', 'Cannot delete your own account');
        return res.redirect('/admin/users');
    }

    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error('Delete user error:', err);
            req.flash('error', 'Error deleting user');
            return res.redirect('/admin/users');
        }
        req.flash('success', 'User deleted successfully');
        res.redirect('/admin/users');
    });
});

// Change User Role
router.post('/users/:id/role', isAdmin, (req, res) => {
    const userId = req.params.id;
    const newRole = req.body.role;

    const validRoles = ['student', 'alumni', 'admin'];
    if (!validRoles.includes(newRole)) {
        req.flash('error', 'Invalid role');
        return res.redirect('/admin/users');
    }

    db.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId], (err) => {
        if (err) {
            console.error('Update user role error:', err);
            req.flash('error', 'Error updating user role');
            return res.redirect('/admin/users');
        }
        req.flash('success', 'User role updated successfully');
        res.redirect('/admin/users');
    });
});

module.exports = router;
