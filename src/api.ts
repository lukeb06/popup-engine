import { getRecaptchaToken } from './recaptcha';

export async function submitDesignForm(data: any) {
    const token = await getRecaptchaToken();
    if (!token) throw new Error('Could not get recaptcha token');

    const response = await fetch('https://api.settlemyrenursery.com/design', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const text = await response.text();

    if (!response.ok) throw new Error(text);

    return text;
}
