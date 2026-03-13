function startApp(){

loadTasks()
loadTimers()

renderTasks(currentTab)
renderTimers()

}

// запуск для браузера
window.addEventListener("DOMContentLoaded", startApp)

// запуск для pywebview
window.addEventListener("pywebviewready", startApp)

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
active: false
})

saveTimers()
renderTimers()

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