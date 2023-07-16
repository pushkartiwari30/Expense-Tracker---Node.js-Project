const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

signupForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    const userObj = {
        name : name.value,
        email : email.value,
        password : password.value
    }
    console.log(userObj);
    
    // We will do a post request 
    axios.post("http://localhost:3000/user/signup", userObj)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        })

})