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