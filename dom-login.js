const email = document.getElementById('email');
const password = document.getElementById('password');
const errorElement = document.getElementById("error-message");

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
            alert(res.data.message)
            // form reset 

        })
        .catch((error) => {
            console.log(error.response.data.message);
            alert(error.response.data.message)
        })

})