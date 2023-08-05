const email = document.getElementById('email');
const password = document.getElementById('password');
const errorElement = document.getElementById("error-message");
const forgotPasswordButton = document.getElementById("forgot-password");
const forgotPasswordFormDiv = document.getElementById("forgot-password-div");



loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userLoginObj = {
        email: email.value,
        password: password.value
    }
    //console.log(userLoginObj);

    // We will do a post request 
    axios.post("http://localhost:3000/user/login", userLoginObj)
        .then((res) => {
            console.log(res.data.message);
            console.log(res.data.token);
            localStorage.setItem('token', res.data.token)
            alert(res.data.message);

            loginForm.reset();

            // Redircting to Add Expense Page
            if (res.data.message == 'Logged in Sucessfully') {
                window.location.href = 'expense.html';
            }



        })
        .catch((error) => {
            console.log(error.response.data.message);
            alert(error.response.data.message)
        })

})

forgotPasswordButton.addEventListener('click', () => {
    if (forgotPasswordFormDiv.style.display === "none") {
        forgotPasswordFormDiv.style.display = "block";
        const forgotPasswordForm = document.getElementById("forgot-password-form");
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            forgotPasswordEmail = document.getElementById("forgot-password-email");
            const userEmail = { email: forgotPasswordEmail.value };
            console.log(userEmail);
            axios.post("http://localhost:3000/password/forgotpassword", userEmail)
                .then(res => {
                    console.log("req sent");
                    console.log(res);
                })
                .catch(err => {
                    console.log(err)
                })
        });
    } else {
        forgotPasswordFormDiv.style.display = "none";
    }
});

