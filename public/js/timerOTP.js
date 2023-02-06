function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}	

window.onload = function () {
    var minutes = 60 * 2,
    display = document.querySelector('#time');
    startTimer(minutes, display);
    setTimeout(() => {
        const message = document.getElementById("info-message")
        message.style.display = "none";
    }, 5000);
    setTimeout(() => {
        window.location.assign("http://localhost:5000/login");
    }, 115000)
};