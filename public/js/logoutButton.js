window.addEventListener("load", () => {
    const logoutButton = document.getElementById("logoutButton")
    logoutButton.addEventListener("click", () => {
        console.log("click")
        popup();
    })
})

function popup() {
    const logoutButton = document.getElementById("confirmLogout")
    logoutButton.style.display = "block";
    setTimeout(closePopUp, 5000);
}
function closePopUp() {
    const logoutButton = document.getElementById("confirmLogout")
    logoutButton.style.display = "none";
}
function popup2() {
    const logoutButton = document.getElementById("confirmLogout2")
    logoutButton.style.display = "block";
    setTimeout(closePopUp2, 5000);
}
function closePopUp2() {
    const logoutButton = document.getElementById("confirmLogout2")
    logoutButton.style.display = "none";
}