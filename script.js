// ======================
// GLOBAL STATE
// ======================

let isVip = false
let isX2 = false
let currentTab = "solo"

let taskState = {
    solo: [],
    pair: [],
    faction: []
}

let timers = []

// ======================
// TASK LIST
// ======================

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
}

// ======================
// RENDER TASKS
// ======================

function renderTasks(type){

const container=document.getElementById("bp-container")
if(!container) return

container.innerHTML=""

tasks[type].forEach((task,index)=>{

if(taskState[type][index]===undefined){
taskState[type][index]=false
}

const div=document.createElement("div")
div.className="bp-task"

if(taskState[type][index]){
div.classList.add("completed")
}

div.innerHTML=`

<label>
<input type="checkbox"
${taskState[type][index]?"checked":""}
onchange="toggleTask('${type}',${index})">
${task.name}
</label>

<div class="bp-reward">
${ (isVip ? task.bp*2 : task.bp) * (isX2 ? 2 : 1) } BP
</div>
`

container.appendChild(div)

})

updateBP()

}

function switchBP(tab, btn){

currentTab = tab

document.querySelectorAll(".bp-tab").forEach(b=>{
b.classList.remove("active")
})

if(btn){
btn.classList.add("active")
}

renderTasks(tab)
saveTasks()

}

// ======================
// TASK TOGGLE
// ======================

function toggleTask(type,index){

taskState[type][index]=!taskState[type][index]

saveTasks()
renderTasks(type)

}

// ======================
// BP COUNT
// ======================

function updateBP(){

let total=0

Object.keys(tasks).forEach(type=>{

tasks[type].forEach((task,i)=>{

if(taskState[type][i]){
total+= (isVip ? task.bp*2 : task.bp) * (isX2 ? 2 : 1)
}

})

})

const el=document.getElementById("bp-total")
if(el) el.innerText=total

const bar = document.getElementById("bp-fill")

if(bar){

let maxBP = 118

if(isVip) maxBP*=2
if(isX2) maxBP*=2

let percent = (total/maxBP)*100
if(percent>100) percent=100

bar.style.width = percent + "%"

}

}

// ======================
// VIP / X2
// ======================

function toggleVip(){
isVip=document.getElementById("vip-switch").checked
saveTasks()
renderTasks(currentTab)
}

function toggleX2(){
isX2=document.getElementById("x2-switch").checked
saveTasks()
renderTasks(currentTab)
}

// ======================
// TIMER SYSTEM
// ======================

function renderTimers(){

const container=document.getElementById("timers-container")
if(!container) return

container.innerHTML=""

// сортировка активных вверх
timers.sort((a,b)=> (b.active===true) - (a.active===true))

timers.forEach((timer,index)=>{

const div=document.createElement("div")
div.className="timer-card"

if(timer.active){
div.classList.add("active")
}

div.innerHTML=`

<div class="timer-name">${timer.name}</div>

<div class="timer-time" id="time-${index}">
${formatTime(timer.remaining)}
</div>

<div class="timer-controls">

<button class="timer-btn start 
${timer.running ? 'running' : ''} 
${timer.paused ? 'paused' : ''}" 
onclick="toggleTimer(${index})">

<span class="play">▶</span>
<span class="pause">⏸</span>

</button>

<button class="timer-btn reset" onclick="resetTimer(${index})">↺</button>
<button class="timer-btn delete" onclick="deleteTimer(${index})">✖</button>

</div>
`

container.appendChild(div)

})

updateTimerStats()

}

function startTimer(index){

const timer=timers[index]

if(timer.active) return

timer.active=true

renderTimers()

if(window.pywebview){
window.pywebview.api.start_overlay(timer.name,timer.remaining)
}

timer.interval=setInterval(()=>{

if(timer.remaining<=0){

clearInterval(timer.interval)
timer.active=false

alert("Таймер завершён: "+timer.name)

renderTimers()
updateTimerStats()
return

}

timer.remaining--

const el=document.getElementById("time-"+index)
if(el) el.innerText=formatTime(timer.remaining)

saveTimers()

},1000)

updateTimerStats()

}

function resetTimer(index){

const timer=timers[index]

clearInterval(timer.interval)

timer.remaining=timer.duration
timer.active=false

saveTimers()
renderTimers()

}

function deleteTimer(index){

clearInterval(timers[index].interval)

timers.splice(index,1)

saveTimers()
renderTimers()

}

// ======================
// TIMER STATS
// ======================

function updateTimerStats(){

document.getElementById("timer-total").innerText=timers.length

const active=timers.filter(t=>t.active).length
const done=timers.filter(t=>t.remaining===0).length

document.getElementById("timer-active").innerText=active
document.getElementById("timer-done").innerText=done

}

// ======================
// FORMAT TIME
// ======================

function formatTime(sec){

const h=Math.floor(sec/3600)
const m=Math.floor((sec%3600)/60)
const s=sec%60

return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`

}

// ======================
// SAVE / LOAD
// ======================

function saveTasks(){
localStorage.setItem("tasks",JSON.stringify({
tasks:taskState,
vip:isVip,
x2:isX2,
tab:currentTab
}))
}

function loadTasks(){

const data=localStorage.getItem("tasks")
if(!data) return

const obj=JSON.parse(data)

taskState=obj.tasks
isVip=obj.vip
isX2=obj.x2 || false
currentTab=obj.tab

}

function saveTimers(){
localStorage.setItem("timers",JSON.stringify(timers))
}

function loadTimers(){

const data = localStorage.getItem("timers")
if(!data) return

timers = JSON.parse(data)

}

// ======================
// START
// ======================

function startApp(){

loadTasks()
loadTimers()

renderTasks(currentTab)
renderTimers()

}

window.addEventListener("DOMContentLoaded", startApp)
window.addEventListener("pywebviewready", startApp)

// ======================
// HUD UPDATE
// ======================

function sendTimersToHUD(){

let active = timers
.filter(t => t.active)
.map(t => {
return {
name: t.name,
time: formatTime(t.remaining)
}
})

if(window.pywebview){
window.pywebview.api.update_overlay(active)
}

}

setInterval(()=>{

sendTimersToHUD()

},1000)

// ======================
// UI NAVIGATION
// ======================

function switchSection(id, btn=null){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active")
sec.style.display="none"
})

const target = document.getElementById(id)

if(target){
target.classList.add("active")
target.style.display="block"
}

document.querySelectorAll(".nav-btn").forEach(b=>{
b.classList.remove("active")
})

if(btn){
btn.classList.add("active")
}

}

window.addEventListener("DOMContentLoaded", () => {
switchSection("home");
})

// ======================
// PYTHON → JS TIMER ADD
// ======================

function addTimerFromPython(name, seconds){

seconds = parseInt(seconds)

if(isNaN(seconds)){
seconds = 0
}

timers.push({
name: name,
duration: seconds,
remaining: seconds,
running: false,
paused: false
})

saveTimers()
renderTimers()

}

// ======================
// RESET TASKS
// ======================

function resetTasks(){

if(!confirm("Сбросить все задания?")){
return
}

taskState = {
solo: [],
pair: [],
faction: []
}

saveTasks()

renderTasks(currentTab)
updateBP()

}

// ======================
// RESET MODAL
// ======================

function openResetModal(){
document.getElementById("reset-modal").style.display="flex"
}

function closeResetModal(){
document.getElementById("reset-modal").style.display="none"
}

function confirmReset(){

taskState={
solo:[],
pair:[],
faction:[]
}

saveTasks()
renderTasks(currentTab)
updateBP()

closeResetModal()

}

// таймер для bp 

function updateResetTimer(){

const el = document.getElementById("reset-timer")
if(!el) return

const now = new Date()
const reset = new Date()

reset.setHours(7,0,0,0)

if(now > reset){
reset.setDate(reset.getDate()+1)
}

const diff = Math.floor((reset - now)/1000)

el.innerText = formatTime(diff)

}

updateResetTimer()
setInterval(updateResetTimer,1000)

// fuction togle timer 

function toggleTimer(index){

const timer = timers[index]

if(timer.running){

// ставим на паузу
clearInterval(timer.interval)

timer.running = false
timer.paused = true

}else{

timer.running = true
timer.paused = false

timer.interval = setInterval(()=>{

if(timer.remaining<=0){

clearInterval(timer.interval)

timer.running=false
timer.paused=false

alert("Таймер завершён: "+timer.name)

renderTimers()
updateTimerStats()
return

}

timer.remaining--

const el=document.getElementById("time-"+index)
if(el) el.innerText=formatTime(timer.remaining)

saveTimers()

},1000)

}

renderTimers()

}