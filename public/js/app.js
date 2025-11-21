/**
 * VCET Alumni Hub - Mobile JavaScript
 */

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Disable long-press context menu on images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });
});

// Active navigation highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.bottom-nav-item');
    
    navItems.forEach(item => {
        if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Image lazy loading fallback
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Use Intersection Observer for older browsers
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Pull to refresh (optional)
let startY = 0;
let isPulling = false;

document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].pageY;
});

document.addEventListener('touchmove', function(e) {
    const currentY = e.touches[0].pageY;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop === 0 && currentY > startY) {
        isPulling = true;
    }
});

document.addEventListener('touchend', function() {
    if (isPulling) {
        // Optional: Trigger refresh
        // location.reload();
    }
    isPulling = false;
});

// Form validation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
});

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Confirm dialogs
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Disable zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Back button handling for Android WebView
window.addEventListener('popstate', function(e) {
    // Handle back navigation
    console.log('Back button pressed');
});

// Network status indicator
window.addEventListener('online', function() {
    console.log('Back online');
    // showToast('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // showToast('No internet connection', 'warning');
});

// Prevent zoom on input focus (iOS)
const addMaximumScaleToMetaViewport = () => {
    const el = document.querySelector('meta[name=viewport]');
    if (el !== null) {
        let content = el.getAttribute('content');
        let re = /maximum\-scale=[0-9\.]+/g;
        
        if (re.test(content)) {
            content = content.replace(re, 'maximum-scale=1.0');
        } else {
            content = [content, 'maximum-scale=1.0'].join(', ');
        }
        
        el.setAttribute('content', content);
    }
};

addMaximumScaleToMetaViewport();

// ========================================
// NOTIFICATION SYSTEM
// ========================================

// Load notification count
function loadNotificationCount() {
    fetch('/api/notifications/count')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const badge = document.getElementById('notificationBadge');
                if (badge) {
                    if (data.count > 0) {
                        badge.textContent = data.count > 99 ? '99+' : data.count;
                        badge.style.display = 'block';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            }
        })
        .catch(err => console.error('Error loading notification count:', err));
}

// Load unread message count
function loadMessageCount() {
    fetch('/api/messages/unread-count')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const badge = document.getElementById('chatBadge');
                if (badge) {
                    if (data.count > 0) {
                        badge.textContent = data.count > 99 ? '99+' : data.count;
                        badge.style.display = 'block';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            }
        })
        .catch(err => console.error('Error loading message count:', err));
}

// Load notifications
function loadNotifications() {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;
    
    notificationList.innerHTML = '<div class="notification-loading"><div class="spinner-border spinner-border-sm text-primary" role="status"></div></div>';
    
    fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.notifications.length > 0) {
                notificationList.innerHTML = '';
                data.notifications.forEach(notif => {
                    const notifEl = createNotificationElement(notif);
                    notificationList.appendChild(notifEl);
                });
            } else {
                notificationList.innerHTML = '<div class="notification-empty"><i class="bi bi-bell-slash"></i><p>No notifications yet</p></div>';
            }
        })
        .catch(err => {
            console.error('Error loading notifications:', err);
            notificationList.innerHTML = '<div class="notification-empty"><p>Error loading notifications</p></div>';
        });
}

// Create notification element
function createNotificationElement(notif) {
    const div = document.createElement('div');
    div.className = `notification-item ${notif.is_read ? '' : 'unread'}`;
    div.onclick = () => markNotificationAsRead(notif.id);
    
    const avatar = notif.from_user_picture 
        ? `<img src="/${notif.from_user_picture}" class="notif-avatar">`
        : `<div class="notif-avatar-placeholder">${notif.from_user_name.charAt(0).toUpperCase()}</div>`;
    
    const icon = notif.type === 'like' ? 'heart-fill text-danger' : 
                 notif.type === 'comment' ? 'chat-fill text-primary' : 
                 'share-fill text-success';
    
    div.innerHTML = `
        ${avatar}
        <div class="notif-content">
            <div class="notif-message">
                <i class="bi bi-${icon}"></i>
                ${notif.message}
            </div>
            <div class="notif-time">${timeAgo(notif.created_at)}</div>
            ${notif.post_content ? `<div class="notif-post-preview">"${notif.post_content.substring(0, 50)}..."</div>` : ''}
        </div>
    `;
    
    return div;
}

// Time ago function
function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return 'Just now';
}

// Toggle notifications dropdown
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            loadNotifications();
        }
    }
}

// Mark notification as read
function markNotificationAsRead(notificationId) {
    fetch('/api/mark-notification-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadNotificationCount();
            loadNotifications();
        }
    });
}

// Mark all as read
function markAllAsRead() {
    fetch('/api/mark-all-notifications-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            loadNotificationCount();
            loadNotifications();
        }
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notificationDropdown');
    const button = document.querySelector('.notification-btn');
    if (dropdown && button && !dropdown.contains(e.target) && !button.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Load notification count on page load
document.addEventListener('DOMContentLoaded', function() {
    loadNotificationCount();
    loadMessageCount();
    // Refresh counts every 30 seconds
    setInterval(loadNotificationCount, 30000);
    setInterval(loadMessageCount, 30000);
});
