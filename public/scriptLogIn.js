// ----------------- LogIn-Code -----------------
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

window.onload = function() {
    loginForm.classList.add('active');
}

loginBtn.addEventListener('click', function() {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerBtn.addEventListener('click', function() {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});
