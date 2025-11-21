# Admin Features - Complete Implementation Guide

## Overview
This document details all admin features implemented in the AlumniHub Node.js application.

## Admin Features Implemented

### 1. **Admin Dashboard** (`/admin`)
**Location:** `views/admin/dashboard.ejs`
**Route:** `GET /admin`

#### Features:
- **Admin Statistics Cards** (clickable):
  - Total Users with link to manage users
  - Total Posts with link to approval page
  - Pending Posts for approval (with count)
  - Total Jobs posted

- **Admin Quick Actions**:
  - Manage Users - Access user management panel
  - Approve Posts - View pending posts
  - Delete Content - Manage inappropriate content
  - View Stats - Dashboard statistics

- **Pending Posts for Approval**:
  - List of posts awaiting admin approval
  - Shows post author, date, and preview
  - Image preview if available
  - Approve/Delete buttons for each post
  - Empty state message when all posts approved

- **Recent Users Section**:
  - Table view showing latest 10 registrations
  - Columns: Name, Email, Role, Joined Date
  - Color-coded role badges
  - Direct link to view all users

### 2. **User Management** (`/admin/users`)
**Location:** `views/admin/users.ejs`
**Route:** `GET /admin/users`

#### Features:
- **Responsive User List**:
  - Desktop: Full data table with all user details
  - Mobile: Card-based layout for easy navigation
  
- **User Details**:
  - Name
  - Email
  - Current Role (student/alumni/admin)
  - Batch Year
  - Department
  - Join Date

- **User Management Actions**:
  - **Change Role**: Modal-based role selection
    - Options: Student, Alumni, Admin
    - One-click update with confirmation
  - **Delete User**: Remove user from system
    - Safety confirmation before deletion
    - Prevents self-deletion (admin can't delete own account)

- **Pagination**:
  - 10 users per page
  - First/Previous/Next/Last navigation
  - Current page indicator
  - Smart page range display

### 3. **Post Approval System**
**Routes:**
- `POST /admin/posts/:id/approve` - Approve a post
- `POST /admin/posts/:id/delete` - Delete a post

#### Features:
- Approve pending posts to make them visible
- Delete inappropriate or spam posts
- Confirmation required for destructive actions
- Flash messages for user feedback

### 4. **Dashboard Integration**
**Location:** `views/dashboard/index.ejs`

#### Admin-Only Elements:
- **Manage Users Button** in Quick Actions section
  - Only visible to admin users
  - Direct link to `/admin/users`
  - Bootstrap icon with clear label

### 5. **Navigation Integration**
**Location:** `views/partials/navbar.ejs`

#### Admin-Only Menu Items:
- **Admin Panel**: Link to `/admin` admin dashboard
- **Manage Users**: Link to `/admin/users` user management
- Both menu items only visible to admin users
- Accessible from hamburger/offcanvas menu

## User Roles & Permissions

### Admin Role
- ✅ Access admin dashboard (`/admin`)
- ✅ View all users and their details
- ✅ Change user roles (student ↔ alumni ↔ admin)
- ✅ Delete users from system
- ✅ Approve/reject posts
- ✅ Delete inappropriate content
- ✅ View statistics and analytics

### Alumni Role
- ✅ Access all standard features
- ✅ Create and share posts
- ✅ Browse directory
- ✅ Post job opportunities
- ❌ Cannot access admin features

### Student Role
- ✅ Access all standard features
- ✅ Create and share posts
- ✅ Browse directory
- ✅ View job opportunities
- ❌ Cannot post jobs
- ❌ Cannot access admin features

## Middleware Protection

All admin routes are protected by the `isAdmin` middleware:
- Checks if user is logged in
- Verifies user role is 'admin'
- Redirects non-admin users with error message
- Prevents unauthorized access

## Database Schema

Admin features rely on the following fields:

### Users Table
```sql
- id (Primary Key)
- name
- email
- role (student/alumni/admin)
- batch_year
- department
- created_at
- updated_at
```

### Posts Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- content
- image
- is_approved (0/1 flag)
- created_at
```

### Jobs Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- title
- description
- company
- created_at
```

## Usage Instructions

### Accessing Admin Dashboard
1. Log in with admin account
2. Click "Admin Panel" in navigation menu OR
3. Navigate to `http://localhost:3000/admin`

### Managing Users
1. From admin dashboard, click "Manage Users" button OR
2. Navigate to `http://localhost:3000/admin/users`
3. View user list with pagination
4. Click "Change Role" to modify user role
5. Click "Delete" to remove user (with confirmation)

### Approving Posts
1. From admin dashboard, scroll to "Pending Posts" section
2. Review post content and image
3. Click "Approve" to publish post OR
4. Click "Delete" to remove post

## Security Features

1. **Authentication**: All admin routes require login
2. **Authorization**: isAdmin middleware checks role
3. **Session Management**: User role stored in session
4. **Confirmation Dialogs**: Destructive actions require confirmation
5. **Self-Delete Prevention**: Admins cannot delete their own account
6. **CSRF Protection**: Form-based actions should use CSRF tokens
7. **Input Validation**: Role selection limited to valid roles

## Styling

Admin features use:
- Bootstrap 5.3.0 components
- Bootstrap Icons v1.11.3
- Custom CSS from `public/css/mobile.css`
- Responsive design (mobile-first approach)
- Consistent color scheme:
  - Primary (blue): General actions
  - Danger (red): Delete/destructive actions
  - Success (green): Approval actions
  - Warning (yellow): Pending/attention items
  - Info (cyan): Information/statistics

## Future Enhancements

Potential admin features to add:
- [ ] Bulk user actions
- [ ] Advanced search/filter for users
- [ ] Export user data to CSV
- [ ] Admin activity logs
- [ ] Mass post approval
- [ ] Content moderation queue
- [ ] User analytics and insights
- [ ] Announcement system
- [ ] Email templates for admin notifications
- [ ] Ban/suspend user functionality

## Troubleshooting

### Can't Access Admin Features
**Issue**: Getting "Access denied. Admins only" message
**Solution**: Ensure your user account has 'admin' role in database

### 404 on /admin/users
**Issue**: Page not found error
**Solution**: 
- Verify admin role is set correctly
- Check isAdmin middleware is properly imported
- Ensure server is running with latest code

### Pagination Not Working
**Issue**: Page links not navigating
**Solution**: Clear browser cache, check database has users

### Role Change Failed
**Issue**: User role not updating
**Solution**: 
- Verify database permissions
- Check role value is valid (student/alumni/admin)
- Review server logs for errors

## Files Modified/Created

### New Files
- `views/admin/users.ejs` - User management view
- `ADMIN_FEATURES.md` - This documentation

### Modified Files
- `views/admin/dashboard.ejs` - Enhanced with all features
- `routes/admin.js` - Complete admin route handlers
- `views/partials/navbar.ejs` - Added admin menu items
- `views/dashboard/index.ejs` - Added manage users button

### Unchanged (Required for Admin)
- `middleware/auth.js` - isAdmin middleware
- `config/database.js` - Database connection
- `server.js` - Route mounting
