const loginBtn = document.getElementById('login');
console.log(loginBtn);
// Обробка форми реєстрації
loginBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Запобігаємо стандартній відправці форми
    const email = document.getElementById('email'); // Отримуємо email
    const password = document.getElementById('password'); // Отримуємо пароль
    const emailText = email.value;
    const passwordText = password.value;

    console.log(emailText);
    console.log(passwordText);
    if (!emailText) {
        alert('Введіть email');
        return;
    }
    if (!passwordText, passwordText.length < 8) {
        alert('Пароль має містити не менше 8 символів');
        return;
    }

    const data = { emailText, passwordText };

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                // Якщо статус 400 чи інша помилка — кидаємо її у catch
                return response.json().then(err => {
                    throw new Error(err.message,  'Сталася помилка під час реєстрації');
                });
            }
            return response.json();
        })
        .then(result => {
            alert(' Авторизація ' + result.isLogined);
            console.log(result, "Логається результат");
            if (result.isLogined) {
                window.location.href = "../HTML/firstPage.html";
                localStorage.setItem("id", result.id);
                localStorage.setItem("name", result.name);
            }
            else {
                alert("Неправильні пошта або пароль");
            }
        })
        .catch(err => {
            alert('Помилка реєстрації: ' + err.message);
        });
    // Зберігаємо дані в localStorage
    if (emailText === undefined && passwordText === undefined) {
        console.log("emailText is undefined or not declared");
        console.log("passwordText is undefined or not declared");
        alert('Будь ласка, введіть коректні дані.');
    } // Повідомлення про помилку}
    else {
        localStorage.setItem('userEmail', emailText); // Зберігаємо email
        localStorage.setItem('userPassword', passwordText); // Зберігаємо пароль
        console.log('Дані збережено:', emailText, passwordText); // Лог для перевірки

    }
});

// Обробка форми входу
// Обробка форми входу
const signInForm = document.getElementById("login");
console.log(signInForm)
signInForm.addEventListener('click', function (event) {
    event.preventDefault(); // Запобігаємо стандартній відправці форми

//    window.location.href = '../HTML/login.html'; // Перенаправлення на головну сторінку
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
//});