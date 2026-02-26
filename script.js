// =============================
// GLOBAL STATE
// =============================

let isVip = false;
let currentTab = "solo";

let taskState = {
    solo: [],
    pair: [],
    faction: []
};

// =============================
// TASKS
// =============================

const tasks = {
    solo: [
        { name: "Бросить мяч питомцу 15", bp: 2 },
        { name: "Команды питомцу 15", bp: 2 },
        { name: "Кинотеатр 5", bp: 1 },
        { name: "Баскетбол 2", bp: 1 },
        { name: "Футбол 2", bp: 1 },
        { name: "Волейбол 10", bp: 1 },
        { name: "Автобус 2", bp: 2 },
        { name: "Стройка 2", bp: 2 },
        { name: "Порт 2", bp: 2 },
        { name: "Шахта 2", bp: 2 },
        { name: "Ферма 10", bp: 1 },
        { name: "Рыбалка 20", bp: 4 },
        { name: "Дальнобойщик 4", bp: 2 },
        { name: "Охота 5", bp: 2 },
        { name: "Тренировочный зал 20", bp: 1 },
        { name: "Квест клуба 2", bp: 4 },
        { name: "Пожарный 20", bp: 1 },
        { name: "Смена внешки 2", bp: 2 },
        { name: "Почта 10", bp: 1 }
    ],
    pair: [
        { name: "Денс батл 3", bp: 2 },
        { name: "Арена 3", bp: 1 }
    ],
    faction: [
        { name: "Аирдроп 2", bp: 4 },
        { name: "Граффити 7", bp: 1 },
        { name: "Контрабанда 5", bp: 2 },
        { name: "Бизвар 5", bp: 2 },
        { name: "Медкарты EMS 5", bp: 2 },
        { name: "Вызовы EMS 15", bp: 2 },
        { name: "Объявления WN 40", bp: 2 },
        { name: "Ограбления домов 15", bp: 2 },
        { name: "Коды 5", bp: 2 },
        { name: "Регистрация авто 2", bp: 1 },
        { name: "Выкуп с КПЗ 2", bp: 2 }
    ]
};

// =============================
// RENDER TASKS
// =============================

function renderTasks(type) {
    const container = document.getElementById("bp-container");
    container.innerHTML = "";

    tasks[type].forEach((task, index) => {

        if (taskState[type][index] === undefined) {
            taskState[type][index] = false;
        }

        const div = document.createElement("div");
        div.className = "bp-task";

        if (taskState[type][index]) {
            div.classList.add("completed");
        }

        div.innerHTML = `
            <label>
                <input type="checkbox"
                    ${taskState[type][index] ? "checked" : ""}
                    onchange="toggleTask('${type}', ${index})">
                ${task.name}
            </label>
            <div class="bp-reward">
            ${isVip ? task.bp * 2 : task.bp} BP
         </div>
        `;

        container.appendChild(div);
    });

    updateBP();
}

function toggleTask(type, index) {
    taskState[type][index] = !taskState[type][index];
    renderTasks(type);
}

// =============================
// BP CALC
// =============================

function updateBP() {
    let total = 0;

    Object.keys(tasks).forEach(type => {
        tasks[type].forEach((task, index) => {
            if (taskState[type][index]) {
                total += isVip ? task.bp * 2 : task.bp;
            }
        });
    });

    document.getElementById("bp-total").innerText = total;

    const progress = (total % 10) * 10;
    document.getElementById("bp-fill").style.width = progress + "%";
}

// =============================
// VIP
// =============================

function toggleVip() {
    isVip = !isVip;
    renderTasks(currentTab);
}

// =============================
// BP TAB SWITCH
// =============================

function switchBP(tab, button) {
    currentTab = tab;

    document.querySelectorAll(".bp-tab").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTasks(tab);
}

// =============================
// SECTION SWITCH
// =============================

function switchSection(id) {

    document.querySelectorAll(".section").forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById(id).style.display = "block";

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelector(`.nav-btn[onclick="switchSection('${id}')"]`)
        ?.classList.add("active");
}

// =============================
// CLUB SWITCH
// =============================

function switchClub(id, button) {

    document.querySelectorAll(".club-content").forEach(c => {
        c.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    document.querySelectorAll(".club-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}

// =============================
// START
// =============================

renderTasks("solo");
switchSection("home");