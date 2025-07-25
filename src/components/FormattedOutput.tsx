import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { COPY_FEEDBACK_DURATION } from '../constants/gradients';

interface FormattedOutputProps {
  formattedOutput: string;
  text: string;
  outputFormat?: 'gradient' | 'solid';
}

export const FormattedOutput: React.FC<FormattedOutputProps> = ({
  formattedOutput,
  text,
  outputFormat = 'gradient'
}) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copyToClipboard = async () => {
    if (!formattedOutput) return;
    
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyError('Failed to copy to clipboard');
      setTimeout(() => setCopyError(null), COPY_FEEDBACK_DURATION);
    }
  };

  const downloadAsFile = () => {
    if (!formattedOutput) return;
    
    const blob = new Blob([formattedOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outputFormat}-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFormatInfo = () => {
    if (outputFormat === 'solid') {
      return {
        name: 'Solid Color',
        description: 'Single color code format',
        length: formattedOutput.length
      };
    }
    return {
      name: 'Gradient',
      description: 'OW2 Chat Color Codes',
      length: formattedOutput.length
    };
  };

  const formatInfo = getFormatInfo();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">
          Formatted Output
        </h2>
        {formattedOutput && (
          <div className="flex items-center gap-2">
            <button
              onClick={downloadAsFile}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
              title="Download as file"
              aria-label="Download formatted output as text file"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!formattedOutput}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105"
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
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
          </div>
        )}
      </div>
      
      <div className="bg-black/30 rounded-xl p-4 relative">
        {formattedOutput ? (
          <>
            <pre 
              className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed"
              role="textbox"
              aria-readonly="true"
              aria-label="Formatted gradient output"
            >
              {formattedOutput}
            </pre>
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Format: {formatInfo.name}</span>
                <span>Length: {formatInfo.length} characters</span>
                {outputFormat === 'gradient' && text && (
                  <span>
                    Colors: {text.length} individual
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400 mb-2">
              Your formatted output will appear here
            </p>
            <p className="text-xs text-slate-500">
              Enter text, select colors, and copy paste to any OW2 chat
            </p>
          </div>
        )}
      </div>

      {copyError && (
        <div 
          className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg"
          role="alert"
        >
          <p className="text-red-400 text-sm">{copyError}</p>
        </div>
      )}
    </div>
  );
}; 