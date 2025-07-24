import React, { useState, useCallback } from 'react';
import { Copy, Palette, Type, RefreshCw, Check } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [startColor, setStartColor] = useState('#FF3300');
  const [endColor, setEndColor] = useState('#FFFF00');
  const [copied, setCopied] = useState(false);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Generate gradient colors
  const generateGradient = useCallback((text: string, startColor: string, endColor: string) => {
    if (!text || text.length === 0) return [];
    
    const startRgb = hexToRgb(startColor);
    const endRgb = hexToRgb(endColor);
    const length = text.length;
    
    if (length === 1) {
      return [{ char: text[0], color: startColor.replace('#', '') }];
    }

    return text.split('').map((char, index) => {
      const ratio = index / (length - 1);
      const r = startRgb.r + (endRgb.r - startRgb.r) * ratio;
      const g = startRgb.g + (endRgb.g - startRgb.g) * ratio;
      const b = startRgb.b + (endRgb.b - startRgb.b) * ratio;
      
      return {
        char,
        color: rgbToHex(r, g, b)
      };
    });
  }, []);

  const gradientData = generateGradient(text, startColor, endColor);
  const formattedOutput = gradientData.map(({ char, color }) => `<FG${color}>${char}`).join('');

  const copyToClipboard = async () => {
    if (!formattedOutput) return;
    
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setText('');
    setStartColor('#FF3300');
    setEndColor('#FFFF00');
  };

  const presetGradients = [
    { name: 'Fire', start: '#FF3300', end: '#FFFF00' },
    { name: 'Ocean', start: '#008080', end: '#80C0FF' },
    { name: 'Sunset', start: '#FF6B35', end: '#F7931E' },
    { name: 'Purple', start: '#800080', end: '#DDA0DD' },
    { name: 'Rainbow', start: '#FF0000', end: '#FF00FF' },
    { name: 'Gray Fade', start: '#202020', end: '#C0C0C0' },
    { name: 'Ice', start: '#E0FFFF', end: '#B0E0E6' },
    { name: 'Neon Glow', start: '#00FF00', end: '#99FFCC' },
    { name: 'Fade In', start: '#10FFFFFF', end: '#FFFFFFFF' },
    { name: 'Gold Rush', start: '#FFD700', end: '#FFA500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Palette className="w-8 h-8 text-purple-300" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gradient Text Generator
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Create beautiful color gradients for your text with custom formatting output
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Type className="w-6 h-6" />
                  Input Settings
                </h2>
                
                {/* Text Input */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Enter Your Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your text here..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Start Color (Click to Pick)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={startColor}
                        onChange={(e) => setStartColor(e.target.value)}
                        className="w-16 h-16 rounded-xl border-3 border-white/40 bg-transparent cursor-pointer hover:border-blue-400 transition-all duration-200 hover:scale-105 shadow-lg"
                      />
                      <input
                        type="text"
                        value={startColor}
                        onChange={(e) => setStartColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      End Color (Click to Pick)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={endColor}
                        onChange={(e) => setEndColor(e.target.value)}
                        className="w-16 h-16 rounded-xl border-3 border-white/40 bg-transparent cursor-pointer hover:border-purple-400 transition-all duration-200 hover:scale-105 shadow-lg"
                      />
                      <input
                        type="text"
                        value={endColor}
                        onChange={(e) => setEndColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Gradients */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {presetGradients.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setStartColor(preset.start);
                          setEndColor(preset.end);
                        }}
                        className="px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-xs text-white transition-all duration-200 hover:scale-105"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition-all duration-200 hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {/* Preview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h2 className="text-2xl font-semibold text-white mb-6">Preview</h2>
                <div className="bg-black/30 rounded-xl p-6 min-h-[80px] flex items-center justify-center">
                  {text ? (
                    <div className="text-4xl font-bold tracking-wider">
                      {gradientData.map((item, index) => (
                        <span key={index} style={{ color: `#${item.color}` }}>
                          {item.char}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-lg">Enter text to see preview</p>
                  )}
                </div>
              </div>

              {/* Output */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">Formatted Output</h2>
                  {formattedOutput && (
                    <button
                      onClick={copyToClipboard}
                      disabled={!formattedOutput}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <div className="bg-black/30 rounded-xl p-4">
                  {formattedOutput ? (
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
                      {formattedOutput}
                    </pre>
                  ) : (
                    <p className="text-slate-400 text-center py-8">
                      Your formatted output will appear here
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-400">
          <p>Create beautiful gradients with precise color control</p>
        </div>
      </div>
    </div>
  );
}

export default App;