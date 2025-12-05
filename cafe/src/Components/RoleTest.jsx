import { useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

export function RoleTest() {
  const [loading, setLoading] = useState(false);

  const testRole = async (role) => {
    setLoading(true);
    try {
      await authService.verifyRole(role);
      toast.success(`Access granted for ${role} role!`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Access denied for ${role} role`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Role-Based Access Test</h3>
      <div className="mt-3">
        <button 
          className="btn btn-primary me-2" 
          onClick={() => testRole('user')}
          disabled={loading}
        >
          Test User Access
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => testRole('admin')}
          disabled={loading}
        >
          Test Admin Access
        </button>
      </div>
    </div>
  );
}