import React, { useState, useMemo, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

// Components
import { TextInput } from './components/TextInput';
import { ColorPicker } from './components/ColorPicker';
import { TransparencyInput } from './components/TransparencyInput';
import { PresetButtons } from './components/PresetButtons';
import { GradientPreview } from './components/GradientPreview';
import { FormattedOutput } from './components/FormattedOutput';
import { IconSelector } from './components/IconSelector';
import { DisclaimerPopup } from './components/DisclaimerPopup';

// shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';

// Hooks
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDebounce } from './hooks/useDebounce';

// Utils & Types
import { generateGradientWithIcons, generateDiscreteGradientWithIcons, rgbaToHex, hexToRgba } from './utils/colorUtils';
import { DEFAULT_COLORS, KEYBOARD_SHORTCUTS } from './constants/gradients';
import { GradientPreset } from './types';
import { trackColorInteraction, trackUIInteraction, trackEvent } from './utils/analytics';

type OutputFormat = 'gradient' | 'solid';

const MAX_ICONS_PER_MESSAGE = 4;

function App() {
  // State
  const [text, setText] = useState('');
  const [startColor, setStartColor] = useState(DEFAULT_COLORS.start);
  const [endColor, setEndColor] = useState(DEFAULT_COLORS.end);
  const [startAlpha, setStartAlpha] = useState(255);
  const [endAlpha, setEndAlpha] = useState(255);
  const [selectedPreset, setSelectedPreset] = useState<GradientPreset | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('gradient');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Ref for text input to track cursor position
  const textInputRef = useRef<HTMLInputElement>(null);

  // Debounced text for performance
  const debouncedText = useDebounce(text, 100);

  // Memoized gradient calculation
  const gradientData = useMemo(() => {
    if (selectedPreset) {
      if (selectedPreset.interpolation === 'discrete') {
        return generateDiscreteGradientWithIcons(debouncedText, selectedPreset.colors, startAlpha, endAlpha);
      }
      return generateGradientWithIcons(debouncedText, selectedPreset.colors, startAlpha, endAlpha);
    }
    return generateGradientWithIcons(debouncedText, [startColor, endColor], startAlpha, endAlpha);
  }, [debouncedText, startColor, endColor, startAlpha, endAlpha, selectedPreset]);

  const formattedOutput = useMemo(() => {
    if (outputFormat === 'solid') {
      const rgba = hexToRgba(startColor, startAlpha);
      const colorWithAlpha = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);

      const result: string[] = [];
      let currentTextGroup = '';

      for (const { char, color } of gradientData) {
        if (color === '') {
          if (currentTextGroup) {
            result.push(`<FG${colorWithAlpha}>${currentTextGroup}`);
            currentTextGroup = '';
          }
          result.push(char);
        } else {
          currentTextGroup += char;
        }
      }

      if (currentTextGroup) {
        result.push(`<FG${colorWithAlpha}>${currentTextGroup}`);
      }

      return result.join('');
    }

    return gradientData.map(({ char, color }) => {
      if (color === '') {
        return char;
      }
      return `<FG${color}>${char}`;
    }).join('');
  }, [gradientData, debouncedText, startColor, startAlpha, outputFormat]);

  // Handlers
  const handleClearAll = () => {
    setText('');
    setStartColor(DEFAULT_COLORS.start);
    setEndColor(DEFAULT_COLORS.end);
    setStartAlpha(255);
    setEndAlpha(255);
    setSelectedPreset(null);
    setOutputFormat('gradient');

    trackUIInteraction('click', 'reset_all');
  };

  const handlePresetSelect = (preset: GradientPreset) => {
    setSelectedPreset(preset);
    if (preset.colors.length >= 2) {
      setStartColor(preset.colors[0]);
      setEndColor(preset.colors[preset.colors.length - 1]);
    }

    trackColorInteraction('pick', 'gradient', preset.name);
  };

  const handleColorChange = (colorType: 'start' | 'end', color: string) => {
    setSelectedPreset(null);
    if (colorType === 'start') {
      setStartColor(color);
    } else {
      setEndColor(color);
    }

    trackColorInteraction('pick', 'custom', `${colorType}_color`);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);

    if (newText.length > 0 && newText.length % 10 === 0) {
      trackEvent('text_input', 'user_engagement', `length_${newText.length}`);
    }

    const iconMatches = newText.match(/<TX[C]?[0-9A-Fa-f]+>/gi);
    if (iconMatches && iconMatches.length > 0) {
      trackEvent('icon_usage', 'content_creation', `icons_${iconMatches.length}`);
    }
  };

  const handleOutputFormatChange = (value: string) => {
    if (value) {
      setOutputFormat(value as OutputFormat);
      trackUIInteraction('toggle', 'output_format', value);
    }
  };

  const focusTextInput = () => {
    textInputRef.current?.focus();
  };

  const handleDisclaimerClose = () => {
    setShowDisclaimer(false);
  };

  const checkConsecutiveIcons = (text: string): { hasConsecutiveIcons: boolean; maxConsecutive: number } => {
    const iconRegex = /<TX[C]?[0-9A-Fa-f]+>/gi;
    let match;
    let lastEnd = 0;
    let consecutiveCount = 0;
    let maxConsecutive = 0;
    let hasConsecutiveIcons = false;

    while ((match = iconRegex.exec(text)) !== null) {
      const textBetween = text.slice(lastEnd, match.index).trim();

      if (textBetween === '') {
        consecutiveCount++;
      } else {
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
        consecutiveCount = 1;
      }

      lastEnd = match.index + match[0].length;
    }

    maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
    hasConsecutiveIcons = maxConsecutive > MAX_ICONS_PER_MESSAGE;

    return { hasConsecutiveIcons, maxConsecutive };
  };

  const iconStatus = useMemo(() => {
    return checkConsecutiveIcons(text);
  }, [text]);

  const handleIconSelect = (iconCode: string) => {
    const input = textInputRef.current;
    if (input) {
      const cursorPosition = input.selectionStart || 0;
      setText(prevText => {
        const newText = prevText.slice(0, cursorPosition) + iconCode + prevText.slice(cursorPosition);
        return newText;
      });

      setTimeout(() => {
        if (input) {
          const newCursorPosition = cursorPosition + iconCode.length;
          input.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    } else {
      setText(prevText => prevText + iconCode);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    [KEYBOARD_SHORTCUTS.CLEAR]: handleClearAll,
    [KEYBOARD_SHORTCUTS.FOCUS_TEXT]: focusTextInput,
  });

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Icon & Gradient Generator
              </h1>
            </div>
          </header>

          <main className="max-w-6xl mx-auto">
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
              {/* Input Section */}
              <section
                className="space-y-6"
                aria-label="Input settings"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Settings
                      {selectedPreset && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          ({selectedPreset.name})
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Text Input */}
                    <TextInput
                      ref={textInputRef}
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Type your text here..."
                    />

                    {/* Output Format Toggle */}
                    <div className="space-y-3">
                      <Label>Output Format</Label>
                      <ToggleGroup
                        type="single"
                        value={outputFormat}
                        onValueChange={handleOutputFormatChange}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="gradient" aria-label="Gradient mode">
                          Gradient
                        </ToggleGroupItem>
                        <ToggleGroupItem value="solid" aria-label="Solid color mode">
                          Solid Color
                        </ToggleGroupItem>
                      </ToggleGroup>
                      <p className="text-xs text-muted-foreground">
                        {outputFormat === 'gradient'
                          ? 'Each character gets its own color (longer output)'
                          : 'Single color for all text (shorter output)'
                        }
                      </p>
                    </div>

                    {/* Color Pickers */}
                    <div className={`grid gap-4 ${outputFormat === 'solid' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      <ColorPicker
                        label={outputFormat === 'solid' ? 'Text Color' : 'Start Color'}
                        value={startColor}
                        onChange={(color) => handleColorChange('start', color)}
                        id="startColorPicker"
                      />

                      {outputFormat === 'gradient' && (
                        <ColorPicker
                          label="End Color"
                          value={endColor}
                          onChange={(color) => handleColorChange('end', color)}
                          id="endColorPicker"
                        />
                      )}
                    </div>

                    {/* Transparency Controls */}
                    <div className={`grid gap-4 ${outputFormat === 'solid' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      <TransparencyInput
                        label={outputFormat === 'solid' ? 'Text Transparency' : 'Start Transparency'}
                        value={startAlpha}
                        onChange={setStartAlpha}
                      />

                      {outputFormat === 'gradient' && (
                        <TransparencyInput
                          label="End Transparency"
                          value={endAlpha}
                          onChange={setEndAlpha}
                        />
                      )}
                    </div>

                    {/* Presets */}
                    {outputFormat === 'gradient' && (
                      <PresetButtons onPresetSelect={handlePresetSelect} />
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={handleClearAll}
                        aria-label="Clear all settings and reset to defaults"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                        Clear All
                      </Button>

                      <div className="text-xs text-muted-foreground flex items-center gap-2 ml-auto">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+C</kbd>
                        <span>Clear</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Output Section */}
              <section
                className="space-y-6"
                aria-label="Preview and output"
              >
                {/* Preview */}
                <GradientPreview
                  gradientData={gradientData}
                  text={debouncedText}
                  outputFormat={outputFormat}
                  startColor={startColor}
                  startAlpha={startAlpha}
                />

                {/* Output */}
                <FormattedOutput
                  formattedOutput={formattedOutput}
                  text={debouncedText}
                  outputFormat={outputFormat}
                />
              </section>
            </div>

            {/* Icon Selector Section */}
            <section className="mt-8" aria-label="Icon codes">
              <IconSelector
                onIconSelect={handleIconSelect}
                hasConsecutiveIcons={iconStatus.hasConsecutiveIcons}
                maxConsecutive={iconStatus.maxConsecutive}
                maxIcons={MAX_ICONS_PER_MESSAGE}
              />
            </section>
          </main>

          {/* Footer */}
          <footer className="relative mt-16">
            <div className="flex justify-between items-end text-xs text-muted-foreground px-4">
              <div className="max-w-md text-left">
                <p className="mb-1">
                  This site is not affiliated with Blizzard Entertainment. All trademarks referenced herein are the properties of their respective owners.
                </p>
                <p>© 2025 Blizzard Entertainment, Inc.</p>
              </div>
              <div>
                made by Chroo :)

                <p>s/o myst for the icon codes</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Disclaimer Popup */}
        <DisclaimerPopup
          isOpen={showDisclaimer}
          onClose={handleDisclaimerClose}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
