import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Plus, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfilePage() {
  const { user, updateUser, isAuthenticated } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru');
  const [newPostal, setNewPostal] = useState('560001');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Please Sign In</h2>
        <p className="text-xs text-gray-500">Sign in to manage your account and addresses.</p>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUser({ name, phone });
      if (res.success) {
        setMsg('Profile updated successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const currentAddresses = user.addresses || [];
    const updated = [
      ...currentAddresses,
      {
        street: newStreet,
        city: newCity,
        postalCode: newPostal,
        state: 'Karnataka',
        isDefault: currentAddresses.length === 0
      }
    ];

    setSaving(true);
    try {
      const res = await updateUser({ addresses: updated });
      if (res.success) {
        setNewStreet('');
        setMsg('Delivery address added!');
        setTimeout(() => setMsg(''), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif">
          My Account Profile
        </h1>
        <p className="text-xs text-gray-500">
          Manage your personal details and saved delivery locations
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Profile Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {user.role} Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 block mt-1">Email is tied to your verified login credentials.</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Profile Details
            </button>
          </form>
        </div>

        {/* Right: Saved Addresses */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <MapPin className="w-4 h-4 text-emerald-600" /> Saved Delivery Addresses
          </h3>

          <div className="space-y-3">
            {user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900">{addr.street}</p>
                  <p className="text-gray-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                  {addr.isDefault && (
                    <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Default Delivery Address
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No saved addresses yet.</p>
            )}
          </div>

          {/* Add New Address Form */}
          <form onSubmit={handleAddAddress} className="pt-3 border-t border-gray-100 space-y-3 text-xs">
            <h4 className="font-bold text-gray-800">Add New Delivery Location</h4>
            <input
              type="text"
              required
              placeholder="House/Apartment & Street Address"
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={newPostal}
                onChange={(e) => setNewPostal(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Save Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

