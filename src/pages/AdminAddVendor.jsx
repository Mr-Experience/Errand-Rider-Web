import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Store, User, MapPin, CreditCard,
  Save, Loader2, ChevronDown, ImagePlus, X
} from 'lucide-react';
import { supabase } from '../supabase';
import { useToast } from '../context/ToastContext';
import './Dashboard.css';

const AdminAddVendor = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: 'Loading...', role: 'admin' });

  // Image state
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const logoInputRef = useRef();
  const coverInputRef = useRef();

  useEffect(() => { getProfile(); }, []);

  const getProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    }
  };

  const [formData, setFormData] = useState({
    business_name: '', business_type: 'Restaurant', description: '',
    full_address: '', city_area: '', gps_location: '', landmark: '',
    owner_name: '', phone_number: '', email: '', password: '',
    alternate_phone: '', whatsapp_number: '',
    bank_name: '', account_number: '', account_name: '',
    nin_verification: '', payout_frequency: 'Weekly',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo') { setLogoFile(file); setLogoPreview(url); }
    else { setCoverFile(file); setCoverPreview(url); }
  };

  const clearImage = (type) => {
    if (type === 'logo') { setLogoFile(null); setLogoPreview(null); logoInputRef.current.value = ''; }
    else { setCoverFile(null); setCoverPreview(null); coverInputRef.current.value = ''; }
  };

  const uploadImage = async (file, bucket, path) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 0. Save admin session so we can restore it after vendor signUp
      const { data: { session: adminSession } } = await supabase.auth.getSession();

      // 1. Create auth user (signUp auto-logs in the new user, displacing admin)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.owner_name, role: 'vendor' } }
      });
      if (authError) throw authError;

      const userId = authData.user.id;
      let logo_url = null;
      let cover_url = null;

      // 2. Upload logo
      if (logoFile) {
        const ext = logoFile.name.split('.').pop();
        logo_url = await uploadImage(logoFile, 'vendor-logos', `${userId}/logo.${ext}`);
      }

      // 3. Upload cover
      if (coverFile) {
        const ext = coverFile.name.split('.').pop();
        cover_url = await uploadImage(coverFile, 'vendor-covers', `${userId}/cover.${ext}`);
      }

      // 4. Restore admin session before DB write
      if (adminSession) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }

      // 5. Insert vendor record (now running as admin again)
      const { error: vendorError } = await supabase.from('vendors').insert([{
        id: userId,
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
        logo_url,
        cover_url,
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
              alt="Profile" className="user-avatar"
            />
          </div>
        </header>

        <section className="content-area" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
          <form className="vendor-form" onSubmit={handleSubmit}>

            {/* Heading */}
            <div className="form-heading">
              <h1 className="page-title" style={{ margin: 0 }}>Register New Vendor</h1>
              <p className="page-subtitle" style={{ margin: 0 }}>Setup a new business profile and account credentials.</p>
            </div>

            {/* ── Section: Business Info ── */}
            <div className="form-section">
              <div className="section-title"><Store size={20} /><h2>Business Information</h2></div>
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
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What does this business sell?" />
                </div>
              </div>
            </div>

            {/* ── Section: Location ── */}
            <div className="form-section">
              <div className="section-title"><MapPin size={20} /><h2>Location & Address</h2></div>
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

            {/* ── Section: Owner & Contact ── */}
            <div className="form-section">
              <div className="section-title"><User size={20} /><h2>Owner & Contact</h2></div>
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

            {/* ── Section: Payout & Bank ── */}
            <div className="form-section">
              <div className="section-title"><CreditCard size={20} /><h2>Payout & Bank Details</h2></div>
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
                  <label>Account Name</label>
                  <input name="account_name" value={formData.account_name} onChange={handleChange} placeholder="Name on account" />
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

            {/* ── Section: Business Branding ── */}
            <div className="form-section">
              <div className="section-title">
                <ImagePlus size={20} />
                <h2>Business Branding</h2>
              </div>

              <div className="cover-upload-wrapper">
                <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageSelect(e, 'cover')} />
                {coverPreview ? (
                  <div className="cover-preview">
                    <img src={coverPreview} alt="Cover" />
                    <button type="button" className="img-clear-btn" onClick={() => clearImage('cover')}><X size={16} /></button>
                  </div>
                ) : (
                  <button type="button" className="cover-upload-btn" onClick={() => coverInputRef.current.click()}>
                    <Upload size={22} color="#adb5bd" />
                    <span>Click to upload cover / banner image</span>
                    <small>Recommended: 1200 × 400px, JPG or PNG</small>
                  </button>
                )}
              </div>

              <div className="logo-upload-row">
                <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageSelect(e, 'logo')} />
                <div className="logo-upload-zone" onClick={() => logoInputRef.current.click()}>
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Logo" className="logo-preview-img" />
                      <button type="button" className="img-clear-btn" onClick={e => { e.stopPropagation(); clearImage('logo'); }}><X size={14} /></button>
                    </>
                  ) : (
                    <><Upload size={20} color="#adb5bd" /><span>Logo</span></>
                  )}
                </div>
                <div className="logo-upload-hint">
                  <p className="logo-hint-title">Business Logo</p>
                  <p className="logo-hint-sub">Square image recommended (e.g. 400 × 400px). PNG with transparent background works best.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/admin/vendors')}>Cancel</button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
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
