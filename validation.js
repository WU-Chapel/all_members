
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("fellowshipForm");
    if (!form) return;

    const phoneFields = [
        document.getElementById("phoneNumber"),
        document.getElementById("guardianPhone")
    ].filter(Boolean);

    function validatePhone(input) {
        const value = input.value.trim();

        if (value === "" && !input.required) {
            input.setCustomValidity("");
        } else if (!/^\d{11}$/.test(value)) {
            input.setCustomValidity(
                "Enter an 11-digit phone number using digits only."
            );
        } else {
            input.setCustomValidity("");
        }
    }

    function validateRequiredTextFields() {
        form.querySelectorAll('input[required][type="text"]')
            .forEach(input => {
                input.setCustomValidity(
                    input.value.trim() ? "" : "This field is required."
                );
            });
    }

    phoneFields.forEach(input => {
        input.addEventListener("input", () => validatePhone(input));
        input.addEventListener("blur", () => validatePhone(input));
    });

    form.addEventListener("submit", event => {
        validateRequiredTextFields();
        phoneFields.forEach(validatePhone);

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopImmediatePropagation();
            form.reportValidity();
        }
    });
});
