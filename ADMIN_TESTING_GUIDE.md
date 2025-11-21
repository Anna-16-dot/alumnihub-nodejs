# Admin Testing Guide

## Quick Start - How to Test Admin Features

### Step 1: Ensure You Have an Admin Account

To access admin features, your user account must have the `admin` role. You can either:

#### Option A: Create Admin User via Database
```sql
-- Update existing user to admin
UPDATE users SET role = 'admin' WHERE id = 1;

-- Or create new admin user
INSERT INTO users (name, email, password, role, batch_year, department, created_at, updated_at)
VALUES ('Admin User', 'admin@example.com', PASSWORD('password123'), 'admin', 2020, 'Administration', NOW(), NOW());
```

#### Option B: Use Admin Dashboard to Change Role
1. If you have an admin account already, go to `/admin/users`
2. Find a user you want to make admin
3. Click "Change Role" button
4. Select "Admin" from dropdown
5. Click "Update Role"

### Step 2: Access Admin Dashboard

Once logged in with admin account:

**Method 1: Navigation Menu**
- Click hamburger menu icon
- Look for "Admin Panel" link (red, with shield icon)
- Click to access `/admin`

**Method 2: Direct URL**
- Type `http://localhost:3000/admin` in browser

**Method 3: Dashboard Quick Actions**
- From main dashboard, click "Manage Users" button in quick actions
- This takes you to `/admin/users`

### Step 3: Test Admin Features

#### Test 1: View Admin Dashboard
1. Navigate to `/admin`
2. Verify you see:
   - ✅ Statistics cards (Users, Posts, Pending Posts, Jobs)
   - ✅ Quick Actions section with buttons
   - ✅ Pending Posts for Approval section
   - ✅ Recent Users table

**Expected Result**: All sections display correctly with real data

#### Test 2: Manage Users
1. Click "Manage Users" button
2. OR navigate to `/admin/users`
3. Verify you see:
   - ✅ List of all users
   - ✅ User details (Name, Email, Role, Department, Batch Year, Join Date)
   - ✅ Action buttons for each user
   - ✅ Pagination controls (if more than 10 users)

**Expected Result**: All users display with correct information

#### Test 3: Change User Role
1. From user list, click "Change Role" button for any user
2. Modal dialog appears
3. Select new role from dropdown (Student, Alumni, or Admin)
4. Click "Update Role"
5. Page refreshes and shows success message

**Expected Result**: User role updated in database and reflected in table

#### Test 4: Delete User
1. From user list, click "Delete" button
2. Confirmation dialog appears: "Are you sure you want to delete this user?"
3. Click "OK" to confirm deletion
4. Page refreshes and user is removed from list

**Expected Result**: User removed from database

**Safety Check**: Try to delete your own admin account
- **Expected**: Get error message "Cannot delete your own account"

#### Test 5: Approve Posts
1. From admin dashboard, scroll to "Pending Posts" section
2. If posts exist:
   - ✅ View post author name
   - ✅ View post content preview
   - ✅ View post creation date
   - ✅ View post image (if available)
3. Click "Approve" button
   - Page refreshes and post is removed from pending list
4. Click "Delete" button
   - Confirmation dialog appears
   - Post is removed from database

**Expected Result**: Posts moved to approved status or deleted

#### Test 6: Pagination
1. If you have more than 10 users:
   - ✅ Pagination controls appear at bottom
   - ✅ Can navigate to first/previous/next/last pages
   - ✅ Current page is highlighted
2. Click page numbers to navigate

**Expected Result**: Page changes and shows different user set

### Step 7: Test Permissions (Non-Admin Users)

#### Test as Student/Alumni User
1. Log out from admin account
2. Log in with student or alumni account
3. Try to access `/admin` directly
4. Try to access `/admin/users` directly

**Expected Result**: 
- ✅ Redirected to dashboard with error message
- ✅ Cannot see "Admin Panel" or "Manage Users" in menu
- ✅ "Manage Users" button not visible on dashboard

### Step 8: Responsive Design Testing

Test on different screen sizes:

#### Mobile (320px - 480px)
1. User list displays as cards (not table)
2. Each card shows:
   - User name and email
   - Role badge
   - Action buttons stack vertically
3. Pagination still functional

#### Tablet (480px - 768px)
1. User list still displays as cards
2. Better use of horizontal space
3. All buttons visible and clickable

#### Desktop (768px+)
1. User list displays as full table
2. All columns visible
3. Button groups neatly organized

**Expected Result**: UI adapts smoothly to screen size

## Common Issues & Solutions

### Issue: "Access Denied. Admins Only"
**Cause**: Your user account doesn't have admin role
**Solution**: 
1. Update your user in database: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com'`
2. Log out and log back in

### Issue: Can't See "Manage Users" Button
**Cause**: Not logged in or not admin
**Solution**: 
1. Verify you're logged in
2. Check your role is 'admin' in database
3. Clear browser cache and refresh

### Issue: Page Returns 404
**Cause**: Server not running or routes not loaded
**Solution**:
1. Check server is running: `npm start`
2. Restart server if routes were modified
3. Check browser console for errors

### Issue: User Deletion Fails
**Cause**: Database permissions or foreign key constraints
**Solution**:
1. Check user ID is valid
2. Verify no foreign key constraints
3. Check database error logs

### Issue: Role Change Not Saving
**Cause**: Invalid role value or database error
**Solution**:
1. Ensure role is one of: student, alumni, admin
2. Check database is writable
3. Review server logs for error details

## Performance Testing

### Load Test Admin Dashboard
1. Create 100+ users in database
2. Access `/admin/users`
3. Verify pagination works smoothly
4. Check page loads within 2-3 seconds

**Expected Result**: Page loads quickly even with many users

### Concurrent Access Test
1. Open admin panel in two browser windows
2. Change user role in window 1
3. Check window 2 reflects the change

**Expected Result**: Changes visible immediately

## Browser Compatibility

Test admin features in:
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Expected Result**: Features work consistently across browsers

## Data Validation Testing

### Test Invalid Inputs
1. Try accessing `/admin/users/999` (invalid user ID)
   - **Expected**: No crash, graceful handling
   
2. Try accessing `/admin/users?page=999` (invalid page)
   - **Expected**: Pagination handles gracefully

3. Try changing role to invalid value
   - **Expected**: Server rejects, shows error

### Test Edge Cases
1. Last user in system: Try to delete all users except one
   - **Expected**: Still have one user remaining
   
2. Only admin user: Try to change own role to student
   - **Expected**: Can change, but then need another admin to access admin features
   
3. Pagination boundaries: Navigate to last page, then try next
   - **Expected**: Stays on last page, doesn't error

## Monitoring & Logging

### Check Server Logs for:
- `Admin dashboard error:` - Dashboard load errors
- `Manage users error:` - User list load errors
- `Delete user error:` - User deletion errors
- `Update user role error:` - Role change errors

### Monitor Database:
- User table changes
- Post approval status changes
- Role assignments

## Sign-off Checklist

After testing, verify all working:
- [ ] Admin dashboard loads with correct data
- [ ] User list displays with all users
- [ ] Can change user roles
- [ ] Can delete users (except self)
- [ ] Can approve/delete posts
- [ ] Pagination works correctly
- [ ] Responsive design on mobile
- [ ] Non-admin users can't access admin features
- [ ] Confirmation dialogs work for destructive actions
- [ ] Error handling is graceful
- [ ] Flash messages display correctly
- [ ] Menu items show/hide based on role

Once all checks pass, admin features are fully functional! ✅
