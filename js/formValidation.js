document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            // Submit the form if validation passes
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        const firstName = form.elements['first_name'];
        const lastName = form.elements['last_name'];
        const email = form.elements['email'];
        const mobile = form.elements['mobile'];
        const message = form.elements['message'];

        // Reset validation styles
        Array.from(form.querySelectorAll('.is-invalid')).forEach(function (el) {
            el.classList.remove('is-invalid');
        });

        // Validate first name
        if (firstName.value.trim() === '') {
            isValid = false;
            firstName.classList.add('is-invalid');
            firstName.nextElementSibling.textContent = 'Please enter your first name.';
        }

        // Validate last name
        if (lastName.value.trim() === '') {
            isValid = false;
            lastName.classList.add('is-invalid');
            lastName.nextElementSibling.textContent = 'Please enter your last name.';
        }

        // Validate email
        if (email.value.trim() === '' || !isValidEmail(email.value.trim())) {
            isValid = false;
            email.classList.add('is-invalid');
            email.nextElementSibling.textContent = 'Please enter a valid email address.';
        }

        // Validate mobile number (optional, adjust as needed)
        // For demonstration, let's assume it's required
        if (mobile.value.trim() === '') {
            isValid = false;
            mobile.classList.add('is-invalid');
            mobile.nextElementSibling.textContent = 'Please enter your mobile number.';
        }

        // Validate message
        if (message.value.trim() === '') {
            isValid = false;
            message.classList.add('is-invalid');
            message.nextElementSibling.textContent = 'Please enter your message.';
        }

        return isValid;
    }

    function isValidEmail(email) {
        // Basic email validation regex (you may want to use a more robust solution)
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function submitForm() {
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        // Example fetch request to submit form data
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status === 200) {
                modalMessage.innerHTML = json.message;
                modal.style.display = "block";
            } else {
                modalMessage.innerHTML = json.message;
                modal.style.display = "block";
            }
        })
        .catch(error => {
            console.log(error);
            modalMessage.innerHTML = "Something went wrong!";
            modal.style.display = "block";
        })
        .finally(() => {
            form.reset();
            submitButton.textContent = "Send Message";  // Reset button text
            setTimeout(() => {
                modal.style.display = "none";
            }, 3000);
        });
    }
});