import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-xs text-slate-400 leading-relaxed">
            <p className="mb-2">
              <strong className="text-slate-300">Disclaimer:</strong> This site is not affiliated with Blizzard Entertainment. 
              All trademarks referenced herein are the properties of their respective owners.
            </p>
            <p>
              Overwatch, Overwatch 2, and all related characters, names, marks, and logos are trademarks of Blizzard Entertainment, Inc.
            </p>
            <p className="mt-2 text-slate-500">
              © {new Date().getFullYear()} Blizzard Entertainment, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}; 