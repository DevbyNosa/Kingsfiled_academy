const dashboardStudentMenu = document.querySelector(".student-harmburger");
const dashboardSidebar = document.querySelector(".sidebar-list")

dashboardStudentMenu.addEventListener("click", () => {
 dashboardSidebar.classList.add("active")
})