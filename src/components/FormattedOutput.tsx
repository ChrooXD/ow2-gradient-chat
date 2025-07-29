import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, AlertTriangle } from 'lucide-react';
import { COPY_FEEDBACK_DURATION } from '../constants/gradients';
import { splitFormattedOutput } from '../utils/colorUtils';
import { trackCopyAction, trackUIInteraction } from '../utils/analytics';

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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  // Split the output into chunks for OW2 chat limit
  const messageChunks = useMemo(() => splitFormattedOutput(formattedOutput), [formattedOutput]);
  const exceedsLimit = formattedOutput.length > 200;
  const exceedsMaxMessages = messageChunks.length > 4;

  const copyToClipboard = async (text: string, index: number = -1) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setCopyError(null);
      setTimeout(() => setCopiedIndex(null), COPY_FEEDBACK_DURATION);
      
      // Track the copy action
      trackCopyAction(
        index === -1 ? 'full_output' : `chunk_${index + 1}`,
        outputFormat
      );
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
    
    // Track the download action
    trackUIInteraction('download', 'formatted_output', outputFormat);
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
            {!exceedsLimit && (
              <button
                onClick={() => copyToClipboard(formattedOutput, -1)}
                disabled={!formattedOutput}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105"
                aria-label={copiedIndex === -1 ? 'Copied to clipboard' : 'Copy to clipboard'}
              >
                {copiedIndex === -1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy All
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
      
             {/* Character Limit Warnings */}
       {exceedsLimit && (
         <div className="mb-4 p-4 bg-amber-600/10 border border-amber-600/20 rounded-xl">
           <p className="text-amber-200 text-xs mb-2">
             <strong>Reminder:</strong> Overwatch 2 chat messages have a maximum limit of 200 characters per message.
           </p>
           <p className="text-amber-200 text-xs">
              Your content has been split into {Math.min(messageChunks.length, 4)} messages below. Copy each one separately to OW2 chat.
           </p>
           {exceedsMaxMessages && (
             <p className="text-red-300 text-xs mt-2">
                <strong>Content Truncated:</strong> Your text was too long and has been limited to 4 messages. Consider shortening your text for the complete message.
             </p>
           )}
         </div>
       )}

      <div className="bg-black/30 rounded-xl p-4 relative">
        {formattedOutput ? (
          <>
            {!exceedsLimit ? (
              // Single message display
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
              // Multiple messages display
              <div className="space-y-4">
                {messageChunks.slice(0, 4).map((chunk, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300 text-sm font-medium">
                        Message {index + 1} of {Math.min(messageChunks.length, 4)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(chunk, index)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200"
                        aria-label={`Copy message ${index + 1}`}
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {chunk}
                    </pre>
                    <div className="mt-2 text-xs text-slate-500">
                      {chunk.length} characters
                    </div>
                  </div>
                ))}
                {exceedsMaxMessages && (
                  <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-300 text-sm">
                      Content truncated after 4 messages. Consider shortening your text.
                    </p>
                  </div>
                )}
              </div>
            )}
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