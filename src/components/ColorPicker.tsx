import React, { useRef } from 'react';
import { ColorInputProps } from '../types';
import { isValidHexColor } from '../utils/colorUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const ColorPicker: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
  id,
  disabled = false
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleColorBoxClick = () => {
    if (!disabled) {
      colorInputRef.current?.click();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.value;
    if (newValue.startsWith('#') || newValue === '') {
      onChange(newValue);
    } else {
      onChange(`#${newValue}`);
    }
  };

  const isValid = isValidHexColor(value);

  return (
    <div className="space-y-3">
      <Label
        htmlFor={`${id}-text`}
        className={cn(disabled && 'text-muted-foreground')}
      >
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <input
                ref={colorInputRef}
                type="color"
                value={isValid ? value : '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
                id={id}
                aria-label={`${label} color input`}
                disabled={disabled}
              />
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'w-20 h-20 p-0 rounded-xl border-2',
                  disabled && 'cursor-not-allowed opacity-50',
                  !isValid && !disabled && 'border-destructive'
                )}
                style={{ backgroundColor: isValid ? value : '#ff0000' }}
                onClick={handleColorBoxClick}
                disabled={disabled}
                aria-label={`${label} color picker`}
              />
              {!isValid && !disabled && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-destructive-foreground text-xs">!</span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to pick a color</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={handleTextChange}
            disabled={disabled}
            className={cn(
              !isValid && !disabled && 'border-destructive focus-visible:ring-destructive'
            )}
            id={`${id}-text`}
            aria-describedby={!isValid && !disabled ? `${id}-error` : undefined}
            placeholder="#FFFFFF"
          />
          {!isValid && !disabled && (
            <p
              id={`${id}-error`}
              className="text-destructive text-xs mt-1"
              role="alert"
            >
              Invalid hex color format
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
