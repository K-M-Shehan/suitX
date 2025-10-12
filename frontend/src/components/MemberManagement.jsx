import { useState, useEffect } from 'react';
import { searchUsers, removeMemberFromProject, getProjectMembers } from '../services/ProjectService';
import { inviteUserToProject } from '../services/InvitationService';
import { getCurrentUser } from '../services/AuthService';

export default function MemberManagement({ projectId, project }) {
  const [members, setMembers] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [invitationMessage, setInvitationMessage] = useState('');

  useEffect(() => {
    loadCurrentUser();
    if (projectId) {
      loadMembers();
    }
  }, [projectId]);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('Error loading current user:', err);
      // Don't set error state, just log it
    }
  };

  const loadMembers = async () => {
    try {
      if (!projectId) return;
      
      const memberIds = await getProjectMembers(projectId);
      setMembers(memberIds);
      
      // Fetch full user details for each member
      const details = await Promise.all(
        memberIds.map(async (userId) => {
          try {
            const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            return null;
          }
        })
      );
      
      setMemberDetails(details.filter(d => d !== null));
    } catch (err) {
      console.error('Error loading members:', err);
      // Don't set error for initial load, just log it
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsers(term);
      
      // Filter out users who are already members or the owner
      const filteredResults = results.filter(
        user => !members.includes(user.id) && user.username !== project?.createdBy
      );
      
      setSearchResults(filteredResults);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      setError(null);
      setSuccess(null);
      
      await inviteUserToProject(projectId, userId, invitationMessage);
      setSuccess('Invitation sent successfully! The user will receive an email.');
      setSearchTerm('');
      setSearchResults([]);
      setInvitationMessage('');
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err.message || 'Failed to send invitation');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      await removeMemberFromProject(projectId, userId);
      setSuccess('Member removed successfully');
      await loadMembers();
    } catch (err) {
      console.error('Error removing member:', err);
      setError(err.message || 'Failed to remove member');
    }
  };

  // Only show if user is project owner
  const isOwner = currentUser?.username === project?.createdBy;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Team Members</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Add Member Section - Only for owners */}
      {isOwner && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invite Team Member
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          
          <textarea
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            placeholder="Optional message for the invitation..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          
          {/* Search Results */}
          {searchTerm && (
            <div className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-gray-500 text-center">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">No users found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {searchResults.map((user) => (
                    <div key={user.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <button
                        onClick={() => handleAddMember(user.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Current Members List */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Current Members ({memberDetails.length})
        </h3>
        
        {memberDetails.length === 0 ? (
          <p className="text-gray-500 text-sm">No members added yet</p>
        ) : (
          <div className="space-y-2">
            {memberDetails.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {member.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.username}
                    </div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                    {member.role && (
                      <div className="text-xs text-gray-400">{member.role}</div>
                    )}
                  </div>
                </div>
                
                {isOwner && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded border border-red-300 hover:border-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
