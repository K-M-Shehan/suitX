const API_BASE_URL = 'http://localhost:8080/api/invitations';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Send invitation to user
export async function inviteUserToProject(projectId, userId, message = '') {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ projectId, userId, message }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send invitation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending invitation:', error);
    throw error;
  }
}

// Get all invitations for current user
export async function getMyInvitations() {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/my-invitations`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch invitations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching invitations:', error);
    throw error;
  }
}

// Get pending invitations
export async function getPendingInvitations() {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/pending`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending invitations');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending invitations:', error);
    throw error;
  }
}

// Accept invitation
export async function acceptInvitation(invitationId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/${invitationId}/accept`, {
      method: 'POST',
      headers: headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to accept invitation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
}

// Reject invitation
export async function rejectInvitation(invitationId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/${invitationId}/reject`, {
      method: 'POST',
      headers: headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reject invitation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error rejecting invitation:', error);
    throw error;
  }
}

// Cancel invitation (by project owner)
export async function cancelInvitation(invitationId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/${invitationId}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel invitation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    throw error;
  }
}
