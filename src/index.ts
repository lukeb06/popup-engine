import { submitDesignForm } from './api';
import { setup } from './models/components';
import { CloseableOverlay, Overlay } from './models/overlay';
import { FormPopup, Popup } from './models/popup';

setup();

export function createPopup_(title: string, content: string | HTMLElement) {
    let d = document.createElement('div');
    let h1 = document.createElement('h1');
    h1.innerText = title;
    d.appendChild(h1);
    d.append(content);
    d.style.minWidth = '300px';
    const popup = new Popup(d, new CloseableOverlay(), [
        { text: 'Close', variant: 'outline', onClick: () => popup.remove() },
    ]);

    popup.appendTo(document.body);

    return popup;
}

export function createLandscapePopup(closeable: boolean = true) {
    const overlay = closeable ? new CloseableOverlay() : new Overlay();
    const popup = new FormPopup(
        [
            {
                img: 'https://cdn.shopify.com/s/files/1/0655/9193/5143/files/Logo.jpg?v=1721997006',
            },
            {
                title: 'Landscape Design',
            },
            {
                header: "I'm interested in:",
                subheader: '(Choose all that apply)',
            },
            {
                select: {
                    key: 'interested_in',
                    options: [
                        'Free Sketch-N-Go Service',
                        'Scaled Drawing',
                        'Digital Rendering',
                        'On-Site Consultation',
                        'Delivery & Placement Service',
                        'Professional Installation',
                        'Retaining Wall',
                        'Patio',
                        'Fire Pit',
                        'Water Features',
                    ],
                },
            },
            'br',
            'br',
            {
                header: 'I wanted to get started:',
            },
            {
                radio: {
                    key: 'getStarted',
                    options: ['Right Now!', 'This Weekend', '2-4 Weeks', '4 Weeks or Longer'],
                },
            },
            'br',
            'br',
            {
                header: 'Enter your contact information:',
            },
            {
                input: {
                    key: 'firstName',
                    type: 'text',
                    label: 'First Name',
                    required: true,
                },
            },
            {
                input: {
                    key: 'lastName',
                    type: 'text',
                    label: 'Last Name',
                    required: true,
                },
            },
            {
                input: {
                    key: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                },
            },
            {
                input: {
                    key: 'phone',
                    type: 'tel',
                    label: 'Phone Number',
                    required: true,
                },
            },
            {
                input: {
                    key: 'address',
                    type: 'text',
                    label: 'Street Address',
                    required: true,
                },
            },
            {
                input: {
                    key: 'city',
                    type: 'text',
                    label: 'City',
                    required: true,
                },
            },
            {
                dropdown: {
                    key: 'state',
                    options: ['', 'NC', 'SC', 'VA', 'WV', 'GA', 'TN'],
                    placeholder: 'State',
                    required: true,
                },
            },
            {
                input: {
                    key: 'zip',
                    type: 'text',
                    label: 'Zip Code',
                    required: true,
                },
            },
            'br',
            'br',
            {
                header: 'Please include ANY additional information you would like us to know about your landscape project.',
            },
            {
                textarea: {
                    key: 'comments',
                    placeholder: 'Comments',
                },
            },
        ],
        overlay,
        [
            { text: 'Cancel', variant: 'outline', onClick: (): any => popup.remove() },
            { text: 'Submit', onClick: (): any => popup.formEl.querySelector('button')?.click() },
        ],
    );

    popup.on('submit', async formData => {
        const data = {
            city: formData.get('city'),
            state: formData.get('state'),
            zip_code: formData.get('zip'),
            interested_in: formData.get('interested_in'),
            timeline: formData.get('getStarted'),
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            street: formData.get('address'),
            comments: formData.get('comments'),
        };

        try {
            const response = await submitDesignForm(data);
            popup.remove();
            createPopup_('Thank you!', response);
        } catch (e) {
            popup.remove();
            console.error(e);
            createPopup_('Oops!', 'An error occurred. Please try again.');
        }
    });

    popup.appendTo(document.body);
    popup.formEl.classList.add('landscape-form');

    return popup;
}
