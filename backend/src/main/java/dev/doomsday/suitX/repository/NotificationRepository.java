package dev.doomsday.suitX.repository;

import dev.doomsday.suitX.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Notification entity
 * Provides custom query methods for notification management
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    // Find all notifications for a user
    List<Notification> findByUserId(String userId);
    
    // Find unread notifications for a user
    List<Notification> findByUserIdAndIsRead(String userId, Boolean isRead);
    
    // Find notifications by type for a user
    List<Notification> findByUserIdAndType(String userId, String type);
    
    // Find notifications for a user ordered by creation date (most recent first)
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    
    // Find unread notifications for a user ordered by creation date
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(String userId, Boolean isRead);
    
    // Find notifications related to a specific entity
    List<Notification> findByRelatedEntityId(String entityId);
    
    // Find notifications for a user related to a specific entity
    List<Notification> findByUserIdAndRelatedEntityId(String userId, String entityId);
    
    // Find high priority unread notifications for a user
    @Query("{ 'userId': ?0, 'isRead': false, 'priority': 'HIGH' }")
    List<Notification> findHighPriorityUnreadNotifications(String userId);
    
    // Find notifications created within a time range
    List<Notification> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end);
    
    // Count unread notifications for a user
    long countByUserIdAndIsRead(String userId, Boolean isRead);
    
    // Count total notifications for a user
    long countByUserId(String userId);
    
    // Count notifications by type for a user
    long countByUserIdAndType(String userId, String type);
    
    // Delete all notifications for a user (cleanup)
    void deleteByUserId(String userId);
    
    // Delete read notifications older than a certain date (maintenance)
    void deleteByIsReadAndCreatedAtBefore(Boolean isRead, LocalDateTime beforeDate);
}
