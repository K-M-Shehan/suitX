import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

// Get authorization header with JWT token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const NotificationService = {
  /**
   * Get all notifications for the current user
   */
  getUserNotifications: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Get only unread notifications
   */
  getUnreadNotifications: async () => {
    try {
      const response = await axios.get(`${API_URL}/unread`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  /**
   * Get count of unread notifications
   */
  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/unread/count`, {
        headers: getAuthHeader()
      });
      return response.data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(`${API_URL}/${notificationId}/read`, {}, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      await axios.put(`${API_URL}/read-all`, {}, {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/${notificationId}`, {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Delete all read notifications
   */
  deleteReadNotifications: async () => {
    try {
      await axios.delete(`${API_URL}/read`, {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }
  }
};

export default NotificationService;
