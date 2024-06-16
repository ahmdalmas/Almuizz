$(document).ready(function () {

    'use strict';

    let usernameError = true,
        emailError = true,
        phoneError = true,
        addressError = true,
        depositError = true,
        countryError = true;

    let name, email, phone, country, deposit, currency;
    let formData; // Define formData variable

    async function convertAED() {
        async function getConversionRate() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                return data.rates.AED;
            } catch (error) {
                console.error('Error fetching conversion rate:', error);
                return null;
            }
        }

        let convertedDeposit = deposit;
        if (currency === 'USD') {
            const conversionRate = await getConversionRate();
            if (conversionRate) {
                convertedDeposit = deposit * conversionRate;
            } else {
                alert('Error fetching conversion rate.');
                return;
            }
        }

        let convertedAED = convertedDeposit.toFixed(2);
        return convertedAED;
    }



    // Detect browser for css purpose
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('.form form label').addClass('fontSwitch');
    }

    // Label effect
    $('input, select').focus(function () {
        $(this).siblings('label').addClass('active');
    });


    // Form validation
    $('input, select').blur(function () {
        // Full Name
        if ($(this).hasClass('name')) {
            if ($(this).val().length === 0) {
                $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
                usernameError = true;
            }
            else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                usernameError = false;
            }
        }

        // Email
        if ($(this).hasClass('email')) {
            var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your email address').fadeIn().parent('.form-group').addClass('hasError');
                emailError = true;
            } else if (!emailPattern.test($(this).val())) {
                $(this).siblings('span.error').text('Please type a valid email address').fadeIn().parent('.form-group').addClass('hasError');
                emailError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                emailError = false;
            }
        }

        // Phone Number
        if ($(this).attr('id') === 'phone') {
            if ($(this).val().length === 0) {
                $(this).siblings('span.error').text('Please type your phone number').fadeIn().parent('.form-group').addClass('hasError');
                phoneError = true;
            } else if (!/^\d+$/.test($(this).val())) {
                $(this).siblings('span.error').text('Please enter numbers only').fadeIn().parent('.form-group').addClass('hasError');
                phoneError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                phoneError = false;
            }
        }

        // Address
        if ($(this).attr('id') === 'address') {
            if ($(this).val().length === 0) {
                $(this).siblings('span.error').text('Please type your address').fadeIn().parent('.form-group').addClass('hasError');
                addressError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                addressError = false;
            }
        }

        // Validate Country
        if ($(this).attr('id') === 'country') {
            if ($('#country').val() === '') {
                $('#country').next('.error').text('Please select your country.').fadeIn().parent('.form-group').addClass('hasError');
                countryError = true;
            } else {
                $('#country').next('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                countryError = false;
            }
        }


        // Deposit Amount
        if ($(this).attr('id') === 'deposit') {
            if ($(this).val().length === 0) {
                $(this).siblings('span.error').text('Please type the deposit amount').fadeIn().parent('.form-group').addClass('hasError');
                depositError = true;
            } else if (!/^\d+(\.\d{1,2})?$/.test($(this).val())) {
                $(this).siblings('span.error').text('Please enter a valid amount').fadeIn().parent('.form-group').addClass('hasError');
                depositError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                depositError = false;
            }
        }


        // Currency
        // if ($(this).attr('id') === 'currency') {
        //     if ($(this).val() == 'aed') {

        //         depositError = false;
        //     } else if ($(this).val() == 'usd') {
        //         depositError = false;
        //         console.log('USDerror: '+currencyError);
        //     } else{
        //         depositError = true;
        //     }
        // }

        // Label effect
        if ($(this).val().length > 0) {
            $(this).siblings('label').addClass('active');
        } else {
            $(this).siblings('label').removeClass('active');
        }
    });

    // Restrict phone number and deposit fields to numbers only
    $('#phone, #deposit').on('input', function () {
        this.value = this.value.replace(/[^0-9.]/g, '');
    });



    $('#form').submit(function (event) {
        event.preventDefault();

        name = document.getElementById('name').value.trim();
        email = document.getElementById('email').value.trim();
        phone = document.getElementById('phone').value.trim();
        country = document.getElementById('country').value.trim();
        deposit = parseFloat(document.getElementById('deposit').value.trim());
        currency = document.getElementById('currency').value;

        formData = {
            name: name,
            email: email,
            phone: phone,
            country: country,
            deposit: deposit,
            currency: currency
        }




        $('input, select').blur(); // Trigger validation on all fields
        if (usernameError || emailError || phoneError || addressError || countryError || depositError) {
            document.getElementById('successModal').style.display = 'none';
            return false;
        } else {
            // Form is valid, trigger the button click

            document.getElementById('submit-button').click();

        }
    });









    let isTimeoutSet = false;







    document.getElementById('submit-button').addEventListener('click', async function () {

        const spinner = document.getElementById('spinner');
        const button = document.getElementById('submit-button');








        if (!isTimeoutSet) {
            isTimeoutSet = true;

            // Change button text to "Please wait..." and disable it
            button.disabled = true;
            button.style.backgroundColor = '#ba8000'
            button.value = "";
            spinner.style.display = 'inline-block';

            // Set timeout to change the text back and click again after 3 seconds
            setTimeout(() => {
                button.disabled = false;
                button.value = "Deposit";
                button.style.backgroundColor = '#f0a500'
                spinner.style.display = 'none';
                button.click(); // Programmatically click the button again
            }, 1000); // 3000 milliseconds delay

            return; // Exit the function to wait for the timeout
        }

        // This part of the code will run on the second click
        isTimeoutSet = false; // Reset the flag for future clicks

        button.disabled = true;
        // Get the values from the input fields
        let deposit = parseFloat(document.getElementById('deposit').value.trim());
        const currency = document.getElementById('currency').value;


        // Check if the parsed number is a valid number
        if (!isNaN(deposit)) {
            // Format the number based on the selected currency
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2
            });

            // Update the input value with formatted currency
            deposit = formatter.format(deposit);
        } else {
            // If the input is not a valid number, clear the input value
            deposit = '';
        }

        let content;

        if (currency == 'AED') {
            content = `
                    
                        <h3 class="m-0">${deposit}</h3>
                    `;
        } else {
            content = `
                    
                        <h3 class="m-0">${deposit}</h3>
                    `;
        }

        // Show success modal with the values
        document.getElementById("unit_p").innerHTML = content;
        // document.getElementById('depositValue').textContent = convertedAED + ' AED';
        document.getElementById('successModal').style.display = 'flex';
        button.disabled = false;








    });

    const paymentbutton = document.getElementById('submit-payment');

    paymentbutton.addEventListener("click", async () => {
        let convertedAED = await convertAED(); // Wait for conversion
        formData.deposit = parseInt(convertedAED);
        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(res => {
                if (res.ok) return res.json();
                return res.json().then(json => Promise.reject(json));
            })
            .then(({ url }) => {
                // console.log(url);
                window.location = url;
            })
            .catch(e => {
                console.error(e.error);
            });
    });


    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', cancelModal);

    function closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }
    function cancelModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    // Reload page on click
    $('button#cancel-btn').on('click', function (event) {
        event.preventDefault();
        location.reload(true);
    });
});
