const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboard = document.getElementById('leaderboard');

leaderboardBtn.addEventListener('click', async () => {
    if (!leaderboardBtn || !leaderboard) {
        return;
    }

    try {
        const response = await fetch('https://lunch.sdettech.com/api/bookings/leaderboard');
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        const rows = Array.isArray(data?.scores) ? data.scores.slice(0, 5) : [];

        leaderboard.innerHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((item, index) => {
                        const rankClass = index === 0 ? 'first-place' : index === 1 ? 'second-place' : index === 2 ? 'third-place' : '';
                        return `
                            <tr class="${rankClass}">
                                <td>${item?.employee_name ?? 'N/A'} ${index === 0 ? '👑 ' : ''}</td>
                                <td>${item?.total_points ?? 0}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        leaderboard.textContent = 'Unable to load leaderboard. Please try again.';
        console.error(error);
    }
});
