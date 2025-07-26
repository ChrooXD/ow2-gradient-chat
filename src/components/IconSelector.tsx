import React, { useState, useMemo } from 'react';
import { ChevronDown, Plus, Copy, Check, Search } from 'lucide-react';
import { ICON_CATEGORIES, IconCategory, IconCode } from '../constants/iconCodes';
import { getIconImagePath } from '../utils/colorUtils';

// Icon Image Component with fallback handling
const IconImage: React.FC<{ iconCode: string; iconName: string; className?: string }> = ({ 
  iconCode, 
  iconName, 
  className = "w-8 h-8" 
}) => {
  const [imageError, setImageError] = useState(false);
  const imagePath = getIconImagePath(iconCode);

  if (imageError) {
    // Fallback to a placeholder when image fails to load
    return (
      <div className={`${className} bg-gray-600/50 rounded border border-gray-500/50 flex items-center justify-center`}>
        <span className="text-gray-400 text-xs font-mono">?</span>
      </div>
    );
  }

  return (
    <img
      src={imagePath}
      alt={`${iconName} icon`}
      className={`${className} object-contain rounded border border-white/20`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

interface IconSelectorProps {
  onIconSelect: (iconCode: string) => void;
  hasConsecutiveIcons: boolean;
  maxConsecutive: number;
  maxIcons: number;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ 
  onIconSelect, 
  hasConsecutiveIcons, 
  maxConsecutive, 
  maxIcons 
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories and icons based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return ICON_CATEGORIES;
    
    const lowercaseSearch = searchTerm.toLowerCase().trim();
    
    return ICON_CATEGORIES.map(category => ({
      ...category,
      icons: category.icons.filter(icon => 
        icon.name.toLowerCase().includes(lowercaseSearch) ||
        icon.code.toLowerCase().includes(lowercaseSearch)
      )
    })).filter(category => category.icons.length > 0);
  }, [searchTerm]);

  // Get unique search results (flattened and deduplicated)
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const allMatchingIcons: IconCode[] = [];
    filteredCategories.forEach(category => {
      allMatchingIcons.push(...category.icons);
    });
    
    // Remove duplicates based on code
    const uniqueIcons = allMatchingIcons.filter((icon, index, array) => 
      array.findIndex(i => i.code === icon.code) === index
    );
    
    return uniqueIcons;
  }, [filteredCategories, searchTerm]);



  const toggleCategory = (categoryName: string) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handleIconClick = (icon: IconCode) => {
    onIconSelect(icon.code);
  };

  const copyIconCode = async (e: React.MouseEvent, iconCode: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(iconCode);
      setCopiedIcon(iconCode);
      setTimeout(() => setCopiedIcon(null), 2000);
    } catch (err) {
      console.error('Failed to copy icon code:', err);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20">
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6" />
        Icon Codes
      </h2>
      
      <p className="text-slate-300 text-sm mb-4">
        Click any icon to add it to your text. You can also copy individual codes.
      </p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search icons by name or code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
             </div>

               {/* Icon Warning Info */}
        {hasConsecutiveIcons && (
          <div className="mb-4 p-3 rounded-xl border bg-amber-600/10 border-amber-600/20">
            <p className="text-amber-300 text-xs">
            {maxConsecutive} consecutive icons detected. Icons might not appear in chat if more than {maxIcons} are placed in a row without text between them.
            </p>
            <p className="text-amber-200 text-xs mt-1">
             Add text between icons to ensure they display properly.
            </p>
          </div>
        )}

              {searchTerm.trim() ? (
         /* Search Results - Flat List */
         searchResults.length === 0 ? (
           <div className="text-center py-8">
             <p className="text-slate-400 mb-2">No icons found</p>
             <p className="text-slate-500 text-sm">Try a different search term</p>
           </div>
         ) : (
                       <div className="grid gap-2">
              {searchResults.map((icon: IconCode) => (
               <div
                 key={icon.code}
                 className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
               >
                 {/* Icon Image */}
                 <div className="flex-shrink-0 mr-3">
                   <IconImage iconCode={icon.code} iconName={icon.name} />
                 </div>

                 {/* Icon Info */}
                 <div className="flex-1 min-w-0">
                   <div className="text-white text-sm font-medium truncate">
                     {icon.name}
                   </div>
                   <div className="text-slate-400 text-xs font-mono mt-1 truncate">
                     {icon.code}
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex items-center gap-2 ml-3">
                   {/* Copy Button */}
                   <button
                     onClick={(e) => copyIconCode(e, icon.code)}
                     className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                     title="Copy icon code"
                     aria-label={`Copy ${icon.name} code`}
                   >
                     {copiedIcon === icon.code ? (
                       <Check className="w-4 h-4 text-green-400" />
                     ) : (
                       <Copy className="w-4 h-4" />
                     )}
                   </button>

                   {/* Add to Text Button */}
                   <button
                     onClick={() => handleIconClick(icon)}
                     className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200 font-medium"
                     title="Add to text"
                     aria-label={`Add ${icon.name} to text`}
                   >
                     Add
                   </button>
                 </div>
               </div>
             ))}
           </div>
         )
       ) : (
         /* Category View - Normal Layout */
         <div className="space-y-3">
           {ICON_CATEGORIES.map((category: IconCategory) => (
           <div key={category.name} className="border border-white/10 rounded-xl overflow-hidden">
             {/* Category Header */}
             <button
               onClick={() => toggleCategory(category.name)}
               className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors duration-200"
             >
               <div className="flex items-center gap-3">
                 <span className="text-white font-medium">{category.name}</span>
                 <span className="text-slate-400 text-sm">
                   ({category.icons.length} icons)
                 </span>
               </div>
               <ChevronDown 
                 className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                   openCategory === category.name ? 'rotate-180' : ''
                 }`}
               />
             </button>

             {/* Category Content */}
             {openCategory === category.name && (
               <div className="p-4 bg-black/20">
                                   <div className="grid gap-2">
                    {category.icons.map((icon: IconCode) => (
                     <div
                       key={icon.code}
                       className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200 group"
                     >
                       {/* Icon Image */}
                       <div className="flex-shrink-0 mr-3">
                         <IconImage iconCode={icon.code} iconName={icon.name} />
                       </div>

                       {/* Icon Info */}
                       <div className="flex-1 min-w-0">
                         <div className="text-white text-sm font-medium truncate">
                           {icon.name}
                         </div>
                         <div className="text-slate-400 text-xs font-mono mt-1 truncate">
                           {icon.code}
                         </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="flex items-center gap-2 ml-3">
                         {/* Copy Button */}
                         <button
                           onClick={(e) => copyIconCode(e, icon.code)}
                           className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                           title="Copy icon code"
                           aria-label={`Copy ${icon.name} code`}
                         >
                           {copiedIcon === icon.code ? (
                             <Check className="w-4 h-4 text-green-400" />
                           ) : (
                             <Copy className="w-4 h-4" />
                           )}
                         </button>

                         {/* Add to Text Button */}
                         <button
                           onClick={() => handleIconClick(icon)}
                           className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200 font-medium"
                           title="Add to text"
                           aria-label={`Add ${icon.name} to text`}
                         >
                           Add
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
              )}
            </div>
            ))}
          </div>
        )}

                           {/* Search Results Info */}
        {searchTerm && searchResults.length > 0 && (
          <div className="mt-4 p-3 bg-green-600/10 border border-green-600/20 rounded-xl">
            <p className="text-green-300 text-xs">
              Found {searchResults.length} unique icons
            </p>
          </div>
        )}

               
    </div>
  );
}; 