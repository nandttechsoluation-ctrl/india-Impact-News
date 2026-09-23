/**
 * Realistic Human-like Voice Synthesizer
 * Provides broadcast-grade, natural human-sounding voiceover for news stories and 5-news Reels.
 * Delivers crisp, confident news anchor delivery (स्पष्ट और आत्मविश्वास से भरपूर)
 * with continuous fluent flow (zero artificial pauses or stutter).
 */

export type VoicePersona = 'confident_anchor' | 'anchor' | 'reel_creator' | 'podcast';

export interface VoicePlaybackOptions {
  lang: 'hi' | 'en';
  persona?: VoicePersona;
  rate?: number;
  pitch?: number;
  enableStudioBed?: boolean;
  onStart?: () => void;
  onSentence?: (index: number, total: number, sentenceText: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Normalizes English terms, acronyms, currency and numbers into pure, natural Devanagari phonetics
 * and removes awkward ellipsis pauses so speech flows seamlessly.
 */
export function cleanHindiPhoneticsForVoice(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Replace common global and geopolitical terms with natural Hindi phonetics
  const replacements: [RegExp, string][] = [
    [/\bglobal markets\b/gi, 'ग्लोबल मार्केट्स'],
    [/\bglobal updates\b/gi, 'ग्लोबल अपडेट्स'],
    [/\bglobal briefing\b/gi, 'ग्लोबल ब्रीफिंग'],
    [/\bBRICS\b/gi, 'ब्रिक्स'],
    [/\bPIB\b/gi, 'पीआईबी'],
    [/\bMEA\b/gi, 'विदेश मंत्रालय'],
    [/\bREUTERS\b/gi, 'रॉयटर्स'],
    [/\bPTI\b/gi, 'पीटीआई'],
    [/\bANI\b/gi, 'एएनआई'],
    [/\bAI\b/g, 'एआई'],
    [/\bGDP\b/gi, 'जीडीपी'],
    [/\bRBI\b/gi, 'आरबीआई'],
    [/\bISRO\b/gi, 'इसरो'],
    [/\bDRDO\b/gi, 'डीआरडीओ'],
    [/\bUSA\b/gi, 'अमेरिका'],
    [/\bUS\b/g, 'अमेरिका'],
    [/\bUK\b/g, 'ब्रिटेन'],
    [/\bUAE\b/gi, 'यूएई'],
    [/\bFTA\b/gi, 'मुक्त व्यापार समझौता'],
    [/\bB-Roll\b/gi, 'विजुअल'],
    [/\bTrade Deficit\b/gi, 'ट्रेड डेफिसिट'],
    [/\bBillion\b/gi, 'बिलियन'],
    [/\bTrillion\b/gi, 'ट्रिलियन'],
    [/\bMillion\b/gi, 'मिलियन'],
    [/\$([0-9]+)\s*billion/gi, '$1 बिलियन डॉलर'],
    [/\$([0-9]+)\s*trillion/gi, '$1 ट्रिलियन डॉलर'],
    [/\$([0-9]+)/gi, '$1 डॉलर'],
    [/₹([0-9]+)/gi, '$1 रुपये'],
    // Replace triple dots that cause TTS to wait 1 second with a clean comma
    [/\.{2,}/g, ', '],
    [/\…/g, ', '],
  ];

  for (const [regex, replacement] of replacements) {
    cleaned = cleaned.replace(regex, replacement);
  }

  // Remove markdown symbols, brackets, and extra spaces
  cleaned = cleaned
    .replace(/[\*\_\[\]\#\(\)\{\}\`\>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

class RealisticVoiceSynthesizer {
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private activeOptions: VoicePlaybackOptions | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.getBestVoice('hi');
        this.getBestVoice('en');
      };
    }
  }

  /**
   * Discovers the highest-clarity, confident human voice available on the device
   */
  public getBestVoice(lang: 'hi' | 'en'): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'hi') {
      // Prioritize natural high-clarity Hindi voices
      const naturalHindi = voices.find(
        (v) =>
          (v.lang.toLowerCase().includes('hi') || v.lang.toLowerCase().includes('in')) &&
          (v.name.includes('Swara') ||
            v.name.includes('Natural') ||
            v.name.includes('Online') ||
            v.name.includes('Google') ||
            v.name.includes('Madhur') ||
            v.name.includes('Kalpana') ||
            v.name.includes('Neerja'))
      );
      if (naturalHindi) return naturalHindi;

      const anyHindi = voices.find((v) => v.lang.toLowerCase().startsWith('hi'));
      if (anyHindi) return anyHindi;
    }

    // English
    const indianEnglish = voices.find(
      (v) =>
        (v.lang.includes('en-IN') || v.lang.includes('en_IN')) &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
    );
    if (indianEnglish) return indianEnglish;

    const naturalEnglish = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalEnglish) return naturalEnglish;

    return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }

  /**
   * Starts a subtle cinematic geopolitical pulse bed
   */
  private startStudioAmbience() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.010, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch (e) {}
  }

  private stopStudioAmbience() {
    if (this.ambientGain && this.audioCtx) {
      try {
        const now = this.audioCtx.currentTime;
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        setTimeout(() => {
          try {
            if (this.ambientOsc) this.ambientOsc.stop();
          } catch (e) {}
          this.ambientOsc = null;
          this.ambientGain = null;
        }, 220);
      } catch (e) {
        this.ambientGain = null;
      }
    }
  }

  /**
   * Speaks the text continuously and fluently without artificial chunk delays or long pauses
   */
  public speak(text: string, options: VoicePlaybackOptions) {
    this.stop();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError(new Error('Speech synthesis not available'));
      return;
    }

    this.activeOptions = options;
    this.isSpeaking = true;
    this.isPaused = false;

    if (options.enableStudioBed !== false) {
      this.startStudioAmbience();
    }

    const cleanText = cleanHindiPhoneticsForVoice(text);
    const lang = options.lang || 'hi';
    const persona = options.persona || 'confident_anchor';

    // Rate calibrated for fluent, confident, punchy delivery without dragging
    let rate = options.rate ?? 1.08;
    let pitch = options.pitch ?? 1.01;

    if (persona === 'confident_anchor') {
      rate = options.rate ?? 1.08; // Fast, confident, fluent news broadcast
      pitch = options.pitch ?? 1.01;
    } else if (persona === 'reel_creator') {
      rate = options.rate ?? 1.15;
      pitch = options.pitch ?? 1.04;
    } else if (persona === 'anchor') {
      rate = options.rate ?? 1.02;
      pitch = options.pitch ?? 0.98;
    } else if (persona === 'podcast') {
      rate = options.rate ?? 0.96;
      pitch = options.pitch ?? 1.0;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = rate;
    utterance.pitch = pitch;

    const bestVoice = this.getBestVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    if (options.onStart) options.onStart();

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.stopStudioAmbience();
      if (options.onEnd) {
        options.onEnd();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.stopStudioAmbience();
      if (options.onError) {
        options.onError(e);
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.stopStudioAmbience();
  }

  public getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
    };
  }
}

export const realisticVoice = new RealisticVoiceSynthesizer();
