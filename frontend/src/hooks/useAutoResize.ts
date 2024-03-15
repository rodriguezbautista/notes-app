import { useEffect } from 'react';

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
	textAreaRef: HTMLTextAreaElement | null,
	value: string,
) => {
	useEffect(() => {
		if (textAreaRef) {
			const scrollHeight = textAreaRef.scrollHeight + 2;

			textAreaRef.style.height = scrollHeight + 'px';
		}
	}, [textAreaRef, value]);
};

export default useAutosizeTextArea;
