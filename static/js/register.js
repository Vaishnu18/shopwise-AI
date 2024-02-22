const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

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
    let uname = false;
    let mail = false;
    let pass = false;
    let pass2 = false;
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(usernameValue === '') {
        uname = false;
        setError(username, 'username is required');
    } else {
        uname = true;
        setSuccess(username);
    }

    if(emailValue === '') {
        mail = false;
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) {
        mail = false;
        setError(email, 'Provide a valid email address');
    } else {
        mail = true;
        setSuccess(email);
    }

    if(passwordValue === '') {
        pass = false;
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8 ) {
        pass = false;
        setError(password, 'Password must be at least 8 character.')
    } else {
        pass = true;
        setSuccess(password);
    }

    if(password2Value === '') {
        pass2 = false;
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        pass2 = false;
        setError(password2, "Passwords doesn't match");
    } else {
        pass2 = true;
        setSuccess(password2);
    }

    if (uname && mail && pass && pass2) {
        // If all fields are valid, submit the form via AJAX
        submitForm();
    }

};

const submitForm = () => {
    const formData = new FormData(form);

    fetch('/register', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the Python script
            if (data.message === 'Registration successful') {
                // Registration was successful; you can redirect or show a success message
                window.location.href = '/login'; // Redirect to the login page
                // Or you can show a success message to the user
                // For example: showMessage("Registration successful");
            } else if (data.message === 'Exists') {
                // Registration failed or an error occurred
                // Handle the error, e.g., display an error message
                setError(email, 'Email already exits');
            } else {
                setError(email, 'Registration Failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};