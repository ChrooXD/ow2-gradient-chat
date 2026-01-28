import React, { useState, useMemo } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { COPY_FEEDBACK_DURATION } from '../constants/gradients';
import { splitFormattedOutput } from '../utils/colorUtils';
import { trackCopyAction, trackUIInteraction } from '../utils/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Formatted Output</CardTitle>
        {formattedOutput && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={downloadAsFile}
              title="Download as file"
              aria-label="Download formatted output as text file"
            >
              <Download className="w-4 h-4" />
            </Button>
            {!exceedsLimit && (
              <Button
                onClick={() => copyToClipboard(formattedOutput, -1)}
                disabled={!formattedOutput}
                aria-label={copiedIndex === -1 ? 'Copied to clipboard' : 'Copy to clipboard'}
              >
                {copiedIndex === -1 ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {exceedsLimit && (
          <Alert variant="warning">
            <AlertDescription>
              <p className="text-xs mb-1">
                <strong>Reminder:</strong> Overwatch 2 chat messages have a maximum limit of 200 characters per message.
              </p>
              <p className="text-xs">
                Your content has been split into {Math.min(messageChunks.length, 4)} messages below. Copy each one separately to OW2 chat.
              </p>
              {exceedsMaxMessages && (
                <p className="text-destructive text-xs mt-2">
                  <strong>Content Truncated:</strong> Your text was too long and has been limited to 4 messages. Consider shortening your text for the complete message.
                </p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-black/30 rounded-xl p-4">
          {formattedOutput ? (
            <>
              {!exceedsLimit ? (
                <>
                  <ScrollArea className="max-h-[200px]">
                    <pre
                      className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed"
                      role="textbox"
                      aria-readonly="true"
                      aria-label="Formatted gradient output"
                    >
                      {formattedOutput}
                    </pre>
                  </ScrollArea>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>Format: {formatInfo.name}</span>
                      <span>Length: {formatInfo.length} characters</span>
                      {outputFormat === 'gradient' && text && (
                        <span>Colors: {text.length} individual</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <ScrollArea className="max-h-[400px]">
                  <div className="space-y-4">
                    {messageChunks.slice(0, 4).map((chunk, index) => (
                      <div key={index} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Message {index + 1} of {Math.min(messageChunks.length, 4)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => copyToClipboard(chunk, index)}
                            aria-label={`Copy message ${index + 1}`}
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed">
                          {chunk}
                        </pre>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {chunk.length} characters
                        </div>
                      </div>
                    ))}
                    {exceedsMaxMessages && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          Content truncated after 4 messages. Consider shortening your text.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </ScrollArea>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">
                Your formatted output will appear here
              </p>
              <p className="text-xs text-muted-foreground">
                Enter text, select colors, and copy paste to any OW2 chat
              </p>
            </div>
          )}
        </div>

        {copyError && (
          <Alert variant="destructive">
            <AlertDescription>{copyError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
