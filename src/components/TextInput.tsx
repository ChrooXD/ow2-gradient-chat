import React, { forwardRef } from 'react';
import { MAX_TEXT_LENGTH } from '../constants/gradients';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  value,
  onChange,
  placeholder = "Type your text here..."
}, ref) => {
  const isAtLimit = value.length >= MAX_TEXT_LENGTH;
  const isNearLimit = value.length >= MAX_TEXT_LENGTH * 0.8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_TEXT_LENGTH) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="text-input">
          Enter Your Text
        </Label>
        <Badge
          variant={isAtLimit ? 'destructive' : isNearLimit ? 'warning' : 'secondary'}
          aria-live="polite"
        >
          {value.length}/{MAX_TEXT_LENGTH}
        </Badge>
      </div>
      <Input
        ref={ref}
        id="text-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          isAtLimit && 'border-destructive focus-visible:ring-destructive'
        )}
        aria-describedby="char-count"
        maxLength={MAX_TEXT_LENGTH}
      />
      {isNearLimit && (
        <p
          id="char-count"
          className={cn(
            'text-xs',
            isAtLimit ? 'text-destructive' : 'text-yellow-500'
          )}
          role="status"
        >
          {isAtLimit
            ? 'Character limit reached'
            : `Approaching character limit (${MAX_TEXT_LENGTH - value.length} remaining)`
          }
        </p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
