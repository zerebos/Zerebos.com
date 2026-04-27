let captchaCode: string;
const CAPTCHA_LENGTH = 6;
const captchaChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function createCaptcha() {
    const captcha: string[] = [];
    for (let i = 0; i < CAPTCHA_LENGTH; i++) {
        const index = Math.floor(Math.random() * captchaChars.length);
        if (!captcha.includes(captchaChars[index])) captcha.push(captchaChars[index]);
        else i--;
    }
    const canv = document.getElementById("captcha") as HTMLCanvasElement;
    canv.width = 85;
    canv.height = 28;
    const ctx = canv.getContext("2d")!;
    ctx.font = "20px Georgia, serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(captcha.join(""), 0, 20);
    captchaCode = captcha.join("");
}
createCaptcha();

const contactForm = document.getElementById("contactform") as HTMLFormElement;
const submitButton = contactForm.querySelector("button")!;
contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submittedCode = (contactForm.elements.namedItem("filter") as HTMLInputElement).value;
    if (submittedCode !== captchaCode) {
        submitButton.classList.replace("btn-primary", "btn-danger");
        submitButton.textContent = "Incorrect Captcha!";
        submitButton.disabled = true;
        setTimeout(() => {
            createCaptcha();
            submitButton.classList.replace("btn-danger", "btn-primary");
            submitButton.textContent = "Send Message";
            submitButton.disabled = false;
        }, 3000);
        return;
    }
    try {
        const payload = {
            accessKey: "4eb2d4fb-346d-4bc6-82bb-7cb20c09c050",
            name: (contactForm.elements.namedItem("name") as HTMLInputElement).value,
            email: (contactForm.elements.namedItem("email") as HTMLInputElement).value,
            subject: (contactForm.elements.namedItem("subject") as HTMLInputElement).value,
            message: (contactForm.elements.namedItem("message") as HTMLTextAreaElement).value,
            replyTo: "@",
        };

        submitButton.textContent = "Sending...";

        const result = await fetch(contactForm.action, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {"Content-Type": "application/json"},
        });
        const json = await result.json() as {success: boolean;};
        if (json.success) {
            contactForm.reset();
            submitButton.classList.replace("btn-primary", "btn-success");
            submitButton.textContent = "Message Sent!";
        }
        else {
            submitButton.classList.replace("btn-primary", "btn-danger");
            submitButton.textContent = "Could Not Send!";
            submitButton.disabled = true;
        }
        setTimeout(() => {
            submitButton.classList.replace(json.success ? "btn-success" : "btn-danger", "btn-primary");
            submitButton.textContent = "Send Message";
            submitButton.disabled = false;
        }, 5000);
    }
    catch {
        submitButton.classList.replace("btn-primary", "btn-danger");
        submitButton.textContent = "Could Not Send!";
        setTimeout(() => {
            submitButton.classList.replace("btn-danger", "btn-primary");
            submitButton.textContent = "Send Message";
            submitButton.disabled = false;
        }, 5000);
    }
});
