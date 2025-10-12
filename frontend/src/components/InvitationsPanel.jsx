import { useState, useEffect } from 'react';
import { getPendingInvitations, acceptInvitation, rejectInvitation } from '../services/InvitationService';

export default function InvitationsPanel() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await getPendingInvitations();
      setInvitations(data);
    } catch (err) {
      console.error('Error loading invitations:', err);
      setError('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await acceptInvitation(invitationId);
      // Reload invitations after accepting
      await loadInvitations();
    } catch (err) {
      console.error('Error accepting invitation:', err);
      alert(err.message || 'Failed to accept invitation');
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await rejectInvitation(invitationId);
      // Reload invitations after rejecting
      await loadInvitations();
    } catch (err) {
      console.error('Error rejecting invitation:', err);
      alert(err.message || 'Failed to reject invitation');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Project Invitations</h2>
        <p className="text-gray-500">Loading invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Project Invitations</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Project Invitations</h2>
        <p className="text-gray-500">No pending invitations</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Project Invitations ({invitations.length})
      </h2>

      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {invitation.projectName}
                </h3>
                <p className="text-sm text-gray-600">
                  Invited by <span className="font-medium">{invitation.invitedBy}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Invited on</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(invitation.invitedAt)}
                </p>
              </div>
            </div>

            {invitation.message && (
              <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-100">
                <p className="text-sm text-gray-700 italic">"{invitation.message}"</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Expires on {formatDate(invitation.expiresAt)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleReject(invitation.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAccept(invitation.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
