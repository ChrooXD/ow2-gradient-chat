import React, { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

// Components
import { TextInput } from './components/TextInput';
import { ColorPicker } from './components/ColorPicker';
import { TransparencyInput } from './components/TransparencyInput';
import { PresetButtons } from './components/PresetButtons';
import { GradientPreview } from './components/GradientPreview';
import { FormattedOutput } from './components/FormattedOutput';

// Hooks
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDebounce } from './hooks/useDebounce';

// Utils & Types
import { generateGradient, generateMultiColorGradient, rgbaToHex, hexToRgba } from './utils/colorUtils';
import { DEFAULT_COLORS, KEYBOARD_SHORTCUTS } from './constants/gradients';
import { GradientPreset } from './types';

type OutputFormat = 'gradient' | 'solid';

function App() {
  // State
  const [text, setText] = useState('');
  const [startColor, setStartColor] = useState(DEFAULT_COLORS.start);
  const [endColor, setEndColor] = useState(DEFAULT_COLORS.end);
  const [startAlpha, setStartAlpha] = useState(255); // Fully opaque
  const [endAlpha, setEndAlpha] = useState(255); // Fully opaque
  const [selectedPreset, setSelectedPreset] = useState<GradientPreset | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('gradient');

  // Debounced text for performance
  const debouncedText = useDebounce(text, 100);

  // Memoized gradient calculation
  const gradientData = useMemo(() => {
    if (selectedPreset) {
      return generateMultiColorGradient(debouncedText, selectedPreset.colors, startAlpha, endAlpha);
    }
    return generateGradient(debouncedText, startColor, endColor, startAlpha, endAlpha);
  }, [debouncedText, startColor, endColor, startAlpha, endAlpha, selectedPreset]);

  const formattedOutput = useMemo(() => {
    if (outputFormat === 'solid') {
      // Use start color for solid output, format: <FGRRGGBBAA> text...
      const rgba = hexToRgba(startColor, startAlpha);
      const colorWithAlpha = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);
      return debouncedText ? `<FG${colorWithAlpha}> ${debouncedText}` : '';
    }
    // Gradient output: <FGRRGGBBAA>char for each character
    return gradientData.map(({ char, color }) => `<FG${color}>${char}`).join('');
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
  };

  const handlePresetSelect = (preset: GradientPreset) => {
    setSelectedPreset(preset);
    // Also update the color pickers to show the first and last color of the preset
    if (preset.colors.length >= 2) {
      setStartColor(preset.colors[0]);
      setEndColor(preset.colors[preset.colors.length - 1]);
    }
  };

  const handleColorChange = (colorType: 'start' | 'end', color: string) => {
    // Clear preset selection when manually changing colors
    setSelectedPreset(null);
    if (colorType === 'start') {
      setStartColor(color);
    } else {
      setEndColor(color);
    }
  };

  const focusTextInput = () => {
    const textInput = document.getElementById('text-input');
    textInput?.focus();
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    [KEYBOARD_SHORTCUTS.CLEAR]: handleClearAll,
    [KEYBOARD_SHORTCUTS.FOCUS_TEXT]: focusTextInput,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              OW2 Chat Gradient Text Generator
            </h1>
          </div>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <section 
              className="space-y-6"
              aria-label="Input settings"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/20">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="sr-only">Input</span>
                  Settings
                  {selectedPreset && (
                    <span className="text-sm font-normal text-purple-300 ml-2">
                      ({selectedPreset.name})
                    </span>
                  )}
                </h2>
                
                {/* Text Input */}
                <TextInput
                  value={text}
                  onChange={setText}
                  placeholder="Type your text here..."
                />

                {/* Output Format Toggle */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-white mb-3">
                    Output Format
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOutputFormat('gradient')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        outputFormat === 'gradient'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      Gradient
                    </button>
                    <button
                      onClick={() => setOutputFormat('solid')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        outputFormat === 'solid'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      Solid Color
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {outputFormat === 'gradient' 
                      ? 'Each character gets its own color (longer output)'
                      : 'Single color for all text (shorter output)'
                    }
                  </p>
                </div>

                {/* Color Pickers */}
                <div className={`grid gap-4 mt-6 ${outputFormat === 'solid' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  <ColorPicker
                    label={outputFormat === 'solid' ? 'Text Color' : 'Start Color'}
                    value={startColor}
                    onChange={(color) => handleColorChange('start', color)}
                    id="startColorPicker"
                    hoverColor="border-blue-400"
                  />
                  
                  {outputFormat === 'gradient' && (
                    <ColorPicker
                      label="End Color"
                      value={endColor}
                      onChange={(color) => handleColorChange('end', color)}
                      id="endColorPicker"
                      hoverColor="border-purple-400"
                    />
                  )}
                </div>

                {/* Transparency Controls */}
                <div className={`grid gap-4 mt-6 ${outputFormat === 'solid' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
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
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Clear all settings and reset to defaults"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Clear All
                  </button>
                  
                  <div className="text-xs text-slate-400 flex items-center gap-2 ml-auto">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Ctrl+Shift+C</kbd>
                    <span>Clear</span>
                  </div>
                </div>
              </div>
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
        </main>

        {/* Footer */}
        <footer className="relative mt-16">
          <div className="absolute bottom-0 right-4 text-xs text-slate-500">
            made by Chroo :)
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;