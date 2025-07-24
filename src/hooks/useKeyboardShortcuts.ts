import { useEffect } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

/**
 * Custom hook for handling keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, key } = event;
      const modifierKey = ctrlKey || metaKey;
      
      // Build the key combination string
      let combination = '';
      if (modifierKey) combination += 'ctrl+';
      if (shiftKey) combination += 'shift+';
      combination += key.toLowerCase();
      
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}; 