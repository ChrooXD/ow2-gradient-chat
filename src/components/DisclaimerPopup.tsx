import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DisclaimerPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            Since the August 5, 2025 patch
          </DialogTitle>
          <DialogDescription className="text-center">
            This website is no longer functional to generate displayable gradients and icons in the Overwatch 2 chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Screenshot */}
          <div className="flex justify-center">
            <img
              src="/ripow2chat.png"
              alt="Overwatch 2 August 5, 2025 patch screenshot"
              className="max-w-full h-auto rounded border border-border"
            />
          </div>

          {/* Thank you message */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Thank you for using this website! &lt;3
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
