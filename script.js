const btn= document.getElementById("login-btn")
btn.addEventListener("click", function(){
    const userInput= document.getElementById("input-username")
    const userName= userInput.value
    const passInput= document.getElementById("input-password")
    const passWord= passInput.value
    console.log(userName, passWord)
    if(userName == "admin" && passWord == "admin123")
    {
        alert("login success")
        window.location.replace("/home.html")
    }
    else{
        alert("Login Failed")
        return;
    }
})