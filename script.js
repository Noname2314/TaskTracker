let appData = {};

function hasPywebview() {
    return typeof window.pywebview !== "undefined" && window.pywebview && window.pywebview.api;
}

async function loadData() {
    try {
        if (hasPywebview()) appData = await window.pywebview.api.load_data();
        else {
            const raw = localStorage.getItem("taskTrackerData");
            appData = raw ? JSON.parse(raw) : null;
        }
    } catch { appData = null; }

    if (!appData) appData = { vip: false, tasks: [] };
    if (!Array.isArray(appData.tasks)) appData.tasks = [];
    if (typeof appData.vip !== "boolean") appData.vip = false;

    appData.tasks.forEach(t => { if(t.status === 'progress') t.activeProgress = false; });

    renderTasks();
    updateBP();
}

function renderTasks() {
    const container = document.getElementById("tasksContainer");
    container.innerHTML = "";

    appData.tasks.forEach(task => {
        let borderClass = task.status;
        if(task.status === 'progress' && task.activeProgress) borderClass = 'active-progress';

        const card = document.createElement("div");
        card.className = "task-card " + borderClass;

        card.innerHTML = `
            <div class="task-info">
                <strong>${task.title}</strong>
                <span class="reward">Награда: ${task.bp} BP</span>
            </div>
            <div class="task-actions">
                <button class="completed" onclick="setStatus(${task.id}, 'completed')">✔️</button>
                <button class="failed" onclick="setStatus(${task.id}, 'failed')">❌</button>
                <button class="progress" onclick="setStatus(${task.id}, 'progress')">⏳</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById("vipSwitch").checked = appData.vip === true;
}

async function setStatus(id, status) {
    const task = appData.tasks.find(t => t.id === id);
    if (!task) return;

    task.status = status;
    task.activeProgress = (status === "progress");

    await saveAppData();
    renderTasks();
    updateBP();
}

async function updateBP() {
    let total = 0;
    const multiplier = appData.vip ? 2 : 1;
    appData.tasks.forEach(task => { if(task.status==='completed') total += task.bp * multiplier; });
    document.getElementById("bpTotal").innerText = total;
}

document.getElementById("vipSwitch").addEventListener("change", async function(){
    appData.vip = this.checked;
    await saveAppData();
    updateBP();
});

document.getElementById("resetTasks").addEventListener("click", async function(){
    appData.tasks.forEach(t => { t.status = 'progress'; t.activeProgress = false; });
    await saveAppData();
    renderTasks();
    updateBP();
});

async function saveAppData() {
    try {
        if (hasPywebview()) await window.pywebview.api.save_data(appData);
        else localStorage.setItem("taskTrackerData", JSON.stringify(appData));
    } catch (err){ console.error(err); }
}

window.addEventListener("pywebviewready", loadData);