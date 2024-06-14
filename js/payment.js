$(document).ready(function () {

    'use strict';

    var usernameError = true,
        emailError = true,
        phoneError = true,
        addressError = true,
        depositError = true,
        countryError = true;


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

    // Detect browser for css purpose
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('.form form label').addClass('fontSwitch');
    }

    // Label effect
    $('input, select').focus(function () {
        $(this).siblings('label').addClass('active');
    });


    // Form validation
    $('input, select').blur(function asd() {
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

    // Form submit
    $('#form').submit(function (event) {
        event.preventDefault();

        $('input, select').blur(); // Trigger validation on all fields

        // console.log('Validation States:', {
        //     usernameError,
        //     emailError,
        //     phoneError,
        //     addressError,
        //     countryError,
        //     depositError
        // }); // For debugging

        if (usernameError || emailError || phoneError || addressError || countryError || depositError) {
            // console.log("Validation failed"); // For debugging
            document.getElementById('successModal').style.display = 'none';
            return false;
        } else {

            let convertedAED;

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const country = document.getElementById('country').value.trim();
            const deposit = document.getElementById('deposit').value.trim();
            const currency = document.getElementById('currency').value;

            document.getElementById('submit-button').addEventListener('click', async function () {
                // Get the values from the input fields
                const deposit = parseFloat(document.getElementById('deposit').value.trim());
                const currency = document.getElementById('currency').value;
    
        
                let convertedDeposit = deposit;
                if (currency === 'usd') {
                    const conversionRate = await getConversionRate();
                    if (conversionRate) {
                        convertedDeposit = deposit * conversionRate;
                    } else {
                        alert('Error fetching conversion rate.');
                        return;
                    }
                }
                
        
        
                convertedAED = convertedDeposit.toFixed(2);
                const content = `
                    <h3 class="m-0">${'$ '+deposit}</h3>
                    <h3 class="m-0">${currency}</h3>
                `;
                
                // Show success modal with the values
                document.getElementById("unit_p").innerHTML = content;
                document.getElementById('depositValue').textContent = convertedAED + ' AED';
                document.getElementById('currencyValue').textContent = 'AED';
                document.getElementById('successModal').style.display = 'flex';
            });

            const data = {
                name: name,
                email: email,
                phone: phone,
                country: country,
                deposit: convertedAED,
                currency: currency
            };



            fetch('/checkout', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)
            }).then(res=>{
                if (res.ok) return res.json()
                return res.json().then(json => Promise.reject(json))
            }).then(({ url }) => {
                // console.log(url)
                window.location= url
            }).catch(e => {
                console.error(e.error)
            })







            document.getElementById('successModal').style.display = 'flex';
        }
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
