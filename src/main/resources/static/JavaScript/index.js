//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.log("I am in onload")
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
console.log(container);
console.log(registerBtn);
console.log(loginBtn);

// Обробка форми реєстрації
const registerButton = document.getElementById('register');
console.log(registerButton);

registerButton.addEventListener('click', function (event) {
    event.preventDefault(); // Запобігаємо стандартній відправці форми
    const email = document.getElementsByClassName('email')[0]; // Отримуємо email
    const password = document.getElementsByClassName('password')[0]; // Отримуємо пароль
    const name = document.getElementsByClassName('name')[0]; // Отримуємо пароль
    const emailText = email.value;
    const passwordText = password.value;
    const nameText = name.value;
    console.log(emailText);
    console.log(passwordText);
    console.log(nameText);
    console.log(email);
    console.log(password);
    console.log(name);
    if (!emailText) {
        alert('Введіть email');
        return;
    }
    if (!passwordText || passwordText.length < 8) {
        alert('Пароль має містити не менше 8 символів');
        return;
    }

    const data = { emailText, passwordText, nameText };

    fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                // Якщо статус 400 чи інша помилка — кидаємо її у catch
                return response.json().then(err => {
                    throw new Error(err.message || 'Сталася помилка під час реєстрації');
                });
            }
            return response.json();
        })
        .then(result => {
            alert('Реєстрація ' + result.isCreated);
            console.log(result,"Логається результат");
            if(result.isCreated){
                window.location.href = "../HTML/firstPage.html";
                localStorage.setItem("id", result.id);
            }
            else{
                alert("Користувач з такою поштою вже є");
            }
        })
        .catch(err => {
            alert('Помилка реєстрації: ' + err.message);
        });
    // Зберігаємо дані в localStorage
    if(emailText === undefined && passwordText === undefined){
        console.log("emailText is undefined or not declared");
        console.log("passwordText is undefined or not declared");
        alert('Будь ласка, введіть коректні дані.');
    } // Повідомлення про помилку}
    else {
        localStorage.setItem('userEmail', emailText); // Зберігаємо email
        localStorage.setItem('userPassword', passwordText); // Зберігаємо пароль
        localStorage.setItem('name', nameText); // Зберігаємо пароль
        console.log('Дані збережено:', emailText, passwordText, nameText); // Лог для перевірки
        container.classList.remove("active"); // Показати форму входу
    }
});

// Обробка форми входу
// Обробка форми входу
const signInForm = document.getElementById("login");
console.log(signInForm)
signInForm.addEventListener('click', function (event) {
    event.preventDefault(); // Запобігаємо стандартній відправці форми

    window.location.href = '../HTML/login.html'; // Перенаправлення на головну сторінку
});

// Функція для відображення даних профілю на сторінці реєстрації
displayProfileData();

function displayProfileData() {
    const username = localStorage.getItem('userName'); // Виправлено на 'userName'
    const email = localStorage.getItem('userEmail'); // Виправлено на 'userEmail'

    const regUsernameElement = document.getElementById('regUsername');
    const regEmailElement = document.getElementById('regEmail');

    if (regUsernameElement && username) {
        regUsernameElement.textContent = username;
    }
    if (regEmailElement && email) {
        regEmailElement.textContent = email;
    }
}
///////