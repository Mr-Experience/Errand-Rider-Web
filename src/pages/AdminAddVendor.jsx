import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Store, 
  User, 
  MapPin, 
  CreditCard, 
  FileText,
  Save,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../supabase';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

const AdminAddVendor = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: 'Loading...', role: 'admin' });

  useEffect(() => {
    getProfile();
  }, []);

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

  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'Restaurant',
    description: '',
    full_address: '',
    city_area: '',
    gps_location: '',
    landmark: '',
    owner_name: '',
    phone_number: '',
    email: '',
    password: '', // Admin sets initial password
    alternate_phone: '',
    whatsapp_number: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    nin_verification: '',
    payout_frequency: 'Weekly',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Auth User (Using standard signup for now)
      // Note: Ideally this should be an Edge Function to avoid session swapping
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.owner_name,
            role: 'vendor'
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert into Vendors table
      const { error: vendorError } = await supabase
        .from('vendors')
        .insert([{
          id: authData.user.id,
          business_name: formData.business_name,
          business_type: formData.business_type,
          description: formData.description,
          full_address: formData.full_address,
          city_area: formData.city_area,
          gps_location: formData.gps_location,
          landmark: formData.landmark,
          owner_name: formData.owner_name,
          phone_number: formData.phone_number,
          email: formData.email,
          alternate_phone: formData.alternate_phone,
          whatsapp_number: formData.whatsapp_number,
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_name: formData.account_name,
          nin_verification: formData.nin_verification,
          payout_frequency: formData.payout_frequency,
          status: 'active'
        }]);

      if (vendorError) throw vendorError;

      addToast('Vendor registered successfully!', 'success');
      navigate('/admin/vendors');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <main className="main-area" style={{ flex: 1 }}>
        <header className="top-bar">
          <button className="back-btn" onClick={() => navigate('/admin/vendors')}>
            <ArrowLeft size={18} />
            <span>Back to Vendors</span>
          </button>

          <div className="user-profile" style={{ marginLeft: 'auto' }}>
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

        <section className="content-area" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
          <form className="vendor-form" onSubmit={handleSubmit}>
            {/* Form heading inside the card */}
            <div className="form-heading">
              <h1 className="page-title" style={{ margin: 0 }}>Register New Vendor</h1>
              <p className="page-subtitle" style={{ margin: 0 }}>Setup a new business profile and account credentials.</p>
            </div>
            {/* Section: Business Info */}
            <div className="form-section">
              <div className="section-title">
                <Store size={20} />
                <h2>Business Information</h2>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Business Name</label>
                  <input name="business_name" required value={formData.business_name} onChange={handleChange} placeholder="e.g. Mama Put Express" />
                </div>
                <div className="form-group">
                  <label>Business Type</label>
                  <select name="business_type" value={formData.business_type} onChange={handleChange}>
                    <option>Restaurant</option>
                    <option>Supermarket</option>
                    <option>Local Market</option>
                    <option>Pharmacy</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description (Short Bio)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What does this business sell?"></textarea>
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div className="form-section">
              <div className="section-title">
                <MapPin size={20} />
                <h2>Location & Address</h2>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Full Address</label>
                  <input name="full_address" required value={formData.full_address} onChange={handleChange} placeholder="e.g. 12 Adeola Hopewell St." />
                </div>
                <div className="form-group">
                  <label>City / Area</label>
                  <input name="city_area" required value={formData.city_area} onChange={handleChange} placeholder="e.g. Victoria Island" />
                </div>
                <div className="form-group">
                  <label>Landmark</label>
                  <input name="landmark" value={formData.landmark} onChange={handleChange} placeholder="e.g. Opposite Eko Hotel" />
                </div>
              </div>
            </div>

            {/* Section: Owner Contact */}
            <div className="form-section">
              <div className="section-title">
                <User size={20} />
                <h2>Owner & Contact</h2>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Owner Full Name</label>
                  <input name="owner_name" required value={formData.owner_name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Email Address (used for login)</label>
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="vendor@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone_number" required value={formData.phone_number} onChange={handleChange} placeholder="08012345678" />
                </div>
                <div className="form-group">
                  <label>Set Initial Password</label>
                  <input name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="Min 6 characters" />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number</label>
                  <input name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} placeholder="08012345678" />
                </div>
              </div>
            </div>

            {/* Section: Payment */}
            <div className="form-section">
              <div className="section-title">
                <CreditCard size={20} />
                <h2>Payout & Bank Details</h2>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Bank Name</label>
                  <input name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="e.g. Zenith Bank" />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input name="account_number" value={formData.account_number} onChange={handleChange} placeholder="10 Digits" />
                </div>
                <div className="form-group">
                  <label>Payout Frequency</label>
                  <select name="payout_frequency" value={formData.payout_frequency} onChange={handleChange}>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/admin/vendors')}>Cancel</button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                <span>{loading ? 'Registering...' : 'Register Vendor'}</span>
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminAddVendor;
