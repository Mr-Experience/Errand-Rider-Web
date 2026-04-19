import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bike, 
  DollarSign, 
  UserCircle,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Dashboard.css';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: 'Loading...', role: 'rider' });

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

  const menuItems = [
    { icon: <LayoutDashboard />, label: 'Dashboard', active: true },
    { icon: <Bike />, label: 'Deliveries' },
    { icon: <DollarSign />, label: 'Earning' },
    { icon: <UserCircle />, label: 'Profile' }
  ];

  return (
    <div className="admin-dashboard"> {/* Reusing shared layout class */}
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo" style={{ fontSize: '20px' }}>
            <span className="logo-errand">Errand</span>
            <span className="logo-riders">Riders</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => (
            <a 
              key={idx} 
              href="#" 
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
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
           <div className="activities-panel">
            <h2 className="panel-title">Rider Stats</h2>
            <p style={{ color: '#6c757d' }}>Ready for your next delivery? Track your progress here.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RiderDashboard;
