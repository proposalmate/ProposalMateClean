console.log("Dashboard JS is running");
function setupSidebarNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const closeButton = document.querySelector(".close-sidebar");
  const sidebarLinks = document.querySelectorAll(".dashboard-link");

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeButton && sidebar) {
    closeButton.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupSidebarNavigation();
  loadUserData();
  loadProposals();
});

function loadUserData() {
  const token = localStorage.getItem("token");

  fetch("/api/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const nameElement = document.querySelector(".user-name");
      if (nameElement && data && data.name) {
        nameElement.textContent = data.name;
      }
    })
    .catch(err => {
      console.error("Failed to load user data:", err);
    });
}

function loadProposals() {
  const token = localStorage.getItem("token");

  fetch("/api/v1/proposals", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector(".proposal-list");
      container.innerHTML = "";

      if (!data || data.length === 0) {
        container.innerHTML = "<p>No proposals yet.</p>";
        return;
      }

      data.forEach(proposal => {
        const div = document.createElement("div");
        div.classList.add("proposal-card");
        div.innerHTML = `
          <h3>${proposal.title}</h3>
          <p>Client: ${proposal.clientName}</p>
          <p>Date: ${new Date(proposal.createdAt).toLocaleDateString()}</p>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Failed to load proposals:", err);
    });
}

function setupSidebarNavigation() {
  const links = document.querySelectorAll(".dashboard-link");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      // Optional: prevent default if using dynamic loading
      // e.preventDefault();

      links.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
}
