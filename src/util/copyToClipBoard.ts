export const copyToClipboard = (
    text: string,
    fallbackInputField?: HTMLInputElement,
    errorMessage?: string
): Promise<boolean> => {
    const copyToClipboardFallback = (
        inputField: HTMLInputElement,
        errorMessage = "Cannot copy value to clipboard"
    ): Promise<boolean> =>
        new Promise((resolve, reject) => {
            inputField.select();
            const success =
                document.execCommand && document.execCommand("copy");
            inputField.blur();
            success ? resolve(success) : reject(new Error(errorMessage));
        });

    // `navigator.clipboard` might not be available, e.g. on sites served over plain `http`.
    if (!navigator.clipboard && fallbackInputField) {
        return copyToClipboardFallback(fallbackInputField);
    }

    return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch((e: Error) => {
            if (fallbackInputField) {
                return copyToClipboardFallback(
                    fallbackInputField,
                    errorMessage
                );
            } else {
                throw e;
            }
        });
};
