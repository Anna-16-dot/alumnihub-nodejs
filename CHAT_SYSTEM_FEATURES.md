# LinkedIn-Style Chat System

## Overview
Complete real-time personal messaging system where users can chat with any alumni member, similar to LinkedIn messaging.

## Features Implemented

### ✅ Chat List Page (`/chat`)
- Shows all conversations with last message preview
- Displays unread message count per conversation
- Sorted by most recent message
- User avatars with role badges
- Empty state for new users

### ✅ New Chat Page (`/chat/new`)
- Browse all users in the system
- Search functionality to filter users
- User profiles with name, email, and role
- Click any user to start a conversation

### ✅ Conversation Page (`/chat/:userId`)
- Real-time messaging interface
- Message history displayed chronologically
- Visual distinction between sent/received messages
- Auto-scroll to latest message
- Message timestamps (just now, 5m ago, etc.)
- Auto-refresh every 3 seconds for new messages
- Enter key to send (Shift+Enter for new line)

### ✅ Chat Icon in Navbar
- Purple gradient chat icon with badge
- Shows unread message count
- Direct link to chat list
- Updates every 30 seconds

### ✅ Bottom Navigation
- Chat icon replacing Feed in mobile nav
- Easy access from any page
- Active state highlighting

## Database Schema

### `messages` Table
```sql
CREATE TABLE messages (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sender_id INT UNSIGNED NOT NULL,
    receiver_id INT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- `idx_sender_receiver` - Fast lookups for conversation threads
- `idx_receiver_sender` - Reverse lookup optimization
- `idx_created_at` - Chronological sorting

## File Structure

### Routes
- **`routes/chat.js`** - Main chat routes
  - `GET /chat` - List all conversations
  - `GET /chat/new` - Show all users
  - `GET /chat/:userId` - Conversation with specific user

### Views
- **`views/chat/index.ejs`** - Chat list page
- **`views/chat/new.ejs`** - New chat / user selection
- **`views/chat/conversation.ejs`** - Chat conversation UI

### API Endpoints
- **`POST /api/send-message`** - Send new message
  - Body: `{ receiver_id, message }`
  - Returns: New message with sender details

- **`GET /api/get-messages/:userId`** - Get conversation history
  - Returns: Array of messages
  - Auto-marks messages as read

- **`GET /api/messages/unread-count`** - Get unread message count
  - Returns: `{ success, count }`

### JavaScript
- **`public/js/app.js`** - Added functions:
  - `loadMessageCount()` - Fetch unread count
  - Auto-refresh every 30 seconds

### Styling
- **`public/css/mobile.css`** - Complete chat UI styles:
  - `.chat-btn` - Navbar chat icon
  - `.chat-list` - Conversation list
  - `.chat-container` - Full chat interface
  - `.message-sent` / `.message-received` - Message bubbles
  - `.chat-input-fixed` - Bottom input area

## UI/UX Features

### Chat List
- **Unread Badge**: Red badge shows unread count per conversation
- **Last Message**: Preview of most recent message (truncated at 50 chars)
- **Time Ago**: Relative timestamps (5m ago, 2h ago, etc.)
- **Hover Effects**: Smooth animations and shadows
- **Empty State**: Helpful message with "New Chat" button

### Conversation View
- **Fixed Header**: User profile at top with back button
- **Message Bubbles**: 
  - Sent messages: Purple gradient, right-aligned
  - Received messages: White with border, left-aligned
- **User Avatars**: Show avatar for received messages
- **Auto-scroll**: Automatically scrolls to newest message
- **Fixed Input**: Bottom-fixed input with send button
- **Real-time Updates**: Polls for new messages every 3 seconds
- **Keyboard Support**: Enter to send, Shift+Enter for newline

### New Chat Page
- **Search Bar**: Real-time filtering of users
- **User Cards**: Display name, email, role badge
- **Smooth Navigation**: Direct navigation to conversation

## Bootstrap Icons Used
- `bi-chat-dots-fill` - Main chat icon (navbar, bottom nav, menu)
- `bi-plus-circle-fill` - New chat button
- `bi-arrow-left` - Back navigation
- `bi-send-fill` - Send message button
- `bi-chevron-right` - Navigation arrows

## Color Scheme
- **Chat Icon**: Purple gradient (#667eea → #764ba2)
- **Sent Messages**: Purple gradient background
- **Received Messages**: White with light border
- **Unread Badge**: Red (#dc3545)
- **Hover States**: Light gray background (#f8f9fa)

## Security Features
- ✅ Authentication required for all chat routes
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS prevention with HTML escaping
- ✅ Session-based user identification
- ✅ Foreign key constraints prevent orphaned messages
- ✅ Cascade delete on user removal

## Real-time Features
1. **Message Count Updates**: Every 30 seconds
2. **New Message Polling**: Every 3 seconds in conversation
3. **Auto Mark as Read**: When viewing conversation
4. **Instant Message Append**: No page reload needed

## Usage Flow

### Starting a Chat
1. Click chat icon in navbar or bottom nav
2. If no conversations, click "New Chat"
3. Search or browse users
4. Click user to start conversation

### Sending Messages
1. Open conversation with user
2. Type message in bottom input
3. Press Enter or click send button
4. Message appears instantly

### Viewing Messages
1. Navigate to /chat
2. See all conversations with previews
3. Unread count shown on each conversation
4. Click to view full conversation
5. Messages marked as read automatically

## Testing Checklist
- [ ] Send message to new user
- [ ] Receive message from another user
- [ ] Verify unread count appears
- [ ] Check message marking as read
- [ ] Test search functionality
- [ ] Verify real-time message updates
- [ ] Test on mobile view
- [ ] Verify keyboard shortcuts work
- [ ] Check empty states display
- [ ] Test with long messages
- [ ] Verify profile pictures display
- [ ] Test back navigation

## Performance Optimizations
- Indexed database queries for fast lookups
- Efficient SQL joins for user details
- Client-side message caching
- Lazy loading of conversations
- Optimized polling intervals
- CSS transforms for smooth animations

## Mobile Responsiveness
- Fixed header and input on mobile
- Touch-friendly tap targets (45px+)
- Optimized for small screens
- Bottom navigation for easy access
- Swipe-friendly interface
- Auto-keyboard adjustment

## Future Enhancements (Optional)
- [ ] WebSocket for true real-time messaging
- [ ] Typing indicators
- [ ] Message read receipts
- [ ] Image/file sharing
- [ ] Group chats
- [ ] Message reactions
- [ ] Voice messages
- [ ] Video calls
- [ ] Message search
- [ ] Message deletion
- [ ] Chat archive

## Server Routes Summary
```javascript
// Chat Routes
GET  /chat              → Chat list page
GET  /chat/new          → New chat / user selection
GET  /chat/:userId      → Conversation view

// API Routes
POST /api/send-message           → Send message
GET  /api/get-messages/:userId   → Get conversation
GET  /api/messages/unread-count  → Unread count
```

## Integration Points
- Integrated with existing user authentication
- Uses Bootstrap 5 components
- Follows mobile-first design pattern
- Compatible with existing navbar/bottom-nav
- Shares user profile data
- Uses existing helper functions (timeAgo, getRoleBadge)

## Accessibility
- ARIA labels on buttons
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Focus indicators
- Semantic HTML

---

**Status**: ✅ Fully Implemented and Ready to Use

**Server**: Running on http://localhost:3000

**Access**: Navigate to http://localhost:3000/chat after login
