import React from 'react';
import { X } from 'lucide-react';

interface DisclaimerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-xl max-w-lg w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
          aria-label="Close disclaimer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-4 space-y-4 pt-8">
          {/* Disclaimer Text */}
          <div className="text-center space-y-2">
            <p className="text-white font-medium">
              Since the August 5, 2025 patch
            </p>
            <p className="text-slate-300 text-sm">
              This website is no longer functional to generate displayable gradients and icons in the Overwatch 2 chat
            </p>
          </div>

          {/* Screenshot */}
          <div className="flex justify-center">
            <img 
              src="/ripow2chat.png" 
              alt="Overwatch 2 August 5, 2025 patch screenshot"
              className="max-w-full h-auto rounded border border-slate-600"
            />
          </div>

          {/* Thank you message */}
          <div className="text-center">
            <p className="text-slate-300 text-sm">
              Thank you for using this website! &lt;3
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};