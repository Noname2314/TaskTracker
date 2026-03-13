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