// Runs when popup or page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchMenu();
});

// Fetch menu from API
async function fetchMenu() {
  const container = document.getElementById("menu-container");

  try {
    const response = await fetch("https://lunch-booking.netlify.app/api/menu/today");
    // const data = await response.json();

    const data = {
        menu_text: "Shahi Paneer\nMix Veg\nRice\nRoti\nRaita"
    };

    renderMenu(data.menu_text);
  } catch (error) {
    console.error("Error fetching menu:", error);
    container.innerHTML = '<p class="loading-menu-failed">Failed to load menu, Please contact Admin!</p>';
  }
}

// Render menu based on API response
function renderMenu(menuText) {
  const container = document.getElementById("menu-container");

  // If null or empty
  if(!menuText) {
    container.innerHTML = '<p class="menu-empty">Lunch Menu is not available yet!</p>';
    return;
  }

  // Convert string → array
  const items = menuText
    .split("\n")
    .map(item => item.trim())
    .filter(item => item.length > 0);

  // Build table
  // Define usual items
    const usualItemsList = ["Rice", "Roti", "Raita"];

    // Split items
    const usualItems = items.filter(item => usualItemsList.includes(item));
    const specialItems = items.filter(item => !usualItemsList.includes(item));

    // Build table
    let tableHTML = `
    <table style="border-collapse: collapse; width: 100%;">
        <thead>
        <tr>
            <th id="tableHead" colspan="2">
            Lunch Menu
            </th>
        </tr>
        <tr>
            <th style="border: 1px solid #ccc; padding: 8px;">Today's Special</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Usual</th>
        </tr>
        </thead>
        <tbody>
    `;

    // max rows
    const maxLength = Math.max(specialItems.length, usualItems.length);

    for (let i = 0; i < maxLength; i++) {
    tableHTML += `
        <tr>
        <td style="border: 1px solid #ccc; padding: 8px;">
            ${specialItems[i] || ""}
        </td>
        <td style="border: 1px solid #ccc; padding: 8px;">
            ${usualItems[i] || ""}
        </td>
        </tr>
    `;
    }

    tableHTML += `
        </tbody>
    </table>
    `;

  container.innerHTML = tableHTML;
}