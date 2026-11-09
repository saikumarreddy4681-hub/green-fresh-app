import React, { useState } from 'react';
import { MapPin, Navigation, Home, Briefcase, Plus, Check, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function LocationModal() {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    setSavedAddresses,
    showToast
  } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTag, setNewTag] = useState('Home');
  const [newAddressText, setNewAddressText] = useState('');

  if (!isLocationModalOpen) return null;

  const handleSelect = (addr) => {
    setSelectedAddress(addr);
    setIsLocationModalOpen(false);
    showToast(`Delivery location set to ${addr.tag}!`);
  };

  const handleUseCurrentLocation = () => {
    const detected = {
      id: `addr-${Date.now()}`,
      type: 'Current',
      tag: 'Current Location',
      address: '2G74+5C3, Prahlad Nagar / Bellandur, Bengaluru',
      timeEstimate: '11 mins'
    };
    setSelectedAddress(detected);
    setIsLocationModalOpen(false);
    showToast('Detected current location: Delivering in 11 mins!');
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const created = {
      id: `addr-${Date.now()}`,
      type: newTag,
      tag: newTag,
      address: newAddressText.trim(),
      timeEstimate: '12 mins'
    };

    setSavedAddresses(prev => [created, ...prev]);
    setSelectedAddress(created);
    setIsAddingNew(false);
    setNewAddressText('');
    setIsLocationModalOpen(false);
    showToast(`Saved and selected ${newTag} address!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Select Delivery Location</h3>
            <p className="text-xs text-gray-500">Fast 10-15 minute grocery doorstep delivery</p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Detect Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 font-semibold text-sm transition text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
              <Navigation className="w-4 h-4 fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold flex items-center gap-1.5">
                <span>Use Current Location</span>
                <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold uppercase">GPS</span>
              </div>
              <p className="text-xs text-emerald-700/80 truncate">Instant delivery in ~11 minutes</p>
            </div>
          </button>

          {/* Search Location Input */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search delivery area, apartment, street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Saved Addresses List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Addresses</span>
              {!isAddingNew && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              )}
            </div>

            {/* Add New Address Form */}
            {isAddingNew && (
              <form onSubmit={handleAddNew} className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 mb-3">
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewTag(tag)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                        newTag === tag
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <textarea
                  required
                  rows={2}
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  placeholder="Enter house/flat number, building name, street and pincode..."
                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-xs font-semibold px-3 py-1.5 text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {savedAddresses
                .filter(a => !searchQuery || a.address.toLowerCase().includes(searchQuery.toLowerCase()) || a.tag.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((addr) => {
                  const isSelected = selectedAddress?.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelect(addr)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs'
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {addr.tag === 'Home' ? <Home className="w-4 h-4" /> : addr.tag === 'Work' ? <Briefcase className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900">{addr.tag}</span>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                            ⚡ {addr.timeEstimate || '12 mins'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{addr.address}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>⚡ Lightning fast 100% contactless delivery</span>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="font-bold text-emerald-700 hover:underline"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
