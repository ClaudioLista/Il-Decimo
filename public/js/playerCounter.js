function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
        window.requestAnimationFrame(step);
    }
    };
    window.requestAnimationFrame(step);
}

window.addEventListener("load", () => { 
    let list = document.getElementsByClassName("match__playerCount__in");
    for (var i = 0; i < list.length; i++) {
        list[i].id = "match__playerCount_" + (i + 1);
        const counter = document.getElementById(list[i].id);
        animateValue(counter, 0, counter.innerHTML, 1000);
    }
});