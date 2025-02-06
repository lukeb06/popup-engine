export function getRecaptchaToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
            grecaptcha
                .execute('6LcGARMqAAAAALjAhYoFdENy3p5ArHtMkJrS4lLt', {
                    action: 'submit',
                })
                .then((token: any) => {
                    resolve(token);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    });
}
