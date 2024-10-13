import createScrambler from '../utils/scramble';

export default function scrambleElements(className: string) {
  const elements = document.querySelectorAll(className);
  let scramblerInstances: ReturnType<typeof createScrambler>[] = [];

  elements.forEach((element, index) => {
    const scrambler = createScrambler();
    scramblerInstances[index] = scrambler;
    const initialText = element.textContent || '';

    scrambler.scrambleText(
      initialText,
      (updatedText) => {
        element.textContent = updatedText;
      }
    );
  });
}
