const current = document.querySelector('.current-active');
const hidden = document.querySelector('.choose-option');
const container = document.getElementsByClassName('container')[0]
const week = document.getElementsByClassName('week')[0]
const displayAnimal = document.getElementsByClassName('display-animal')[0]
const animalDropDown = document.getElementsByClassName('drop-down-animal')[0]
const frequency = document.getElementById('frequency')
const reminder = document.getElementById('reminder')
const addTaskBtn = document.getElementsByClassName('addTaskBtn')[0]
const calendar = document.getElementsByClassName('calendar')[0]
const addTask = document.getElementsByClassName('addTask')[0]
const cancel = document.getElementsByClassName('cancel')[0]
const frequencyOptions = document.getElementById('frequencyOption')
const importancyOptions = document.getElementById('importancyOption')
const reminderOptions = document.getElementById('reminderOption')
const confirmButton = document.getElementById("confirmButton");
const title = document.getElementById("title");
const content = document.getElementById("content");
const date = document.getElementById("date");
const time = document.getElementById("time");
const place = document.getElementById("place");
const participants = document.getElementById("participants");
const importancy = document.getElementById('importancy')
const circleColor = document.getElementsByClassName('circle-color')[0]
const finishedPlans = document.getElementsByClassName('finished-plans')[0]
const finishingPlans = document.getElementsByClassName('finishing-plans')[0]
const todayPlans =document.getElementsByClassName('today-plans')[0]
const monthPlans = document.getElementsByClassName('month-plans')[0]
const color = document.querySelector('.circle-color');
const colorAndConfirm = document.getElementsByClassName('colorAndAcceptTask')[0]
const dayTask = document.getElementsByClassName('day-task')[0]
const activeEvents = document.getElementsByClassName('active-tasks')[0]
const expiredEvents = document.getElementsByClassName('expired-tasks')[0]
let isDroppedFreq = false
let isDroppedImpo = false
let isDroppedRem = false
let isAddTask = false
let isChangeTask = false
let isDropped = false;
let isDroppedAnimal = false;
let currentActive = 'month'
let jsonString;
let data;
let diffMs;
let event_id_2;
let isDay = false
const id = localStorage.getItem("id");
///////////////////////////////////////////////////////////////////////
const themeCheckbox = document.getElementById("theme-toggle-checkbox");
const sunProfile = document.getElementById("sun")
const moonProfile = document.getElementById("moon")
const savedTheme = localStorage.getItem("theme");
// Загружаем тему при старте
document.addEventListener("DOMContentLoaded", () => {
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeCheckbox.checked = true;
        sunProfile.src = '../img/sunLight.svg'
        moonProfile.src = '../img/moonLight.svg'
    }
});
// Слушатель переключения
themeCheckbox.addEventListener("change", () => {
    if (savedTheme === "dark") {
        sunProfile.src = '../img/sunLight.svg'
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
    window.location.href = "../HTML/firstPage.html"
});
/////////////////////////////////////////////////////////////////////////
if (!id) {
    alert("ID не знайдено в localStorage");
} else {
    fetch('http://localhost:8080/api/render-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) })  // або просто id, залежить від API
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Сталася помилка під час провантаження завдання');
                });
            }
            return response.json();
        })
        .then(result => {


            jsonString = result.events;
            data = JSON.parse(jsonString);
            renderCalendar(currentYear,currentMonth)
            pleaseWork()


            setInterval(run,1000);
            function run(){
                todayPlans.innerHTML = '';
                monthPlans.innerHTML = '';
                finishingPlans.innerHTML = '';
                finishedPlans.innerHTML = '';
                Object.keys(data).forEach(i=>{


                    loadSidebar(data[i][0])
                })
            }







        })
        .catch(err => {
            alert('Помилка під час провантаження завдання: ' + err.message);
        });
}
let arrow = document.createElement('img')
arrow.src = '../img/arrowDown.png'
arrow.classList.add('arrow')
current.appendChild(arrow)

current.addEventListener('click', () => {

    if (isAddTask || isDay) {
        addTask.classList.add('unactive')
        addTaskBtn.classList.remove('unactive')
        calendar.classList.remove('unactive')
        dayTask.classList.add('unactive')
        isAddTask = false
        isChangeTask = false
        isDay = false


        return
    }
    if (!isDropped) {
        arrow.src = '../img/arrowUp.png'
        hidden.classList.remove('unactive');
        isDropped = true;
    } else {
        arrow.src = '../img/arrowDown.png'
        hidden.classList.add('unactive');
        isDropped = false;
    }

});
hidden.addEventListener('click', () => {

    arrow.src = '../img/arrowDown.png'
    const temp = current.textContent;
    current.textContent = hidden.textContent;
    hidden.textContent = temp;
    hidden.classList.add('unactive');
    isDropped = false;
    week.classList.toggle('unactive')
    container.classList.toggle('unactive')



    arrow.src = '../img/arrowDown.png'
    arrow.classList.add('arrow')
    current.appendChild(arrow)
    if (container.classList.contains('unactive')) {

        currentActive = 'week'
        generateWeek(currentDate);
        pleaseWork()

    } else {
        currentActive = 'month'
    }
});
displayAnimal.addEventListener('click', () => {
    if (isDroppedAnimal) {
        displayAnimal.src = '../img/arrowDown.png'
        isDroppedAnimal = false
    } else {
        displayAnimal.src = '../img/arrowUp.png'
        isDroppedAnimal = true
    }
    animalDropDown.classList.toggle('unactive')
})


addTaskBtn.addEventListener('click', () => {
    title.value = ``
    content.value = ``
    date.value = ``
    time.value = ``
    place.value = ``
    const existingTrashBin = colorAndConfirm.querySelector('.trashBin');
    if (existingTrashBin) {
        existingTrashBin.remove();
    }
    importancy.innerHTML = `Важливість<img class="note-choose" src="../img/arrowDown.png" alt="">`
    isChangeTask = false
    isAddTask = true
    addTask.classList.remove('unactive')
    addTaskBtn.classList.add('unactive')
    if (currentActive === 'week') {
        currentActive = 'month'
        const temp = current.textContent;
        current.textContent = hidden.textContent;
        hidden.textContent = temp;
        container.classList.remove('unactive')
        week.classList.add('unactive')
        calendar.classList.add('unactive')
        return
    }
    currentActive = 'month'
    calendar.classList.add('unactive')
})
cancel.addEventListener('click', () => {
    currentActive
    isAddTask = false
    isChangeTask = false
    addTask.classList.add('unactive')
    addTaskBtn.classList.remove('unactive')
    if (currentActive === 'month') {
        calendar.classList.remove('unactive')
    } else {
        container.classList.add('unactive')
        week.classList.remove('unactive')
    }
})
frequency.addEventListener('click', () => {
    frequencyOptions.classList.toggle('unactive')
})
importancy.addEventListener('click', () => {
    importancyOptions.classList.toggle('unactive')
})
reminder.addEventListener('click', () => {
    reminderOptions.classList.toggle('unactive')
})
frequencyOptions.addEventListener('click', (e) => {
    let chosen = e.target.textContent
    frequency.innerHTML = `${chosen}<img class="note-choose" src="../img/arrowDown.png" alt="">`
})
importancyOptions.addEventListener('click', (e) => {
    let chosen = e.target.textContent
    importancy.innerHTML = `${chosen}<img class="note-choose" src="../img/arrowDown.png" alt="">`
})
reminderOptions.addEventListener('click', (e) => {
    let chosen = e.target.textContent
    reminder.innerHTML = `${chosen}<img class="note-choose" src="../img/arrowDown.png" alt="">`
})
document.addEventListener("DOMContentLoaded", ()=>{

})
confirmButton.addEventListener("click", () => {

    const colorValue = circleColor.value; // ОТРИМУЄМО HEX (#ff0000)

    const titleText = title.value;
    const contentText = content.value;
    const dateText = date.value;
    const timeText = time.value;
    const placeText = place.value;
    const participantsText = participants.value;
    const importancyText = importancy.textContent;

    const data = {
        id,
        titleText,
        contentText,
        dateText,
        timeText,
        placeText,
        participantsText,
        importancyText,
        colorText: colorValue
    };
    if(isChangeTask){
        let titleValue = data.titleText
        let contentValue = data.contentText
        let dateValue = data['dateText']
        let timeValue = data.timeText
        let placeValue = data.placeText
        let importancyValue = data['importancyText']
        let colorValue = data.colorText
        let participantsValue = data['participantsText']
        let eventId = event_id_2

        const value = { eventId, titleValue, contentValue, dateValue, timeValue, placeValue, participantsValue, importancyValue, colorValue }


        fetch('http://localhost:8080/api/update-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(value)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Сталася помилка під час редгування завдання');
                    });
                }
                return response.json();
            })
            .then(result => {
                alert('Pедгування завдання: ' + result.isUpdated);
                if (result.isUpdated) {
                    window.location.href = "../HTML/firstPage.html";
                } else {
                    alert("Сталася помилка під час редгування завдання");
                }
            })
            .catch(err => {
                alert('❌ Помилка під час редгування завдання: ' + err.message);
            });
        return
    }



    fetch('http://localhost:8080/api/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Сталася помилка під час створення завдання');
                });
            }
            return response.json();
        })
        .then(result => {
            alert('Створення завдання: ' + result.isCreated);
            if (result.isCreated) {
                window.location.href = "../HTML/firstPage.html";
            } else {
                alert("Сталася помилка під час створення завдання");
            }
        })
        .catch(err => {
            alert('❌ Помилка під час створення завдання: ' + err.message);
        });
});

const calendarGrid = document.querySelector('.calendar-grid');
const calendarHeader = document.querySelector('.calendar-header');
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 0-11 -> 1-12
const day = String(today.getDate()).padStart(2, '0');
let hour = today.getHours()
const formattedToday = `${year}-${month}-${day}`;

function renderCalendar(year, month) {
    calendarGrid.innerHTML = `
        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Нд</div>
    `;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = (firstDay.getDay() + 6) % 7;
    const totalCells = startDay + daysInMonth;
    const totalRows = Math.ceil(totalCells / 7);

    // Додаємо порожні клітинки перед 1 числом
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');

        const weekDay = i % 7;
        if (weekDay === 5 || weekDay === 6) emptyCell.classList.add('weekend');
        if (weekDay === 6) emptyCell.classList.add('sunday');

        // Додаємо дату з попереднього місяця
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
        const dateNumber = prevMonthLastDay - startDay + i + 1;


        calendarGrid.appendChild(emptyCell);
    }

    // Додаємо дні місяця
    for (let day = 1; day <= daysInMonth; day++) {
        const dayIndexInGrid = startDay + day - 1;
        const row = Math.floor(dayIndexInGrid / 7);
        const isLastRow = row === totalRows - 1;
        const weekDay = dayIndexInGrid % 7;

        const cell = document.createElement('div');
        cell.classList.add('day');

        if (isLastRow) cell.classList.add('last-row-day');
        if (weekDay === 5 || weekDay === 6) cell.classList.add('weekend');
        if (weekDay === 6) cell.classList.add('sunday');

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        cell.setAttribute('data-date', dateStr);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        dateDiv.textContent = day;

        const tasksDiv = document.createElement('div');
        tasksDiv.classList.add('tasks');

        if(dateStr==formattedToday){
            dateDiv.classList.add('currentDay')
        }
        cell.appendChild(dateDiv);
        cell.appendChild(tasksDiv);
        cell.addEventListener('click',()=>{
            generateDay(dateStr)
        })
        calendarGrid.appendChild(cell);
    }


    const monthNames = [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];
    calendarHeader.innerHTML = `
        <button id="prevMonth">&lt;</button>
        ${monthNames[month]} ${year}
        <button id="nextMonth">&gt;</button>
    `;
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }

        renderCalendar(currentYear, currentMonth);
        pleaseWork();
    });
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar(currentYear, currentMonth);
        pleaseWork()
    });
}



function pleaseWork (){

    Object.keys(data).forEach(i => {

        const date = data[i][0]["date"]; // формат: YYYY-MM-DD
        console.log(date,`Бляяяя`)

        // Знайти елемент календаря з відповідним data-date
        const taskCell = document.querySelector(`.day[data-date="${date}"]`);
        console.log(taskCell,`ПРАЦЮЙ СУКААА`)
        const weekTaskCell = document.querySelector(`.week-day[data-date="${date}"]`)
        if(currentActive === 'month'){
            if (taskCell) {

                const tasksDiv = taskCell.querySelector(".tasks");
                const taskElement = document.createElement("div");
                taskElement.classList.add("task");
                console.log(`ІДИ НАХУЙЙЙЙЙ`,tasksDiv,taskElement)
                taskElement.style.backgroundColor = `${data[i][0].color}`
                taskColor(data[i][0],taskElement)
                tasksDiv.appendChild(taskElement);
            }
        }

        if(currentActive === 'week'){
            if(weekTaskCell){
                const taskText = data[i][0]["content"]; // припустимо, що є поле 'task'
                const weekTask = weekTaskCell.querySelector(".tasks");
                const taskElement = document.createElement("div");
                taskElement.classList.add("task");
                taskElement.textContent = taskText;
                taskElement.style.backgroundColor = `${data[i][0].color}`
                taskColor(data[i][0],taskElement)
                weekTask.appendChild(taskElement);
            }
        }

    });
}


function taskColor(data,task){
    let [year, month, day] = data.date.split('-').map(Number);
    let [hours, minutes] = data.time.split(':').map(Number);
    let fullDate = new Date(year,month-1,day,hours,minutes);
    let now = new Date();
    if(now<fullDate){
        diffMs = fullDate-now;
        const diffDays = diffMs / 86400000;

        if(fullDate.getFullYear() === now.getFullYear() &&
            fullDate.getMonth() === now.getMonth() &&
            diffDays <= 1) {
            task.style.backgroundColor = '#CFA935'
        }
    }
    if (fullDate < now) {
        task.style.backgroundColor = '#DE8686'
    }
}

function loadSidebar(data) {

    let [year, month, day] = data.date.split('-').map(Number);
    let [hours, minutes] = data.time.split(':').map(Number);
    let fullDate = new Date(year, month - 1, day, hours, minutes);
    let now = new Date();
    const formattedMinutes = String(minutes).padStart(2, "0");

    function createTask(displayTime) {
        let p = document.createElement('p');
        p.classList.add('task-name');

        let span = document.createElement('span');
        span.classList.add('time');
        span.textContent = displayTime;

        p.textContent = data.title;
        p.appendChild(span);

        p.addEventListener('click', () => {

            title.value = `${data.title}`
            content.value = `${data.content}`
            date.value = `${data['date']}`
            time.value = `${data.time}`
            place.value = `${data.location}`
            circleColor.value = `${data.color}`
            importancy.innerHTML = `${data['importancy']}<img class="note-choose" src="../img/arrowDown.png" alt="">`
            participants.value = `${data['participants']}`
            isChangeTask = true

            isAddTask = true
            addTask.classList.remove('unactive')
            addTaskBtn.classList.add('unactive')
            let eventId = data.id
            event_id_2 = eventId;
            const existingTrashBin = colorAndConfirm.querySelector('.trashBin');
            if (existingTrashBin) {
                existingTrashBin.remove();
            }
            trashBin = document.createElement('img')
            trashBin.src = '../img/trashBin.png'
            trashBin.classList.add('trashBin')
            trashBin.addEventListener('click',()=>{
                const data = {
                    eventId
                };


                fetch('http://localhost:8080/api/delete-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message || 'Сталася помилка під час видалення завдання');
                            });
                        }
                        return response.json();
                    })
                    .then(result => {
                        alert('Видалення завдання: ' + result.isDeleted);
                        if (result.isDeleted) {
                            window.location.href = "../HTML/firstPage.html";
                        } else {
                            alert("Сталася помилка під час видалення завдання");
                        }
                    })
                    .catch(err => {
                        alert('❌ Помилка під час видалення завдання: ' + err.message);
                    });
            })
            colorAndConfirm.appendChild(trashBin)
            if (currentActive === 'week') {
                currentActive = 'month'
                const temp = current.textContent;
                current.textContent = hidden.textContent;
                hidden.textContent = temp;
                container.classList.remove('unactive')
                week.classList.add('unactive')
                calendar.classList.add('unactive')
                return
            }
            currentActive = 'month'
            calendar.classList.add('unactive')
        });

        return p;
    }

    if (fullDate < now) {
        finishedPlans.appendChild(createTask(data.date));
    }

    if (fullDate.getFullYear() === now.getFullYear() &&
        fullDate.getMonth() === now.getMonth()) {
        monthPlans.appendChild(createTask(data.date));
    }

    if (now < fullDate) {
        const diffMs = fullDate - now;
        const diffDays = diffMs / 86400000;

        if (fullDate.getFullYear() === now.getFullYear() &&
            fullDate.getMonth() === now.getMonth() &&
            diffDays <= 1) {
            finishingPlans.appendChild(createTask(data.date));
        }
    }

    if (fullDate.getFullYear() === now.getFullYear() &&
        fullDate.getMonth() === now.getMonth() &&
        fullDate.getDate() === now.getDate()) {
        todayPlans.appendChild(createTask(`${hours}:${formattedMinutes}`));
    }
}

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
})
function reverse(s){
    return s.split("").reverse().join("");
}

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

// я дуже хочу з'їсти дизайнерів на обід вони задобвали ставити вимоги
// жарені котлети з дизайнерів річ гарна і смачна
// дуже хочу вбити дизайнерів і БА а БА за те шо вимоги пише
// мирного рішення не буде..
// надаю дизайнерам та БА по дупі щоб їм життя медом не здавалось
// і ще вб'ю нашого database engineer Колю

function generateWeek(date = new Date()) {


    const monthNames = [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];
    const weekLabel = document.getElementById('current-week-label')
    const weekGrid = document.querySelector('.week-grid');
    weekLabel.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    weekGrid.innerHTML = ''; // очищає попередній вміст

    const dayOfWeek = date.getDay(); // 0 (Нд) – 6 (Сб)
    const mondayOffset = (dayOfWeek + 6) % 7; // Пн = 0
    const monday = new Date(date);
    monday.setDate(date.getDate() - mondayOffset);

    const daysShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        const dayNum = day.getDate();
        const dayName = daysShort[i];
        const dateStr = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        const dayDiv = document.createElement('div');
        dayDiv.className = 'week-day';

        const weekDayName = document.createElement('p');
        weekDayName.textContent = `${dayName}`;
        weekDayName.classList.add('weekDayName')
        const weekDayDate = document.createElement('p')
        const weekTaskDiv = document.createElement('div')
        weekTaskDiv.classList.add('tasks');
        weekDayDate.textContent = `${dayNum}`
        weekDayDate.classList.add('WeekDayDate')
        if(dateStr==formattedToday){
            weekDayDate.classList.add('currentDay')
            weekDayName.classList.add('currentWeekDayName')
        }
        dayDiv.setAttribute('data-date', dateStr);
        dayDiv.appendChild(weekDayName);
        dayDiv.appendChild(weekDayDate)
        dayDiv.appendChild(weekTaskDiv)
        dayDiv.addEventListener('click',()=>{


            generateDay(dateStr)
        })

        weekGrid.appendChild(dayDiv);
    }
}

let currentDate = new Date();

document.querySelector('.next-week')?.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7);
    generateWeek(currentDate);
    pleaseWork()
});
function generateDay(date){

    let dataArray = []
    Object.keys(data).forEach(i=>{

        if(data[i][0]['date']===date){
            dataArray.push(data[i][0])

        }


    });
    if(dataArray.length >0){

        activeEvents.innerHTML = ''
        expiredEvents.innerHTML = ''
        isDay = true
        if(currentActive === 'week'){
            currentActive = 'month'
            let temp = current.textContent
            current.textContent = hidden.textContent
            hidden.textContent = temp
            arrow.src = '../img/arrowDown.png'
            arrow.classList.add('arrow')
            current.appendChild(arrow)
        }
        week.classList.add('unactive')
        container.classList.remove('unactive')
        calendar.classList.add('unactive')
        currentActive = 'month'
        dayTask.classList.remove('unactive')
        dataArray.forEach(i =>{
            console.log(i['date'])
            console.log(i['time'])

            const event = document.createElement('div')
            const openDetail = document.createElement('img')
            openDetail.src = '../img/arrowDown.png'
            openDetail.classList.add('openDetail')
            const checkBox = document.createElement('img')
            checkBox.src = '../img/checkBox.png'
            checkBox.classList.add('checkBox')
            const time = document.createElement('p')
            time.textContent = i['time']
            time.classList.add('eventTime')
            const eventDetails = document.createElement('div')
            const eventTitle = document.createElement('p')
            eventDetails.classList.add('eventDetails')
            eventTitle.textContent = i['title']
            eventTitle.classList.add('eventTitle')
            const eventContent = document.createElement('p')
            eventContent.textContent = i['content']
            const edit = document.createElement('img')
            edit.src = '../img/editButton.png'
            const deleteButton = document.createElement('img')
            deleteButton.src = '../img/trashBin.png'
            let eventId = i['id']
            deleteButton.addEventListener('click',()=>{
                const data = {
                    eventId
                };


                fetch('http://localhost:8080/api/delete-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(err => {
                                throw new Error(err.message || 'Сталася помилка під час видалення завдання');
                            });
                        }
                        return response.json();
                    })
                    .then(result => {
                        alert('Видалення завдання: ' + result.isDeleted);
                        if (result.isDeleted) {
                            window.location.href = "../HTML/firstPage.html";
                        } else {
                            alert("Сталася помилка під час видалення завдання");
                        }
                    })
                    .catch(err => {
                        alert('❌ Помилка під час видалення завдання: ' + err.message);
                    });
            })
            edit.classList.add('editButton')

            edit.addEventListener('click',()=> {
                const date = document.getElementById("date");
                const time = document.getElementById("time");
                dayTask.classList.add('unactive')
                title.value = `${i.title}`
                content.value = `${i.content}`
                date.value = `${i['date']}`
                time.value = `${i.time}`
                place.value = `${i.location}`
                circleColor.value = `${i.color}`
                importancy.innerHTML = `${i['importancy']}<img class="note-choose" src="../img/arrowDown.png" alt="">`
                participants.value = `${i['participants']}`
                isChangeTask = true
                isAddTask = true
                addTask.classList.remove('unactive')
                addTaskBtn.classList.add('unactive')
                let titleValue = i['title']
                let contentValue = i['content']
                let dateValue = i['date']
                let timeValue = i['time']
                let placeValue = i['location']
                let participantsValue = i['participants']
                let importancyValue = i['importancy']
                let colorValue = i['color']
                const value = { eventId, titleValue, contentValue, dateValue, timeValue, placeValue, participantsValue, importancyValue, colorValue }
                const existingTrashBin = colorAndConfirm.querySelector('.trashBin');
                if (existingTrashBin) {
                    existingTrashBin.remove();
                }
                trashBin = document.createElement('img')
                trashBin.src = '../img/trashBin.png'
                trashBin.classList.add('trashBin')
                trashBin.addEventListener('click',()=>{
                    const data = {
                        eventId
                    };


                    fetch('http://localhost:8080/api/delete-task', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    })
                        .then(response => {
                            if (!response.ok) {
                                return response.json().then(err => {
                                    throw new Error(err.message || 'Сталася помилка під час видалення завдання');
                                });
                            }
                            return response.json();
                        })
                        .then(result => {
                            alert('Видалення завдання: ' + result.isDeleted);
                            if (result.isDeleted) {
                                window.location.href = "../HTML/firstPage.html";
                            } else {
                                alert("Сталася помилка під час видалення завдання");
                            }
                        })
                        .catch(err => {
                            alert('❌ Помилка під час видалення завдання: ' + err.message);
                        });
                })
                colorAndConfirm.appendChild(trashBin)

            })
            const buttons = document.createElement('div')
            buttons.appendChild(edit)
            buttons.appendChild(deleteButton)
            buttons.classList.add('editAndDeleteButton')
            const buttonsAndTitle = document.createElement('div')
            const checkBoxAndTime = document.createElement('div')
            const contentAndArrowDown = document.createElement('div')
            contentAndArrowDown.classList.add('contentAndArrowDown')
            checkBoxAndTime.classList.add(('checkBoxAndTime'))
            checkBoxAndTime.appendChild(checkBox)
            checkBoxAndTime.appendChild(time)
            buttonsAndTitle.classList.add('buttonsAndTitle')
            buttonsAndTitle.appendChild(eventTitle)
            buttonsAndTitle.appendChild(buttons)
            eventDetails.appendChild(buttonsAndTitle)
            contentAndArrowDown.appendChild(eventContent)
            contentAndArrowDown.appendChild(openDetail)

            eventDetails.appendChild(contentAndArrowDown)
            event.appendChild(checkBoxAndTime)
            event.appendChild(eventDetails)
            event.classList.add('dayEvent')
            activeEvents.appendChild(event)
        })

    } else{


    }
}
document.querySelector('.prev-week')?.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7);
    generateWeek(currentDate);
    pleaseWork()
});
console.log(localStorage,`Venti KYS`)