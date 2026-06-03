// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function() {
  const menuButton = document.querySelector(".homepage-menu");
  const mobileMenu = document.querySelector(".homepage-navbar-small");

  if (menuButton && mobileMenu) {
    // Toggle menu on button click
    menuButton.addEventListener("click", function(event) {
      event.stopPropagation();
      mobileMenu.classList.toggle("active");
      console.log("Menu toggled:", mobileMenu.classList.contains("active"));
    });

    // Close menu when clicking outside
    document.addEventListener("click", function(event) {
      if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
        mobileMenu.classList.remove("active");
      }
    });

    // Close menu when clicking the close button
    const closeMenuButton = mobileMenu.querySelector(".close-menu");
    if (closeMenuButton) {
      closeMenuButton.addEventListener("click", function() {
        mobileMenu.classList.remove("active");
      });
    }

    const links = mobileMenu.querySelectorAll("a");
    links.forEach(function(link) {
      link.addEventListener("click", function() {
        mobileMenu.classList.remove("active");
      });
    });
  } else {
    console.log("Menu button or mobile menu not found");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const stats = document.querySelectorAll(".stat-number");

  const animateCount = (entries, observer) => {
    entries.forEach(entry => {
     
      if (entry.isIntersecting) {
        const target = entry.target;
        const endValue = parseInt(target.getAttribute("data-target"), 10);
        const duration = 2000; 
        let startTime = null;

        const step = (currentTime) => {
          if (!startTime) startTime = currentTime;
          const progress = currentTime - startTime;
          
          
          const progressRatio = Math.min(progress / duration, 1);
          const currentValue = Math.floor(progressRatio * endValue);
          
          target.innerText = currentValue;

          
          if (progress < duration) {
            requestAnimationFrame(step);
          } else {
            target.innerText = endValue; 
          }
        };

        requestAnimationFrame(step);
        observer.unobserve(target); 
      }
    });
  };

 
  const observer = new IntersectionObserver(animateCount, { threshold: 0.2 });
  stats.forEach(stat => observer.observe(stat));
});


// Academics Page (Tab Switching) FUnctionaility
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Password toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
    });
  });

  
 document.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");

  if (!toast) return;

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";

    setTimeout(() => toast.remove(), 300);
  }, 3000);
});