document.addEventListener("DOMContentLoaded", function () {
    const timerElement = document.getElementById("resend-code");
    
    let countdown = 120;
    let timerActive = false;
    let intervalId;

    function startTimer() {
        timerActive = true;
        timerElement.innerHTML = `Надіслати повторно код (<span id="timer-count">${countdown}</span>с)`;
        const timerSpan = document.getElementById("timer-count");

        intervalId = setInterval(() => {
            countdown--;
            timerSpan.innerText = countdown;
            if (countdown <= 0) {
                clearInterval(intervalId);
                timerElement.innerText = "Надіслати повторно код";
                timerActive = false;
                countdown = 120; // Підготовка до наступного запуску
            }
        }, 1000);
    }

    // Якщо користувач натисне після завершення таймера, можна знову запустити відлік
    timerElement.addEventListener("click", function (event) {
        event.preventDefault();
        if (!timerActive) {
            startTimer();
        }
    });

    // Автоматичний запуск таймера при завантаженні сторінки
    startTimer();
});
