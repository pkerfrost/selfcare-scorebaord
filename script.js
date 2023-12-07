let log = JSON.parse(localStorage.getItem('adventureLog')) || [];
let totalPoints = log.reduce((total, entry) => {
    return entry.action === 'add' ? total + entry.points : total - entry.points;
}, 0);

function addPoints(activity, basePoints) {
    const duration = parseFloat(prompt(`Enter the duration of ${activity} in minutes:`)) || 0;

    let additionalPoints = 0;

    switch (activity) {
        case 'art':
            const artMusicBuyIn = 30;
            const artMusicMinutes = duration > artMusicBuyIn ? duration - artMusicBuyIn : 0;
            additionalPoints = basePoints + 0.2 * artMusicMinutes;
            break;
        case 'prose':
            additionalPoints = basePoints + 0.5 * duration;
            break;
        default:
            additionalPoints = basePoints + duration;
            break;
    }

    totalPoints += additionalPoints;
    const newEntry = { action: 'add', activity, points: additionalPoints, duration, timestamp: new Date() };
    log.push(newEntry);

    updateScoreboard();
    updateLocalStorage();
}

// ... existing code ...

function addPoints(activity, basePoints) {
    // ... existing code ...

    totalPoints += additionalPoints;
    const newEntry = { action: 'add', activity, points: additionalPoints, duration, timestamp: new Date() };
    log.push(newEntry);

    updateScoreboard();
    updateLocalStorage();
    showFireworks(); // New line to trigger fireworks animation
}

// ... existing code ...

function showFireworks() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    document.body.appendChild(firework);

    setTimeout(() => {
        firework.remove();
    }, 500);
}

// ... existing code ...


function deductPoints(reward, basePoints) {
    const duration = parseFloat(prompt(`Enter the duration of ${reward} in minutes:`)) || 0;
    const deductionPoints = basePoints * duration;

    totalPoints -= deductionPoints;
    const newEntry = { action: 'deduct', reward, points: deductionPoints, duration, timestamp: new Date() };
    log.push(newEntry);

    updateScoreboard();
    updateLocalStorage();
}

function updateScoreboard() {
    const breakdownElement = document.getElementById('adventurerBreakdown');
    const breakdownHTML = log.map((entry) => {
        const formattedTime = entry.timestamp.toLocaleString();
        if (entry.action === 'add') {
            return `${formattedTime}: +${entry.points.toFixed(2)} points for ${entry.activity} (${entry.duration} minutes)`;
        } else {
            return `${formattedTime}: -${entry.points.toFixed(2)} points for ${entry.reward} (${entry.duration} minutes)`;
        }
    }).join('<br>');

    breakdownElement.innerHTML = `<strong>Score Breakdown:</strong><br>${breakdownHTML}<br><br><strong>Total Score: ${totalPoints.toFixed(2)} points</strong>`;

    updateGraph();
}

function updateGraph() {
    const graphElement = document.getElementById('barGraph');
    graphElement.innerHTML = '';

    const maxBarWidth = 200;
    const scaleFactor = maxBarWidth / totalPoints;

    log.forEach((entry) => {
        const barWidth = entry.points * scaleFactor;
        const barColor = entry.action === 'add' ? '#2b8a3e' : '#e57373';
        const barText = entry.action === 'add' ? `+${entry.points.toFixed(2)}` : `-${entry.points.toFixed(2)}`;

        const barDiv = document.createElement('div');
        barDiv.style.width = `${barWidth}px`;
        barDiv.style.height = '20px';
        barDiv.style.backgroundColor = barColor;
        barDiv.style.marginTop = '5px';
        barDiv.style.marginBottom = '5px';
        barDiv.style.borderRadius = '4px';
        barDiv.title = `${barText} points - ${entry.timestamp.toLocaleString()}`;

        graphElement.appendChild(barDiv);
    });
}

function undoLastAction() {
    if (log.length > 0) {
        const lastAction = log.pop();
        if (lastAction.action === 'add') {
            totalPoints -= lastAction.points;
        } else {
            totalPoints += lastAction.points;
        }
        updateScoreboard();
        updateLocalStorage();
    }
}

function updateLocalStorage() {
    localStorage.setItem('adventureLog', JSON.stringify(log));
}

// Initial update
updateScoreboard();
