import { CHARACTER_SETS } from './constants';

interface ScramblerState {
  maxRandomizationSteps: number;
  originalText: string;
  scrambledText: string;
  encodeCounters: number[];
  decodeCounters: number[];
  scrambleCallback: ((text: string) => void) | null;
  animationFrameId: number | null;
  frameCycleCounter: number;
}

function createScrambler() {
  const state: ScramblerState = {
    maxRandomizationSteps: 14,
    originalText: '',
    scrambledText: '',
    encodeCounters: [],
    decodeCounters: [],
    scrambleCallback: null,
    animationFrameId: null,
    frameCycleCounter: 0,
  };

  const updateMaxRandomizationSteps = (newMaxSteps: number) => {
    state.maxRandomizationSteps = newMaxSteps;
  };

  const resetScrambler = () => {
    state.originalText = '';
    state.scrambledText = '';
    state.encodeCounters = [];
    state.decodeCounters = [];
    state.scrambleCallback = null;
    state.animationFrameId = null;
    state.frameCycleCounter = 0;
  };

  const generateRandomString = (length: number) => {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += CHARACTER_SETS.DEFAULT[Math.floor(Math.random() * CHARACTER_SETS.DEFAULT.length)];
    }
    return randomString;
  };

  const generateRandomCounters = (text: string) => {
    return Array.from({ length: text.length }, () => Math.floor(Math.random() * state.maxRandomizationSteps) + 1);
  };

  const performEncodingStep = () => {
    if (state.encodeCounters.every((counter) => counter === 0)) {
      requestAnimationFrame(performFillingStep);
      return;
    }

    if (state.frameCycleCounter === 0) {
      for (let i = 0; i < state.encodeCounters.length; i++) {
        if (state.encodeCounters[i] !== 0) {
          state.encodeCounters[i]--;
        } else {
          const textChars = state.scrambledText.split('');
          textChars[i] = generateRandomString(1);
          state.scrambledText = textChars.join('');
        }
      }
      if (state.scrambleCallback) {
        state.scrambleCallback(state.scrambledText);
      }
    }

    state.frameCycleCounter = (state.frameCycleCounter + 1) % 3;
    state.animationFrameId = requestAnimationFrame(performEncodingStep);
  };

  const performFillingStep = () => {
    if (state.frameCycleCounter === 0) {
      if (state.scrambledText.length === state.originalText.length) {
        return requestAnimationFrame(performDecodingStep);
      }
      const lengthDifference = state.scrambledText.length < state.originalText.length ? 1 : -1;
      state.scrambledText = generateRandomString(state.scrambledText.length + lengthDifference);
      if (state.scrambleCallback) {
        state.scrambleCallback(state.scrambledText);
      }
    }

    state.frameCycleCounter = (state.frameCycleCounter + 1) % 2;
    state.animationFrameId = requestAnimationFrame(performFillingStep);
  };

  const performDecodingStep = () => {
    if (state.scrambledText === state.originalText) {
      if (state.animationFrameId !== null) {
        cancelAnimationFrame(state.animationFrameId);
      }
      return;
    }

    if (state.frameCycleCounter === 0) {
      let partiallyDecodedText = '';
      for (let i = 0; i < state.decodeCounters.length; i++) {
        if (state.decodeCounters[i] !== 0) {
          partiallyDecodedText += CHARACTER_SETS.DEFAULT[Math.floor(Math.random() * CHARACTER_SETS.DEFAULT.length)];
          state.decodeCounters[i]--;
        } else {
          partiallyDecodedText += state.originalText[i];
        }
      }
      state.scrambledText = partiallyDecodedText;
      if (state.scrambleCallback) {
        state.scrambleCallback(state.scrambledText);
      }
    }

    state.frameCycleCounter = (state.frameCycleCounter + 1) % 4;
    state.animationFrameId = requestAnimationFrame(performDecodingStep);
  };

  const scrambleText = (text: string, callback: (text: string) => void, ) => {
    state.originalText = text;
    state.scrambledText = '';
    state.encodeCounters = generateRandomCounters(state.scrambledText);
    state.decodeCounters = generateRandomCounters(state.originalText);
    state.scrambleCallback = callback;
    state.frameCycleCounter = 0;
    state.animationFrameId = requestAnimationFrame(performEncodingStep);
  };

  return { updateMaxRandomizationSteps, resetScrambler, scrambleText };
}

export default createScrambler;
