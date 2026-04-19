import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, MapPin, Phone, Mail, MoreVertical,
  LayoutDashboard, Users, Store, Bike, Wallet, Settings,
  LogOut, ChevronDown, ExternalLink
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
import './Dashboard.css';

const typeColors = {
  Restaurant:    { bg: '#fff3e0', color: '#e65100' },
  Supermarket:   { bg: '#e8f5e9', color: '#2e7d32' },
  'Local Market':{ bg: '#e3f2fd', color: '#1565c0' },
};

const statusColors = {
  active:   { bg: '#e6fffa', color: '#2c7a7b' },
  inactive: { bg: '#fdf0f0', color: '#c0392b' },
  pending:  { bg: '#fff8e1', color: '#f57c00' },
};

const AdminVendors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vendors, setVendors]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [profile, setProfile]     = useState({ full_name: 'Loading...', role: 'admin' });

  useEffect(() => {
    fetchVendors();
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchVendors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setVendors(data || []);
    setLoading(false);
  };

  const filtered = vendors.filter(v =>
    v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.city_area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

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
          <a onClick={() => navigate('/admin/dashboard')}
            className={`nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard /><span>Dashboard</span>
          </a>
          <a onClick={() => navigate('/admin/vendors')}
            className={`nav-item ${location.pathname.startsWith('/admin/vendors') ? 'active' : ''}`}>
            <Store /><span>Vendors</span>
          </a>
          <a href="#" className="nav-item"><Users /><span>Users</span></a>
          <a href="#" className="nav-item"><Bike /><span>Riders</span></a>
          <a href="#" className="nav-item"><Wallet /><span>Finance</span></a>
          <a href="#" className="nav-item"><Settings /><span>Settings</span></a>
          <button className="logout-item" onClick={handleLogout}>
            <LogOut /><span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main */}
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
          {/* Page header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Vendors</h1>
              <p className="page-subtitle">All restaurants, supermarkets and local markets on Errand Riders.</p>
            </div>
          </div>

          {/* Card wrapping toolbar + table */}
          <div className="vendors-card">
            {/* Toolbar */}
            <div className="vendors-toolbar">
              <div className="search-bar">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by name, owner or city…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="toolbar-right">
                <span className="vendor-count">{filtered.length} vendor{filtered.length !== 1 ? 's' : ''}</span>
                <button className="add-btn" onClick={() => navigate('/admin/vendors/add')}>
                  <Plus size={16} />
                  <span>Add Vendor</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="vt-wrapper">
              <table className="vt-table">
                <thead>
                  <tr>
                    <th>Business</th>
                    <th>Owner</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="vt-empty">
                        <div className="vt-loader">
                          <div className="vt-spinner" />
                          <span>Loading vendors…</span>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="vt-empty">
                        <div className="vt-no-data">
                          <Store size={40} color="#dee2e6" />
                          <p>No vendors found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
                          <button className="add-btn" onClick={() => navigate('/admin/vendors/add')}>
                            <Plus size={15} /><span>Add First Vendor</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(vendor => {
                      const statusKey = (vendor.status || 'active').toLowerCase();
                      const typeStyle = typeColors[vendor.business_type] || { bg: '#f1f3f5', color: '#495057' };
                      const statusStyle = statusColors[statusKey] || statusColors.active;

                      return (
                        <tr key={vendor.id} className="vt-row">
                          {/* Business */}
                          <td>
                            <div className="vt-business">
                              {vendor.logo_url ? (
                                <img src={vendor.logo_url} alt={vendor.business_name} className="vt-avatar-img" />
                              ) : (
                                <div className="vt-avatar-initials">
                                  {getInitials(vendor.business_name)}
                                </div>
                              )}
                              <div className="vt-biz-info">
                                <span className="vt-biz-name">{vendor.business_name}</span>
                                <span className="vt-biz-id">#{vendor.id?.slice(0, 8)}</span>
                              </div>
                            </div>
                          </td>

                          {/* Owner */}
                          <td>
                            <span className="vt-owner">{vendor.owner_name || '—'}</span>
                          </td>

                          {/* Location */}
                          <td>
                            <div className="vt-location">
                              <MapPin size={13} />
                              <span>{vendor.city_area || 'N/A'}</span>
                            </div>
                          </td>

                          {/* Type badge */}
                          <td>
                            <span className="vt-badge" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                              {vendor.business_type || '—'}
                            </span>
                          </td>

                          {/* Contact */}
                          <td>
                            <div className="vt-contact">
                              {vendor.phone_number && (
                                <a href={`tel:${vendor.phone_number}`} className="vt-contact-icon" title={vendor.phone_number}>
                                  <Phone size={14} />
                                </a>
                              )}
                              {vendor.email && (
                                <a href={`mailto:${vendor.email}`} className="vt-contact-icon" title={vendor.email}>
                                  <Mail size={14} />
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            <span className="vt-status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                              <span className="vt-status-dot" style={{ background: statusStyle.color }} />
                              {vendor.status ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1) : 'Active'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td>
                            <div className="vt-actions">
                              <button className="vt-action-btn" title="View details">
                                <ExternalLink size={15} />
                              </button>
                              <button className="vt-action-btn" title="More options">
                                <MoreVertical size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminVendors;
