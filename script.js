const startBtn = document.getElementById("startBtn");
const empInput = document.getElementById("empId");
const status = document.getElementById("status");

const darkModeToggle = document.getElementById("dark-mode-toggle");

chrome.storage.local.get(["empId", "theme"], (data) => {
    if (data.empId) empInput.value = data.empId;

    if (data.theme === "dark") {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        darkModeToggle.checked = true;
    } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
        darkModeToggle.checked = false;
    }
});

darkModeToggle.addEventListener("change", () => {
    const newTheme = darkModeToggle.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    chrome.storage.local.set({ theme: newTheme });
});

empInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        startBtn.click();
    }
});

startBtn.addEventListener("click", () => {
    const empId = empInput.value.trim();
    if (!empId) {
        status.style.color = "red";
        status.innerText = "Employee ID required";
        return;
    }

    status.innerText = "Connecting to portal...";
    status.style.color = "blue";

    chrome.storage.local.set({ empId, automationEnabled: true }, () => {
        chrome.tabs.create({ url: "https://lunch-booking.netlify.app/" });
    });
});
