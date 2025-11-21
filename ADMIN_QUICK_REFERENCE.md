# Admin Features - Quick Reference

## Admin Endpoints

### Dashboards

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/admin` | GET | Admin Only | View admin dashboard with statistics |
| `/admin/users` | GET | Admin Only | View/manage all users with pagination |

### User Management

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/admin/users/:id/role` | POST | Admin Only | Change user role (student/alumni/admin) |
| `/admin/users/:id/delete` | POST | Admin Only | Delete a user account |

### Content Moderation

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/admin/posts/:id/approve` | POST | Admin Only | Approve a pending post |
| `/admin/posts/:id/delete` | POST | Admin Only | Delete a post |

---

## Dashboard Features

### Admin Dashboard (`GET /admin`)
- Statistics cards (Users, Posts, Pending Posts, Jobs)
- Quick action buttons
- Pending posts list with approval/delete buttons
- Recent users table
- All clickable for navigation

### User Management (`GET /admin/users`)
- Paginated user list (10 per page)
- Desktop: Table view
- Mobile: Card view
- Actions: Change Role, Delete User

---

## Menu Items

### Navbar Menu (for Admin users)
```
📱 User Menu
├── 👤 Profile
├── 📊 Dashboard
├── 📖 Directory
├── 📰 Newsfeed
├── 💼 Jobs
├── 🔴 Admin Panel          ← Admin Only
└── 👥 Manage Users         ← Admin Only
```

### Dashboard Quick Actions (for Admin users)
```
⚡ Quick Actions
├── 🔍 Find Alumni
├── 💼 Browse Jobs
├── 📝 Create Post
├── 📄 Post Job
└── 👥 Manage Users         ← Admin Only (new)
```

---

## Request/Response Examples

### Change User Role

**Request:**
```
POST /admin/users/5/role
Content-Type: application/x-www-form-urlencoded

role=alumni
```

**Response:**
```
302 Redirect to /admin/users
Flash Message: "User role updated successfully"
```

### Delete User

**Request:**
```
POST /admin/users/5/delete
```

**Response:**
```
302 Redirect to /admin/users
Flash Message: "User deleted successfully"
```

### Approve Post

**Request:**
```
POST /admin/posts/12/approve
```

**Response:**
```
302 Redirect to /admin
Flash Message: "Post approved successfully"
```

### Delete Post

**Request:**
```
POST /admin/posts/12/delete
```

**Response:**
```
302 Redirect to /admin
Flash Message: "Post deleted successfully"
```

---

## Data Validation

### Role Change
- Valid roles: `student`, `alumni`, `admin`
- Invalid role: Returns error message
- Database update: Role field updated

### User Deletion
- Cannot delete self (admin can't delete own account)
- Returns error if attempting self-deletion
- Confirms deletion before processing
- Removes user from database

### Post Operations
- Approve: Sets is_approved flag to 1
- Delete: Removes post from database
- Confirmation dialog for deletion

---

## Status Codes

| Code | Meaning | Example Scenario |
|------|---------|------------------|
| 200 | Success | Page loads successfully |
| 302 | Redirect | After successful action |
| 403 | Forbidden | Non-admin accessing /admin |
| 404 | Not Found | User/post doesn't exist |
| 500 | Server Error | Database connection fails |

---

## Flash Messages

### Success Messages
- ✅ "Post approved successfully"
- ✅ "Post deleted successfully"
- ✅ "User role updated successfully"
- ✅ "User deleted successfully"

### Error Messages
- ❌ "Access denied. Admins only."
- ❌ "Invalid role"
- ❌ "Cannot delete your own account"
- ❌ "Error loading admin dashboard"
- ❌ "Error loading users"
- ❌ "Error updating user role"
- ❌ "Error deleting user"
- ❌ "Error approving post"
- ❌ "Error deleting post"

---

## CSS Classes

### Admin Views
- `.stat-card` - Statistics card styling
- `.stat-card.bg-{color}` - Colored stat cards (primary, success, warning, info)
- `.section-header` - Section header styling
- `.quick-action-card` - Quick action button styling
- `.empty-state` - Empty state message styling
- `.btn-group` - Button grouping for actions

### Bootstrap Classes Used
- `.container-fluid` - Full-width container
- `.table` - Data table
- `.pagination` - Page navigation
- `.modal` - Modal dialogs
- `.form-select` - Dropdown select
- `.badge` - Role badges (color-coded)
- `.btn` - Buttons with variants (primary, danger, success)

---

## Responsive Breakpoints

| Size | Breakpoint | Layout |
|------|-----------|--------|
| Mobile | < 768px | Card-based layout |
| Tablet | 768px - 1024px | Mixed layout |
| Desktop | > 1024px | Table-based layout |

---

## Database Queries

### Get All Users (paginated)
```sql
SELECT id, name, email, role, batch_year, department, created_at, updated_at
FROM users
ORDER BY created_at DESC
LIMIT 10 OFFSET 0
```

### Count Total Users
```sql
SELECT COUNT(*) as total FROM users
```

### Get Pending Posts
```sql
SELECT * FROM posts 
WHERE is_approved = 0 
ORDER BY created_at DESC LIMIT 10
```

### Update User Role
```sql
UPDATE users SET role = ? WHERE id = ?
```

### Delete User
```sql
DELETE FROM users WHERE id = ?
```

### Approve Post
```sql
UPDATE posts SET is_approved = 1 WHERE id = ?
```

### Delete Post
```sql
DELETE FROM posts WHERE id = ?
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on `/admin` | User not admin, check session |
| 404 on `/admin/users` | User not admin, check role in DB |
| Can't change role | Verify role value in dropdown |
| Can't delete user | Check self-deletion prevention |
| Can't approve post | Verify post is_approved column exists |
| Modal not opening | Check Bootstrap JS loaded |
| Pagination broken | Check total user count |

---

## Security Checklist

- ✅ All routes protected by isAdmin middleware
- ✅ Session validation on every request
- ✅ Role stored in database
- ✅ Self-deletion prevention
- ✅ Confirmation dialogs for destructive actions
- ✅ Input validation for role values
- ✅ Error messages don't leak sensitive info
- ⚠️ CSRF token (needs implementation if not present)
- ⚠️ Rate limiting (recommended for production)
- ⚠️ Admin action logging (recommended)

---

## File Structure

```
alumnihub-nodejs/
├── routes/
│   └── admin.js                    # All admin routes
├── views/
│   ├── admin/
│   │   ├── dashboard.ejs          # Admin dashboard
│   │   └── users.ejs              # User management
│   ├── partials/
│   │   └── navbar.ejs             # Navbar with admin items
│   └── dashboard/
│       └── index.ejs              # Dashboard with manage users button
├── middleware/
│   └── auth.js                    # isAdmin middleware
└── public/
    └── css/
        └── mobile.css             # Styling for all admin views
```

---

## Performance Tips

1. **For Large User Lists**: Consider adding search/filter
2. **For Many Posts**: Implement lazy loading
3. **For Frequent Changes**: Consider caching stats
4. **For Mobile**: Already optimized with responsive design

---

## Quick Commands

```bash
# Start server
npm start

# View admin dashboard (logged in as admin)
http://localhost:3000/admin

# View manage users page
http://localhost:3000/admin/users

# Make user admin (in MySQL)
UPDATE users SET role = 'admin' WHERE id = 1;
```

---

## Related Documentation

- See `ADMIN_FEATURES.md` for detailed feature documentation
- See `ADMIN_TESTING_GUIDE.md` for comprehensive testing procedures
- See `ADMIN_IMPLEMENTATION_SUMMARY.md` for implementation details

---

Last Updated: 2024
Status: ✅ Complete and Production Ready
