import React, { useState, useMemo } from 'react';
import { Plus, Copy, Check, Search, X } from 'lucide-react';
import { ICON_CATEGORIES, IconCategory, IconCode } from '../constants/iconCodes';
import { getIconImagePath } from '../utils/colorUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Icon Image Component with fallback handling
const IconImage: React.FC<{ iconCode: string; iconName: string; className?: string }> = ({
  iconCode,
  iconName,
  className = "w-8 h-8"
}) => {
  const [imageError, setImageError] = useState(false);
  const imagePath = getIconImagePath(iconCode);

  if (imageError) {
    return (
      <div className={`${className} bg-muted rounded border border-border flex items-center justify-center`}>
        <span className="text-muted-foreground text-xs font-mono">?</span>
      </div>
    );
  }

  return (
    <img
      src={imagePath}
      alt={`${iconName} icon`}
      className={`${className} object-contain rounded border border-border`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
};

// Icon Row Component
const IconRow: React.FC<{
  icon: IconCode;
  copiedIcon: string | null;
  onCopy: (e: React.MouseEvent, code: string) => void;
  onAdd: (icon: IconCode) => void;
}> = ({ icon, copiedIcon, onCopy, onAdd }) => (
  <div className="flex items-center justify-between p-3 bg-accent/50 hover:bg-accent rounded-lg transition-colors duration-200 group">
    <div className="flex-shrink-0 mr-3">
      <IconImage iconCode={icon.code} iconName={icon.name} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium truncate">
        {icon.name}
      </div>
      <div className="text-muted-foreground text-xs font-mono mt-1 truncate">
        {icon.code}
      </div>
    </div>

    <div className="flex items-center gap-2 ml-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => onCopy(e, icon.code)}
        title="Copy icon code"
        aria-label={`Copy ${icon.name} code`}
      >
        {copiedIcon === icon.code ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>

      <Button
        size="sm"
        onClick={() => onAdd(icon)}
        title="Add to text"
        aria-label={`Add ${icon.name} to text`}
      >
        Add
      </Button>
    </div>
  </div>
);

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
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const allMatchingIcons: IconCode[] = [];
    filteredCategories.forEach(category => {
      allMatchingIcons.push(...category.icons);
    });

    const uniqueIcons = allMatchingIcons.filter((icon, index, array) =>
      array.findIndex(i => i.code === icon.code) === index
    );

    return uniqueIcons;
  }, [filteredCategories, searchTerm]);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Icon Codes
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Click any icon to add it to your text. You can also copy individual codes.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search icons by name or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Icon Warning Info */}
        {hasConsecutiveIcons && (
          <Alert variant="warning">
            <AlertDescription>
              <p className="text-xs">
                {maxConsecutive} consecutive icons detected. Icons might not appear in chat if more than {maxIcons} are placed in a row without text between them.
              </p>
              <p className="text-xs mt-1">
                Add text between icons to ensure they display properly.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div>
          {searchTerm.trim() ? (
            searchResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No icons found</p>
                <p className="text-muted-foreground text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((icon: IconCode) => (
                  <IconRow
                    key={icon.code}
                    icon={icon}
                    copiedIcon={copiedIcon}
                    onCopy={copyIconCode}
                    onAdd={handleIconClick}
                  />
                ))}
              </div>
            )
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {ICON_CATEGORIES.map((category: IconCategory) => (
                <AccordionItem key={category.name} value={category.name}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="secondary">
                        {category.icons.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {category.icons.map((icon: IconCode) => (
                        <IconRow
                          key={icon.code}
                          icon={icon}
                          copiedIcon={copiedIcon}
                          onCopy={copyIconCode}
                          onAdd={handleIconClick}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Search Results Info */}
        {searchTerm && searchResults.length > 0 && (
          <Alert>
            <AlertDescription className="text-xs">
              Found {searchResults.length} unique icons
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
