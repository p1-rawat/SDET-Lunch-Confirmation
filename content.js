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
        (await waitFor(".w-full.h-full.object-cover")).click();
        const input = await waitFor("input");
        input.value = empId;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        (await waitFor("#loginBtnText")).click();

        // Step 2: Check Menu
        const menuItem = await waitFor("#menuItemsList li span:last-child");
        if (menuItem.textContent.includes("No menu set for today yet")) return;

        // Step 3: Confirm Booking
        const reserveBtn = await waitFor("#reserveBtn");
        if(reserveBtn) {
            reserveBtn.click();
            setTimeout(() => { window.close(); }, 4000);
        }
    }
    catch(e) {
        console.error("Lunch Automation failed:", e);
    }
}
