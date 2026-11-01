import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem('tasks')
  return savedTasks ? JSON.parse(savedTasks) : []
})
  const [taskInput, setTaskInput] = useState('')
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}, [tasks])

  function addTask() {
    if (taskInput.trim() === '') {
      alert('Please enter a task!')
      return
    }
    
   setTasks([...tasks, { text: taskInput, completed: false }])
    setTaskInput('')
  }
function deleteTask(index) {
  const updatedTasks = tasks.filter((task, i) => i !== index)
  setTasks(updatedTasks)
}

function completeTask(index) {
  const updatedTasks = tasks.map((task, i) =>
    i === index ? { ...task, completed: !task.completed } : task
  )
  setTasks(updatedTasks)
}
  return (
    <div className="container">
      <h1>TaskFlow</h1>
      <p>Manage your daily tasks easily.</p>

      <input
        type="text"
        placeholder="Enter your task"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
      />
<h2>Total Tasks: {tasks.length}</h2>
<h3>
  Completed Tasks: {tasks.filter(task => task.completed).length}
</h3>
<h3>
  Pending Tasks: {tasks.filter(task => !task.completed).length}
</h3>
      <button onClick={addTask}>Add Task</button>

      <h2>My Tasks</h2>

   {tasks.map((task, index) => (
  <p key={index}>
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => completeTask(index)}
    />

    <span
      style={{
        textDecoration: task.completed ? 'line-through' : 'none'
      }}
    >
      {task.text}
    </span>

    <button onClick={() => deleteTask(index)}>
      Delete
    </button>
  </p>
))}
        </div>
  )
}

export default App

