export const speak = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech to avoid overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW'; // Traditional Chinese
  utterance.rate = 0.9; // Slightly slower for better clarity
  utterance.pitch = 1.1; // Slightly higher pitch for a cuter/villager vibe

  window.speechSynthesis.speak(utterance);
};
