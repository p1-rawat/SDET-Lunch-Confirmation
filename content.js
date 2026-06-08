chrome.storage.local.get(["automationEnabled", "empId"], (data) => {
    if (data.automationEnabled && data.empId) {
        chrome.storage.local.set({ automationEnabled: false });
        // Small delay to ensure the portal's initial JS has settled
        setTimeout(() => automate(data.empId), 2000);
    }
});

async function automate(empId) {
    const waitFor = (selector, options = {}) => new Promise(r => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            const visible = element && element.offsetParent !== null && window.getComputedStyle(element).visibility !== "hidden";
            if (element && (!options.visible || visible)) {
                clearInterval(interval);
                r(element);
            }
        }, 500);
    });

    const waitForVisible = (selector) => waitFor(selector, { visible: true });

    const setInputValue = (input, value) => {
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    };

    const waitForConfirmationButton = async () => {
        const end = Date.now() + 5000;
        while (Date.now() < end) {
            const buttons = Array.from(document.querySelectorAll("button, [role='button'], input[type='button']"));
            const yesButton = buttons.find(btn => btn.offsetParent !== null && /^(yes|confirm|reserve)$/i.test(btn.textContent.trim()));
            if (yesButton) {
                yesButton.click();
                return true;
            }
            await new Promise(r => setTimeout(r, 300));
        }
        return false;
    };

    try {
        // Step 1: Login
        (await waitForVisible(".w-full.h-full.object-cover")).click();
        const input = await waitForVisible("input");
        setInputValue(input, empId);
        (await waitForVisible("#loginBtnText")).click();
        await new Promise(r => setTimeout(r, 1000));

        // Step 2: Check Menu
        const menuItem = await waitForVisible("#menuItemsList li span:last-child");
        if (menuItem.textContent.includes("No menu set for today yet")) return;

        // Step 3: Confirm Booking
        const reserveBtn = await waitForVisible("#reserveBtn");
        if (reserveBtn) {
            reserveBtn.click();
            await new Promise(r => setTimeout(r, 1000));
            const confirmBtn = Array.from(document.querySelectorAll("button, [role='button'], input[type='button']"))
                .find(btn => btn.offsetParent !== null && /^(yes|confirm|reserve)$/i.test(btn.textContent.trim()));
            if (confirmBtn) confirmBtn.click();
            setTimeout(() => { window.close(); }, 6000);
        }
    }
    catch(e) {
        console.error("Lunch Automation failed:", e);
    }
}
