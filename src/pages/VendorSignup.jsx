import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabase';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const VendorSignup = () => {
  const toast = useToast();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullname,
          role: 'vendor'
        }
      }
    });

    if (signupError) {
      toast.error(signupError.message);
      setLoading(false);
    } else {
      toast.success('Vendor registration successful! Please verify your email.');
      navigate('/vendor/login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Vendor Registration</h1>
          <p>Join our marketplace and reach more customers</p>
        </div>
        <form className="login-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="fullname">Business / Owner Name</label>
            <input 
              type="text" 
              id="fullname" 
              placeholder="Enter name" 
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
              placeholder="vendor@example.com" 
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
            {loading ? 'Registering...' : 'Register Merchant'}
          </button>
        </form>
        <div className="login-footer">
          <p>Already have an account? <Link to="/vendor/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
