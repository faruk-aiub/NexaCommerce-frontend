import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { User, Mail, Lock, UserPlus, MapPin, Trash2, Edit2, Plus, Check } from 'lucide-react';

export const ProfileView = () => {
  const { user, login, register, updateProfile, showToast } = useApp();

  // Tab state for auth panel: 'login' or 'register'
  const [authTab, setAuthTab] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConf, setRegPasswordConf] = useState('');

  // Profile update form state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null); // address object if editing
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Address form fields
  const [addressFields, setAddressFields] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    phone: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      const res = await api.getAddresses();
      if (res.status === 'success') {
        setAddresses(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      // Error handled in AppContext toast
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regPassword !== regPasswordConf) {
      showToast('Passwords do not match.', 'danger');
      return;
    }
    try {
      await register(regName, regEmail, regPassword, regPasswordConf);
    } catch (err) {
      // Error handled in AppContext
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileName, profileEmail);
    } catch (err) {
      // Error handled in AppContext
    }
  };

  const handleAddOrUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const res = await api.updateAddress(editingAddress.id, addressFields);
        if (res.status === 'success') {
          showToast('Address updated successfully.', 'success');
          setEditingAddress(null);
        }
      } else {
        const res = await api.addAddress(addressFields);
        if (res.status === 'success') {
          showToast('Address created successfully.', 'success');
        }
      }
      setShowAddressForm(false);
      resetAddressFields();
      await loadAddresses();
    } catch (err) {
      showToast(err.message || 'Failed to save address.', 'danger');
    }
  };

  const handleEditAddressClick = (addr) => {
    setEditingAddress(addr);
    setAddressFields({
      address_line_1: addr.address_line_1 || '',
      address_line_2: addr.address_line_2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postal_code: addr.postal_code || '',
      country: addr.country || '',
      phone: addr.phone || '',
      is_default: addr.is_default || false
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await api.deleteAddress(id);
      if (res.status === 'success') {
        showToast('Address deleted successfully.', 'success');
        await loadAddresses();
      }
    } catch (err) {
      showToast('Failed to delete address.', 'danger');
    }
  };

  const resetAddressFields = () => {
    setAddressFields({
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Bangladesh',
      phone: '',
      is_default: false
    });
    setEditingAddress(null);
  };

  // --- Auth Panel View (Guest) ---
  if (!user) {
    return (
      <div style={{ maxWidth: '420px', margin: '3rem auto' }} className="animate-slide-up">
        {/* Tab Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setAuthTab('login')}
            style={{
              flex: 1,
              padding: '1rem',
              background: 'none',
              border: 'none',
              color: authTab === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: authTab === 'login' ? '2px solid var(--primary)' : 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthTab('register')}
            style={{
              flex: 1,
              padding: '1rem',
              background: 'none',
              border: 'none',
              color: authTab === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: authTab === 'register' ? '2px solid var(--primary)' : 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {/* Tab Contents */}
        <div className="glass-card">
          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}>Welcome Back</h3>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '0.5rem' }}>
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}>Create Account</h3>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={regPasswordConf}
                    onChange={(e) => setRegPasswordConf(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '0.5rem' }}>
                <UserPlus size={16} />
                <span>Register</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- Profile Dashboard View (Logged In) ---
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem' }} className="animate-slide-up">
      {/* Left panel: Info Update */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your Profile</h2>
        
        <form onSubmit={handleProfileUpdate} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Update Details</h3>
          
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="glass-input"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="glass-input"
              style={{ width: '100%' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Save Changes
          </button>
        </form>
      </div>

      {/* Right panel: Addresses Book CRUD */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Address Book</h2>
          {!showAddressForm && (
            <button 
              onClick={() => { resetAddressFields(); setShowAddressForm(true); }}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Add Address</span>
            </button>
          )}
        </div>

        {/* Address form block */}
        {showAddressForm && (
          <form onSubmit={handleAddOrUpdateAddress} className="glass-card animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Address Line 1*</label>
                <input 
                  type="text" 
                  value={addressFields.address_line_1}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, address_line_1: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Address Line 2 (Optional)</label>
                <input 
                  type="text" 
                  value={addressFields.address_line_2}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, address_line_2: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>City*</label>
                <input 
                  type="text" 
                  value={addressFields.city}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, city: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>State/Division*</label>
                <input 
                  type="text" 
                  value={addressFields.state}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, state: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Postal Code*</label>
                <input 
                  type="text" 
                  value={addressFields.postal_code}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, postal_code: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Phone Number*</label>
                <input 
                  type="text" 
                  value={addressFields.phone}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, phone: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Country*</label>
                <input 
                  type="text" 
                  value={addressFields.country}
                  onChange={(e) => setAddressFields(prev => ({ ...prev, country: e.target.value }))}
                  className="glass-input" 
                  style={{ width: '100%' }} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input 
                type="checkbox" 
                id="is_default"
                checked={addressFields.is_default}
                onChange={(e) => setAddressFields(prev => ({ ...prev, is_default: e.target.checked }))}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="is_default" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Set as default address</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowAddressForm(false); resetAddressFields(); }} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Saved Addresses list */}
        {addresses.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No shipping addresses saved yet. Click "Add Address" to create one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {addresses.map(addr => (
              <div key={addr.id} className="glass-card" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <strong style={{ fontSize: '0.95rem' }}>Shipping Address</strong>
                    {addr.is_default && <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>Default</span>}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}{addr.city} - {addr.postal_code}, {addr.country}
                  </p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone: {addr.phone}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => handleEditAddressClick(addr)}
                    className="btn btn-secondary"
                    style={{ width: '32px', height: '32px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-sm)' }}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="btn btn-secondary"
                    style={{ width: '32px', height: '32px', padding: 0, minWidth: 0, borderRadius: 'var(--radius-sm)', borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
