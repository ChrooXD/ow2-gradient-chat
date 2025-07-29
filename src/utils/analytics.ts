// Google Analytics utility functions
export const GA_TRACKING_ID = 'G-50MKT9J97B';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'consent',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: Record<string, any>[];
  }
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_location: url,
      page_title: title || document.title,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific tracking functions for your OW2 chat app
export const trackChatCodeInteraction = (
  action: 'copy' | 'view' | 'search',
  category: 'hero' | 'ability' | 'weapon' | 'spray' | 'color' | 'gradient',
  label?: string
) => {
  trackEvent(action, `chat_code_${category}`, label);
};

export const trackColorInteraction = (
  action: 'pick' | 'copy' | 'generate',
  colorType: 'gradient' | 'solid' | 'custom',
  label?: string
) => {
  trackEvent(action, `color_${colorType}`, label);
};

export const trackUIInteraction = (
  action: 'click' | 'toggle' | 'scroll' | 'download',
  element: string,
  label?: string
) => {
  trackEvent(action, 'ui_interaction', `${element}${label ? `_${label}` : ''}`);
};

// Track search functionality
export const trackSearch = (searchTerm: string, category?: string) => {
  trackEvent('search', category || 'general', searchTerm);
};

// Track copy actions (important for your chat code app)
export const trackCopyAction = (contentType: string, content?: string) => {
  trackEvent('copy', 'content', `${contentType}${content ? `_${content.substring(0, 20)}` : ''}`);
};