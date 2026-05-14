const notificationBtn = document.querySelector(".notification-btn");
const notificationMenu = document.querySelector(".notification-menu");

notificationBtn.addEventListener("click", () => {
    notificationMenu.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (!notificationMenu.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationMenu.classList.remove("active");
    }
});