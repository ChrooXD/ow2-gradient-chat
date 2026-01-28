import React from 'react';
import { GradientPreset } from '../types';
import { GRADIENT_PRESETS } from '../constants/gradients';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface PresetButtonsProps {
  onPresetSelect: (preset: GradientPreset) => void;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({ onPresetSelect }) => {
  const groupedPresets = GRADIENT_PRESETS.reduce((acc, preset) => {
    const category = preset.category || 'neutral';
    if (!acc[category]) acc[category] = [];
    acc[category].push(preset);
    return acc;
  }, {} as Record<string, GradientPreset[]>);

  const renderColorPreview = (colors: string[]) => {
    if (colors.length <= 2) {
      return (
        <div className="flex h-2 w-4 rounded-sm overflow-hidden">
          <div
            className="w-2 h-full"
            style={{ backgroundColor: colors[0] }}
          />
          <div
            className="w-2 h-full"
            style={{ backgroundColor: colors[colors.length - 1] }}
          />
        </div>
      );
    } else {
      const segmentWidth = 16 / colors.length;
      return (
        <div className="flex h-2 w-4 rounded-sm overflow-hidden">
          {colors.map((color, index) => (
            <div
              key={index}
              className="h-full"
              style={{
                backgroundColor: color,
                width: `${segmentWidth}px`,
                minWidth: '2px'
              }}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="mt-6">
      <Label className="mb-3 block">Quick Presets</Label>
      <ScrollArea className="h-40">
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(groupedPresets).map(([category, presets]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-sm py-2">
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-wider text-xs">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {presets.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2 pb-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => onPresetSelect(preset)}
                      className="h-auto px-2 py-1.5 text-xs justify-start"
                      aria-label={`Apply ${preset.name} gradient preset with ${preset.colors.length} colors`}
                      title={`${preset.name}: ${preset.colors.join(' → ')}`}
                    >
                      <div className="flex items-center gap-1">
                        {renderColorPreview(preset.colors)}
                        <span className="truncate">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
};
