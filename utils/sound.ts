let audioContext: AudioContext | null = null;

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const createOscillator = (
  ctx: AudioContext,
  type: OscillatorType,
  freq: number,
  startTime: number,
  duration: number,
  vol: number = 0.1
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playClickSound = () => {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    // A high pitched "pop" sound
    createOscillator(ctx, 'sine', 800, ctx.currentTime, 0.1, 0.1);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playSelectSound = () => {
    try {
      const ctx = getContext();
      if (ctx.state === 'suspended') ctx.resume();
      
      // A woody "tick" sound
      createOscillator(ctx, 'triangle', 400, ctx.currentTime, 0.05, 0.05);
    } catch (e) {
    }
  };

export const playCorrectSound = () => {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const now = ctx.currentTime;
    // Major triad arpeggio (C5 - E5 - G5)
    createOscillator(ctx, 'triangle', 523.25, now, 0.2, 0.1); // C
    createOscillator(ctx, 'triangle', 659.25, now + 0.1, 0.2, 0.1); // E
    createOscillator(ctx, 'triangle', 783.99, now + 0.2, 0.4, 0.1); // G
  } catch (e) {
  }
};

export const playIncorrectSound = () => {
  try {
    const ctx = getContext();
    if (ctx.state === 'suspended') ctx.resume();
    
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3); // Pitch bend down
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {
  }
};
