import React from 'react';
import { Shield, Bell, Eye, Key } from 'lucide-react';
import { toast } from 'sonner';

export const Settings = () => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Simulation: Preferences configuration saved.');
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h2 className="font-poppins text-lg font-bold text-gray-900">Account Settings</h2>
        <p className="text-xs text-gray-500 font-inter mt-1">Configure your notification toggles and security permissions.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        {/* Toggle rows */}
        <div className="rounded-xl border border-gray-100 p-6 space-y-4 bg-white shadow-sm">
          <h3 className="font-poppins font-bold text-gray-900 text-sm flex items-center space-x-2">
            <Bell className="h-4.5 w-4.5 text-[#E63946]" />
            <span>Preferences Toggles</span>
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div>
              <span className="block text-xs font-bold text-gray-800 font-poppins">Order Status Email alerts</span>
              <p className="text-[10px] text-gray-400 font-inter">Dispatch notification invoices automatically.</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] rounded cursor-pointer" />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="block text-xs font-bold text-gray-800 font-poppins">Concierge Newsletter Alerts</span>
              <p className="text-[10px] text-gray-400 font-inter">Receive recommendations for seasonal luxury lines.</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] rounded cursor-pointer" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 p-6 space-y-4 bg-white shadow-sm">
          <h3 className="font-poppins font-bold text-gray-900 text-sm flex items-center space-x-2">
            <Shield className="h-4.5 w-4.5 text-[#E63946]" />
            <span>Security Configurations</span>
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="block text-xs font-bold text-gray-800 font-poppins">Multifactor Authorization</span>
              <p className="text-[10px] text-gray-400 font-inter">Require secondary auth tokens at checkout.</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-[#E63946] focus:ring-[#E63946] rounded cursor-pointer" />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#E63946] text-white px-6 py-2.5 text-xs font-semibold hover:bg-[#C1121F] shadow-sm transition-colors cursor-pointer"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};
export default Settings;
