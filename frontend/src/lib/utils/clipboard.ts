import { toast } from 'sonner';

/**
 * Copies text to clipboard and shows a toast notification
 * @param text The text to copy
 * @param label The label to show in the toast (e.g., 'Link', 'API Key')
 */
export async function copyToClipboard(text: string, label: string = 'Content') {
    if (!text) return;

    try {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`, {
            description: text.length > 50 ? `${text.substring(0, 50)}...` : text,
            duration: 2000,
        });
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy to clipboard');
        return false;
    }
}
