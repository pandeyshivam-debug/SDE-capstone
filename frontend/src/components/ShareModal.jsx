// components/ShareModal.jsx
import { useState, useEffect } from 'react';
import { X, Mail, UserPlus, Trash2  } from 'lucide-react';

function ShareModal({ isOpen, onClose, fileId }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('write');
  const [sharing, setSharing] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(null)

  // Fetch existing collaborators when modal opens
  const fetchCollaborators = async () => {
    if (!fileId) return;
    
    setLoading(true);
    const token = localStorage.getItem('backendToken');
    // console.log('🔍 Token being sent:', token);
    // console.log('🔍 Token exists:', !!token);
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}/collaborators`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('backendToken')}`
        }
      });
      
      // console.log('Response status:', response.status);
      // console.log('Response headers:', response.headers);

      // const responseText = await response.text();
      // console.log('Raw response:', responseText);

      if (response.ok) {
        const data = await response.json();
        setCollaborators(data);
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
    setLoading(false);
  };

  // Share file with new collaborator
  const handleShare = async () => {
    if (!email.trim()) return;
    
    setSharing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('backendToken')}`
        },
        body: JSON.stringify({ 
          collaboratorEmail: email.trim(),
          permission
        })
      });

      if (response.ok) {
        alert('File shared successfully!');
        setEmail('');
        fetchCollaborators(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to share file');
      }
    } catch (error) {
      alert('Error sharing file');
      console.error('Share error:', error);
    }
    setSharing(false);
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!confirm('Are you sure you want to remove this collaborator\'s access?')) {
      return;
    }

    setRemoving(collaboratorId);
    try {
      const response = await fetch(`http://localhost:5000/api/files/${fileId}/collaborators/${collaboratorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('backendToken')}`
        }
      });

      if (response.ok) {
        alert('Collaborator access removed successfully!');
        fetchCollaborators(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove collaborator access');
      }
    } catch (error) {
      alert('Error removing collaborator access');
      console.error('Remove collaborator error:', error);
    }
    setRemoving(null);
  };

  // Open modal effect
  useEffect(() => {
    if (isOpen) {
      fetchCollaborators();
    }
  }, [isOpen, fileId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserPlus size={20} />
            Share Document
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add Collaborator Section */}
        <div className="p-4 border-b">
          <label className="block text-sm font-medium mb-2">
            Add Collaborator
          </label>
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleShare();
                  }
                }}
              />
            </div>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="write">Can Edit</option>
              <option value="read">View Only</option>
            </select>
          </div>
          <button
            onClick={handleShare}
            disabled={sharing || !email.trim()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            <Mail size={16} />
            {sharing ? 'Sharing...' : 'Share Access'}
          </button>
        </div>

        {/* Current Collaborators Section */}
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3">Current Collaborators</h4>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : collaborators.length === 0 ? (
            <p className="text-sm text-gray-500">No collaborators yet</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {collaborators.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{collab.collaboratorEmail}</p>
                    <p className="text-xs text-gray-500">
                      {collab.permission === 'write' ? 'Can Edit' : 'View Only'} • 
                      Added {new Date(collab.createdAt).toLocaleDateString()}
                    </p>

                  </div>
                  {/* ✅ ADD THIS REMOVE BUTTON */}
                  <button
                    onClick={() => handleRemoveCollaborator(collab.collaboratorId)}
                    disabled={removing === collab.collaboratorId}
                    className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Remove access"
                  >
                    {removing === collab.collaboratorId ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
