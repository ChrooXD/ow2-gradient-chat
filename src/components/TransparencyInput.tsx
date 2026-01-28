import React from 'react';
import { TransparencyInputProps } from '../types';
import { alphaToPercentage, percentageToAlpha } from '../utils/colorUtils';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const TransparencyInput: React.FC<TransparencyInputProps> = ({
  label,
  value,
  onChange,
  disabled = false
}) => {
  const percentage = alphaToPercentage(value);

  const handleSliderChange = (values: number[]) => {
    const newPercentage = values[0];
    const newAlpha = percentageToAlpha(newPercentage);
    onChange(newAlpha);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace('%', '');
    const newPercentage = Math.max(0, Math.min(100, parseInt(inputValue) || 0));
    const newAlpha = percentageToAlpha(newPercentage);
    onChange(newAlpha);
  };

  return (
    <div className="space-y-3">
      <Label className={cn(disabled && 'text-muted-foreground')}>
        {label}
      </Label>

      <div className="flex items-center gap-3">
        {/* Slider */}
        <Slider
          value={[percentage]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          disabled={disabled}
          className="flex-1"
        />

        {/* Input */}
        <Input
          type="text"
          value={`${percentage}%`}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-20 text-center"
          placeholder="100%"
        />
      </div>

      {/* Visual indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div
          className="w-4 h-4 rounded border border-border"
          style={{
            background: `rgba(255, 255, 255, ${value / 255})`,
            backdropFilter: 'blur(1px)'
          }}
        />
        <span>
          {percentage}% opacity ({value}/255)
        </span>
      </div>
    </div>
  );
};
