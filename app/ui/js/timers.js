function renderTimers(){

const container=document.getElementById("timers-container")
if(!container) return

container.innerHTML=""

timers.forEach((timer,index)=>{

const div=document.createElement("div")
div.className="timer-card"

div.innerHTML=`

<div class="timer-name">${timer.name}</div>

<div class="timer-time" id="time-${index}">
${formatTime(timer.remaining)}
</div>

<div class="timer-controls">

<button onclick="startTimer(${index})">▶</button>
<button onclick="resetTimer(${index})">↺</button>
<button onclick="deleteTimer(${index})">✖</button>

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

if(window.pywebview){
window.pywebview.api.start_overlay(timer.name,timer.remaining)
}

timer.interval=setInterval(()=>{

if(timer.remaining<=0){

clearInterval(timer.interval)
timer.active=false

alert("Таймер завершён: "+timer.name)

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

function updateTimerStats(){

document.getElementById("timer-total").innerText=timers.length

const active=timers.filter(t=>t.active).length
const done=timers.filter(t=>t.remaining===0).length

document.getElementById("timer-active").innerText=active
document.getElementById("timer-done").innerText=done

}

function formatTime(sec){

const h=Math.floor(sec/3600)
const m=Math.floor((sec%3600)/60)
const s=sec%60

return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`

}

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