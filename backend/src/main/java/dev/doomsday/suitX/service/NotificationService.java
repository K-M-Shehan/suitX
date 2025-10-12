package dev.doomsday.suitX.service;

import dev.doomsday.suitX.model.Notification;
import dev.doomsday.suitX.model.User;
import dev.doomsday.suitX.repository.NotificationRepository;
import dev.doomsday.suitX.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service for managing user notifications
 */
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    /**
     * Get all notifications for a user, sorted by creation date (newest first)
     */
    public List<Notification> getUserNotifications(String username) {
        String userId = getUserId(username);
        return notificationRepository.findByUserId(userId, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
    }
    
    /**
     * Get only unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(String username) {
        String userId = getUserId(username);
        return notificationRepository.findByUserIdAndIsRead(userId, false, 
            Sort.by(Sort.Direction.DESC, "createdAt"));
    }
    
    /**
     * Get count of unread notifications
     */
    public long getUnreadCount(String username) {
        String userId = getUserId(username);
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }
    
    /**
     * Mark a notification as read
     */
    @Transactional
    public Notification markAsRead(String notificationId, String username) {
        String userId = getUserId(username);
        
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isEmpty()) {
            throw new RuntimeException("Notification not found");
        }
        
        Notification notification = notificationOpt.get();
        
        // Verify the notification belongs to this user
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Notification does not belong to this user");
        }
        
        notification.markAsRead();
        return notificationRepository.save(notification);
    }
    
    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(String username) {
        String userId = getUserId(username);
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsRead(
            userId, false, Sort.unsorted());
        
        unreadNotifications.forEach(Notification::markAsRead);
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Delete a notification (with ownership check)
     */
    @Transactional
    public void deleteNotification(String notificationId, String username) {
        String userId = getUserId(username);
        
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isEmpty()) {
            throw new RuntimeException("Notification not found");
        }
        
        Notification notification = notificationOpt.get();
        
        // Verify the notification belongs to this user
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Notification does not belong to this user");
        }
        
        notificationRepository.deleteById(notificationId);
    }
    
    /**
     * Delete all read notifications for a user
     */
    @Transactional
    public void deleteReadNotifications(String username) {
        String userId = getUserId(username);
        List<Notification> readNotifications = notificationRepository.findByUserIdAndIsRead(
            userId, true, Sort.unsorted());
        
        notificationRepository.deleteAll(readNotifications);
    }
    
    /**
     * Helper method to get userId from username
     */
    private String getUserId(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + username);
        }
        return userOpt.get().getId();
    }
}
