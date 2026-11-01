
import { useEffect, useMemo, useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks')
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch {
      return []
    }
  })

  const [taskInput, setTaskInput] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()

    if (!taskInput.trim()) {
      alert('Please enter a task!')
      return
    }

    if (editingId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? { ...task, text: taskInput.trim() }
          : task
      ))
      setEditingId(null)
    } else {
      const newTask = {
        id: Date.now(),
        text: taskInput.trim(),
        completed: false,
        createdAt: new Date().toLocaleDateString()
      }

      setTasks([...tasks, newTask])
    }

    setTaskInput('')
  }

  function editTask(task) {
    setTaskInput(task.text)
    setEditingId(task.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setTaskInput('')
    setEditingId(null)
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))

    if (editingId === id) {
      cancelEdit()
    }
  }

  function completeTask(id) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  function clearCompleted() {
    setTasks(tasks.filter(task => !task.completed))
  }

  const completedCount = tasks.filter(task => task.completed).length
  const pendingCount = tasks.length - completedCount

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed)

      return matchesSearch && matchesFilter
    })
  }, [tasks, search, filter])

  return (
    <div className="container">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <p>Organize your day. Get things done.</p>
      </header>

      <section className="stats">
        <div className="stat-card total">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card completed">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>

        <div className="stat-card pending">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>
      </section>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="What do you need to do?"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />

        <button type="submit" className="add-btn">
          {editingId !== null ? 'Update Task' : 'Add Task'}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="cancel-btn"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <section className="task-section">
        <div className="section-heading">
          <h2>My Tasks</h2>

          {completedCount > 0 && (
            <button
              className="clear-btn"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>
          )}
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search your tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>

          <button
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>Add a new task or change your search/filter.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div className="task-card" key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => completeTask(task.id)}
                />

                <div className="task-details">
                  <span className={task.completed ? 'task-text done' : 'task-text'}>
                    {task.text}
                  </span>
                  <small>Created: {task.createdAt || 'Earlier'}</small>
                </div>

                <div className="task-actions">
                  <button
                    className="edit-btn"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <footer>
        <p>Made with React ❤️ | TaskFlow</p>
      </footer>
    </div>
  )
}

export default App
