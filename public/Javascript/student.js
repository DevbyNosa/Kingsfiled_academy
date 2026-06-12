const dashboardStudentMenu = document.querySelector(".student-harmburger");
const dashboardSidebar = document.querySelector(".sidebar")

dashboardStudentMenu.addEventListener("click", () => {

 dashboardSidebar.classList.toggle("active");
})