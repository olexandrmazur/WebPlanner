window.addEventListener('DOMContentLoaded',()=>{
    let nameElement = document.querySelector(".name");
    let storedName = localStorage.getItem("name");
    if (nameElement) {
        nameElement.textContent = storedName;
    }
    let emailElement = document.querySelector(".userEmail");
    let storedEmail = localStorage.getItem("userEmail");
    if (emailElement) {
        emailElement.textContent = storedEmail;
    }
    let nameElementProfile = document.querySelector(".nameProfile");
    let storedNameProfile = localStorage.getItem("name");
    if (nameElementProfile) {
        nameElementProfile.textContent = storedNameProfile;
    }
    let emailElementProfile = document.querySelector(".userEmailProfile");
    let storedEmailProfile = localStorage.getItem("id");
    if (emailElementProfile) {
        emailElementProfile.textContent = "ID: " + storedEmailProfile;
    }
    ///////////////////////////////////////////////////////////////////////
    const themeCheckbox = document.getElementById("theme-toggle-checkbox");
    const sunProfile = document.getElementById("sun")
    const moonProfile = document.getElementById("moon")
    console.log(sunProfile,moonProfile)
    const savedTheme = localStorage.getItem("theme");
// Загружаем тему при старте
        if (savedTheme === "dark") {
            document.body.classList.add("dark-theme");
            themeCheckbox.checked = true;
            sunProfile.src = '../img/sunLight.svg'
            moonProfile.src = '../img/moonLight.svg'
        }

// Слушатель переключения
    themeCheckbox.addEventListener("change", () => {
        if (savedTheme === "dark") {
            sunProfile.src = '../img/sunLight.svg'
            moonProfile.src = '../img/moonLight.svg'
        } else {
            sunProfile.src = '../img/sun.svg'
            moonProfile.src = '../img/moon.svg'
        }
        if (themeCheckbox.checked) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
        window.location.href = "../HTML/profile.html"
    });
/////////////////////////////////////////////////////////////////////////
})
const hamburger = document.querySelector('.Hamburger');
const settingsMenu = document.querySelector('.settings-menu');
hamburger.addEventListener('click', () => {
    settingsMenu.classList.toggle('unactive');
});
const closeSettingsBtn = document.querySelector('.close-settings');
closeSettingsBtn.addEventListener('click', () => {
    settingsMenu.classList.add('unactive');
});
const logoutButton = document.getElementById("logout-btn");
logoutButton.addEventListener("click", ()=>{
    localStorage.clear();
    window.location.href = "../HTML/index.html"
});
const settingsButton = document.getElementById("settings");
settingsButton.addEventListener("click", ()=>{
    window.location.href = "../HTML/profile.html"
});
const deleteButton = document.getElementById("delete-btn");
deleteButton.addEventListener("click", ()=>{
    const userId = localStorage.getItem("id");
    const data = {userId};
    console.log('🔍 Дані перед відправкою:', data);

    fetch('http://localhost:8080/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Сталася помилка під час видалення акаунта');
                });
            }
            return response.json();
        })
        .then(result => {
            alert('Видалення акаунта: ' + result.isDeleted);
            if (result.isDeleted) {
                localStorage.clear();
                window.location.href = "../HTML/index.html";
            } else {
                alert("Сталася помилка під час видалення акаунта");
            }
        })
        .catch(err => {
            alert('❌ Помилка під час видалення завдання: ' + err.message);
        });
});
const editButton = document.getElementById("edit-acc");
editButton.addEventListener("click", ()=>{
    const email = document.getElementById('email'); // Отримуємо email
    const password = document.getElementById('password'); // Отримуємо пароль
    const name = document.getElementById('name'); // Отримуємо пароль
    console.log(email);
    console.log(password);
    console.log(name);
    const emailText = email.value;
    const passwordText = password.value;
    const nameText = name.value;
    const idText = localStorage.getItem("id");
    console.log(emailText);
    console.log(passwordText);
    console.log(nameText);
    if (!emailText) {
        alert('Введіть email');
        return;
    }
    if (!passwordText || passwordText.length < 8) {
        alert('Пароль має містити не менше 8 символів');
        return;
    }

    const data = { emailText, passwordText, nameText, idText };

    fetch('http://localhost:8080/api/edit-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                // Якщо статус 400 чи інша помилка — кидаємо її у catch
                return response.json().then(err => {
                    throw new Error(err.message || 'Сталася помилка під час редагування акаунта');
                });
            }
            return response.json();
        })
        .then(result => {
            alert('Зміна акаунта ' + result.isUpdated);
            console.log(result,"Логається результат");
            if(result.isUpdated){
                alert("БЛЯЯЯЯЯЯЯЯ ВОНО ЗАРОБИЛО Я АЖ ВСРАВСЯ");
                window.location.href = "../HTML/firstPage.html";
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
console.log(localStorage);