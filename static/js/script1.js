const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.addEventListener('submit', e => {
    e.preventDefault();

    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8 ) {
        setError(password, 'Password must be at least 8 character.')
    } else {
        setSuccess(password);
    }


    if (emailValue && passwordValue) {
        // If all fields are valid, submit the form via AJAX(asynchronus javascript) used for data transmisssion from browser to server and via verse
        submitForm();
    }

};


const submitForm = () => {
    const formData = new FormData(form);

    fetch('/login', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the PHP script
            if (data.message === 'Login successful') {
                // Login was successful; you can redirect or show a success message
                window.location.href = '/index'; // Redirect to the index page
                // Or you can show a success message to the user
                // For example: showMessage("Login successful");
            } else if (data.message === 'Invalid password') {
                // Registration failed or an error occurred
                // Handle the error, e.g., display an error message
                setError(password, 'Invalid password');
            } else {
                setError(email, 'User does not exist');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};