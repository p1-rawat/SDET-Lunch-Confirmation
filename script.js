const startBtn = document.getElementById("startBtn");
const empInput = document.getElementById("empId");
const status = document.getElementById("status");

chrome.storage.local.get(["empId"], (data) => {
    if (data.empId) empInput.value = data.empId;
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
