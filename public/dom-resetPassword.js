const newPassword = document.getElementById('newPassword');
const passwordResetForm = document.getElementById('passwordResetForm');
const container = document.querySelector('.container');

passwordResetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(newPassword.value);
    // Get the current URL from the browser's address bar
    const currentURL = window.location.href;
    // Extract the uuid from the URL
    const urlParts = currentURL.split('/');
    const uuid = urlParts[urlParts.length - 1];
    console.log("UUID ==>");
    console.log(uuid);
    const passwordInfo = {
        password: newPassword.value,
        uuid: uuid
    }
    axios.post("http://localhost:3000/password/updatepassword", passwordInfo)
        .then((res) => {
            container.innerHTML = "Password Reset Complete";
            container.style.fontSize = "24px";
            container.style.color = "green";
            container.style.textAlign = "center";
            container.style.fontWeight = "bold";

            //create a set time and put a fn to clos e the tab after 5 seconds 
            setTimeout(() => {
                window.close();
            }, 5000);
        })
        .catch((err) => {
            console.log(err);
            container.innerHTML = "Error in Resetting the Password";
            container.style.fontSize = "24px";
            container.style.color = "red";
            container.style.textAlign = "center";
            container.style.fontWeight = "bold";

             //create a set time and put a fn to clos e the tab after 5 seconds 
             setTimeout(() => {
                window.close();
            }, 5000);
        })


})
