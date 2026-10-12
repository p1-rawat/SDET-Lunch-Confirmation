const leaderboardBtn = document.getElementById('leaderboardBtn');
const leaderboard = document.getElementById('leaderboard');

leaderboardBtn.addEventListener('click', async () => {
    if (!leaderboardBtn || !leaderboard) {
        return;
    }

    try {
        const response = await fetch('https://lunch-booking.netlify.app/api/bookings/leaderboard');
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        const rows = Array.isArray(data?.scores) ? data.scores.slice(0, 5) : [];

        leaderboard.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((item) => `
                        <tr>
                            <td>${item?.employee_name ?? 'N/A'}</td>
                            <td>${item?.total_points ?? 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        leaderboard.textContent = 'Unable to load leaderboard. Please try again.';
        console.error(error);
    }
});
