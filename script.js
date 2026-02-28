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
        { name: "Посетить сайт", bp: 1 },
        { name: "Зайти в канал Brawl", bp: 1 },
        { name: "Лотерея", bp: 1 },
        { name: "Лайк в Match", bp: 1 },
        { name: "Кейс за DP", bp: 10 },
        { name: "Броски питомцу 15", bp: 2 },
        { name: "Команды питомца 15", bp: 2 },
        { name: "Киностудия", bp: 2 },
        { name: "Тир", bp: 1 },
        { name: "Кинотеатр 5", bp: 1 },
        { name: "Баскетбол 2", bp: 1 },
        { name: "Футбол 2", bp: 1 },
        { name: "Волейбол 1мин", bp: 1 },
        { name: "Настольный теннис 1мин", bp: 1 },
        { name: "Большой теннис 1мин", bp: 1 },
        { name: "Колесо удачи", bp: 3 },
        { name: "Автосервис (своё)", bp: 1 },
        { name: "Починить чужое авто", bp: 2 },
        { name: "Автобус 2", bp: 2 },
        { name: "Стройка 25", bp: 2 },
        { name: "Порт 25", bp: 2 },
        { name: "Шахта 25", bp: 2 },
        { name: "Метро", bp: 2 },
        { name: "Дартс", bp: 1 },
        { name: "Ферма 10", bp: 1 },
        { name: "Рыбалка 20", bp: 4 },
        { name: "Дальнобойщик 4", bp: 2 },
        { name: "Сокровище", bp: 1 },
        { name: "Охота 5", bp: 2 },
        { name: "Тренажерный зал 20", bp: 1 },
        { name: "Квесты клуба 2", bp: 4 },
        { name: "Пожарный 25", bp: 1 },
        { name: "Нули в казино", bp: 2 },
        { name: "Заказ материалов", bp: 1 },
        { name: "Смена внешности 2", bp: 2 },
        { name: "Золотая рыбка", bp: 5 },
        { name: "Почта 10", bp: 1 },
        { name: "Платеж по лизингу", bp: 1 }
    ],
    pair: [
        { name: "Гонка", bp: 1 },
        { name: "Трен. Комплекс 5", bp: 1 },
        { name: "Картинг", bp: 1 },
        { name: "Денс батл 3", bp: 2 },
        { name: "Армреслинг", bp: 1 },
        { name: "Мафия", bp: 3 }
    ],
    faction: [
        { name: "Аирдроп 2", bp: 4 },
        { name: "Граффити 7", bp: 1 },
        { name: "Контрабанда 5", bp: 2 },
        { name: "Хаммер с ВЗХ", bp: 3 },
        { name: "Посадить траву в теплице", bp: 4 },
        { name: "Запустить переработку обезбола", bp: 4 },
        { name: "Капт", bp: 1 },
        { name: "Бизвар 5", bp: 2 },
        { name: "Медкарты EMS 5", bp: 2 },
        { name: "Вызовы EMS 15", bp: 2 },
        { name: "Объявления WN 40", bp: 2 },
        { name: "Зелёная строка WN", bp: 2 },
        { name: "Ограбления домов 15", bp: 2 },
        { name: "Коды 5", bp: 2 },
        { name: "Регистрация авто 2", bp: 1 },
        { name: "Арест", bp: 1 },
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

async function toggleTask(type, index) {

    taskState[type][index] = !taskState[type][index];

    // если работает через pywebview — сохраняем
    if (window.pywebview) {
        try {
            await saveToBackend();
        } catch (e) {
            console.log("Ошибка сохранения:", e);
        }
    }

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

async function toggleVip() {
    isVip = !isVip;

    if (window.pywebview) {
        await saveToBackend();
    }

    renderTasks(currentTab);
}

// =============================
// BP TAB SWITCH
// =============================

async function switchBP(tab, button) {
    currentTab = tab;

    document.querySelectorAll(".bp-tab").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTasks(tab);

    if (window.pywebview) {
        await saveToBackend();
    }
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

window.addEventListener("pywebviewready", async () => {
    await loadFromBackend();
    renderTasks(currentTab);
    switchSection("home");
    startResetTimer();
});
// =============================
// RESET TIMER (07:00 MSK)
// =============================

function getMoscowTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3 * 60 * 60 * 1000)); // UTC+3
}

function getNextResetTime() {
    const now = getMoscowTime();
    const reset = new Date(now);

    reset.setHours(7, 0, 0, 0);

    if (now >= reset) {
        reset.setDate(reset.getDate() + 1);
    }

    return reset;
}

function startResetTimer() {

    function updateTimer() {
        const now = getMoscowTime();
        const reset = getNextResetTime();

        const diff = reset - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const formatted =
            String(hours).padStart(2, '0') + "ч " +
            String(minutes).padStart(2, '0') + "м " +
            String(seconds).padStart(2, '0') + "с";

        const el = document.getElementById("reset-timer");
        if (el) el.innerText = formatted;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// сохранение и загрузка состояния задач через pywebview API

async function loadFromBackend() {
    const data = await window.pywebview.api.get_tasks();

    if (data.tasks) {
        taskState = {
            solo: data.tasks.solo || [],
            pair: data.tasks.pair || [],
            faction: data.tasks.faction || []
        };
    }

    // --- VIP ---
    isVip = data.vip || false;

    const vipSwitch = document.getElementById("vip-switch");
    if (vipSwitch) {
        vipSwitch.checked = isVip;
    }

    // --- Последняя вкладка ---
    currentTab = data.last_tab || "solo";
}

async function saveToBackend() {
    await window.pywebview.api.update_tasks({
        tasks: taskState,
        vip: isVip,
        last_tab: currentTab
    });
}

/* Ручной сброс задач (для отладки и в случае проблем с автосбросом) */

async function manualReset() {

    if (!confirm("Сбросить все задания?")) return;

    await window.pywebview.api.update_tasks({
        tasks: {
            solo: [],
            pair: [],
            faction: []
        },
        vip: isVip,
        last_tab: currentTab
    });

    await loadFromBackend();
    renderTasks(currentTab);
}

/** Проверка обновлений (только для desktop версии)*/

async function checkUpdate() {

    const status = document.getElementById("update-status");
    status.innerText = "Проверка обновлений...";

    if (!window.pywebview) {
        status.innerText = "Работает только в desktop версии.";
        return;
    }

    try {
        const result = await window.pywebview.api.check_update();

        if (result === "no_update") {
            status.innerText = "У вас последняя версия.";
        } else if (result === "updated") {
            status.innerText = "Обновление установлено. Перезапуск...";
        } else {
            status.innerText = "Ошибка обновления.";
        }

    } catch (e) {
        status.innerText = "Ошибка соединения.";
    }
}