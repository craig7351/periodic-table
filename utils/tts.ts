export const speak = (text: string, rate: number = 0.9) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech to avoid overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-TW'; // Traditional Chinese
  utterance.rate = rate; // Use the provided rate or default
  utterance.pitch = 1.1; // Slightly higher pitch for a cuter/villager vibe

  window.speechSynthesis.speak(utterance);
};