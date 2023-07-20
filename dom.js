const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorElement = document.getElementById("error-message");

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userObj = {
        name: name.value,
        email: email.value,
        password: password.value
    }
    console.log(userObj);

    // We will do a post request 
    axios.post("http://localhost:3000/user/signup", userObj)
        .then((res) => {
            console.log(res);
            // Redircting to Login Page
            window.location.href = 'file:///C:/PUSHKAR%20EVERYTHING/IT/Languages/Sharpener%20Tasks/Backend/Expense%20Tracker%20-%20Node.js%20Project/login.html';

        })
        .catch((error) => {
            //console.log(error);
            //addinf this error to front end 
            const errorMessage = error.message;
            console.log(errorMessage);
            errorElement.textContent = errorMessage;
        })

})