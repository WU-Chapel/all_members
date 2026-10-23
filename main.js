
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("fellowshipForm");
    const button = document.getElementById("submitButton");
    const message = document.getElementById("formMessage");

    const scriptURL =
        "https://script.google.com/macros/s/AKfycbwDJdNMsN6VGdDIXunUMjgvVjSzvpNd0XUZQfseYMKCf9Bg_xR8zblg9PpL87KaSOOuIQ/exec";

    if (!form || !button || !message) {
        console.error(
            "Form setup error:",
            { formFound: !!form, buttonFound: !!button, messageFound: !!message }
        );
        return;
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `form-message ${type}`;
        message.hidden = false;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        button.disabled = true;
        button.textContent = "Submitting...";
        showMessage("Submitting your membership details...", "info");

        try {
            // Send standard URL-encoded form data.
            // Apps Script can read these values through e.parameter.
            const formData = new FormData(form);
            const body = new URLSearchParams();

            for (const [key, value] of formData.entries()) {
                if (typeof value === "string") {
                    body.append(key, value.trim());
                }
            }

            const response = await fetch(scriptURL, {
                method: "POST",
                body: body
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status} ${response.statusText}`
                );
            }

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch {
                console.error(
                    "Expected JSON but received:",
                    responseText
                );
                throw new Error(
                    "The server response was not valid JSON."
                );
            }

            console.log("Apps Script response:", result);

            if (result.status === "success") {
                form.reset();
                showMessage(
                    result.message ||
                        "Your membership details have been registered successfully.",
                    "success"
                );
                return;
            }

            if (
                result.status === "duplicate" ||
                result.status === "invalid" ||
                result.status === "error"
            ) {
                showMessage(
                    result.message ||
                        "Your registration could not be completed.",
                    "error"
                );
                return;
            }

            throw new Error(
                result.message || "Unexpected response from the server."
            );

        } catch (error) {
            console.error("Form submission error:", error);

            showMessage(
                "We could not confirm your registration. Check your connection and the browser console. Before trying again, check the membership sheet to ensure the record was not already saved.",
                "error"
            );

        } finally {
            button.disabled = false;
            button.textContent = "Submit";
        }
    });
});
