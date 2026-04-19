import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile?.role !== requiredRole) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    } catch (err) {
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!authorized) {
    // Redirect to the appropriate login page based on the role we were looking for
    const loginPath = `/${requiredRole}/login`;
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
