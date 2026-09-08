import { useCallback } from 'react';

export const useSpeechAnnouncement = () => {
  const announce = useCallback((text) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop previous utterance

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Clear and deliberate cadence
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Pick a natural English voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not available or blocked:', e);
    }
  }, []);

  return { announce };
};
