
// $('#submit-payment').submit(function (event) {
//         event.preventDefault();

        
//         // Example API call (replace with your actual API endpoint)


//         if (isNaN(deposit) || deposit <= 0) {
//             console.error('Invalid deposit amount entered.');
//             return;
//         }

        
//         fetch('/checkout', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ deposit: deposit})
//         })
//             .then(response => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error('Failed to submit form');
//                 }
//             })
//             .then(data => {
//                 console.log('Form submitted successfully:', data);
//                 // Optionally, show success message or redirect to another page
//             })
//             .catch(error => {
//                 console.error('Error submitting form:', error);
//                 // Handle error, show error message or retry logic
//             });

//         // Close the modal after submission
//     });







// // $('#paymentForm').onClick(function (event) {
// //     event.preventDefault();
    
// // });