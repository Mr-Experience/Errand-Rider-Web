import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';
import './Auth.css';

const AdminSignup = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullname,
          role: 'admin'
        }
      }
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      alert('Admin registration successful! Please verify your email or sign in.');
      navigate('/admin/login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Registration</h1>
          <p>Create an account to manage the Errand Riders platform</p>
        </div>
        <form className="login-form" onSubmit={handleSignup}>
          {error && <div className="error-message" style={{ color: 'red', fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input 
              type="text" 
              id="fullname" 
              placeholder="Enter your full name" 
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="admin@errandriders.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register as Admin'}
          </button>
        </form>
        <div className="login-footer">
          <p>Already have an account? <Link to="/admin/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
