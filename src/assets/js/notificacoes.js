const notificationBtn = document.querySelector(".notification-btn");
const notificationMenu = document.querySelector(".notification-menu");

notificationBtn.addEventListener("click", () => {
    notificationMenu.classList.toggle("active");
});