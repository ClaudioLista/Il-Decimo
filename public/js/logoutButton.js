window.addEventListener("load", () => {
    const logoutButton = document.getElementById("logoutButton")
    logoutButton.addEventListener("click", () => {
        console.log("click")
        popup();
    })
    const logoutButton2 = document.getElementById("logoutButton2")
    logoutButton2.addEventListener("click", () => {
        console.log("click")
        popup2();
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