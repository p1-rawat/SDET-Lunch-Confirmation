chrome.storage.local.get(["automationEnabled", "empId"], (data) => {
    if (data.automationEnabled && data.empId) {
        chrome.storage.local.set({ automationEnabled: false });
        // Small delay to ensure the portal's initial JS has settled
        setTimeout(() => automate(data.empId), 2000);
    }
});

async function automate(empId) {
    const waitFor = (s) => new Promise(r => {
        const i = setInterval(() => {
            const e = document.querySelector(s);
            if (e) { clearInterval(i); r(e); }
        }, 500);
    });

    try {
        // Step 1: Login
        (await waitFor(".plate")).click();
        const input = await waitFor("input");
        input.value = empId;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        (await waitFor("#loginBtn")).click();

        // Step 2: Check Menu
        const dish = await waitFor("#dishList .dish-item:first-child .dish-name");
        if (dish.textContent.includes("Menu not set yet")) return;

        // Step 3: Confirm Booking
        (await waitFor(".flip-front h3")).click();
        (await waitFor("#confirmBtn")).click();

        setTimeout(() => { window.close(); }, 4000);
    } catch (e) {
        console.error("Lunch Automation failed:", e);
    }
}
