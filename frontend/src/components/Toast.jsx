import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium ${
          isError
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : isInfo
            ? 'bg-blue-50 border-blue-200 text-blue-900'
            : 'bg-emerald-900 border-emerald-700 text-white shadow-emerald-950/20'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        <span className="flex-1 text-xs sm:text-sm">{toast.message}</span>
      </div>
    </div>
  );
}

