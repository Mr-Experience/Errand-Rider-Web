import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Store, 
  Bike, 
  Wallet, 
  MessageSquare, 
  Settings,
  ChevronDown,
  LogOut,
  Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState({ full_name: 'Loading...', role: 'admin' });
  
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    };
    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const stats = [
    { label: "Today's Revenue", value: "6" },
    { label: "Completed Orders", value: "6" },
    { label: "Pending Orders", value: "6" },
    { label: "Failed Orders", value: "6" }
  ];

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', active: true },
    { icon: <ShoppingBag />, label: 'Orders' },
    { icon: <Users />, label: 'Users' },
    { icon: <Store />, label: 'Vendor' },
    { icon: <Bike />, label: 'Riders' },
    { icon: <Wallet />, label: 'Finance' },
    { icon: <MessageSquare />, label: 'Support & Chat' },
    { icon: <Settings />, label: 'Settings' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo" style={{ fontSize: '20px' }}>
            <span className="logo-errand">Errand</span>
            <span className="logo-riders">Riders</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <a 
            onClick={() => navigate('/admin/dashboard')} 
            className={`nav-item ${location.pathname.includes('/admin/dashboard') ? 'active' : ''}`}
          >
            <LayoutDashboard />
            <span>Dashboard</span>
          </a>
          <a 
            onClick={() => navigate('/admin/vendors')} 
            className={`nav-item ${location.pathname.includes('/admin/vendors') ? 'active' : ''}`}
          >
            <Store />
            <span>Vendors</span>
          </a>
          <a href="#" className="nav-item"><Users /><span>Users</span></a>
          <a href="#" className="nav-item"><Bike /><span>Riders</span></a>
          <a href="#" className="nav-item"><Wallet /><span>Finance</span></a>
          <a href="#" className="nav-item"><Settings /><span>Settings</span></a>
          <button className="logout-item" onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="main-area">
        <header className="top-bar">
          <div className="user-profile">
            <span className="user-name">
              {profile.full_name}
              <ChevronDown size={16} color="#6c757d" />
            </span>
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=f26419&color=fff`} 
              alt="Profile" 
              className="user-avatar" 
            />
          </div>
        </header>

        <section className="content-area">
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon-wrapper">
                  {idx === 0 && <Wallet size={24} color="#f26419" />}
                  {idx === 1 && <ShoppingBag size={24} color="#f26419" />}
                  {idx === 2 && <Loader2 size={24} color="#f26419" className="animate-spin" />}
                  {idx === 3 && <MessageSquare size={24} color="#f26419" />}
                </div>
                <div className="stat-content">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="activities-panel">
            <h2 className="panel-title">Recent Activities</h2>
            {/* Activities list could go here */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
