import { useState, useEffect } from "preact/hooks";

export function App() {
  const API = "https://pro1todo-1.onrender.com"; // Your backend URL

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all todos
  useEffect(() => {
    fetch(`${API}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.log(err));
  }, []);

  // Add or Update Todo
  const handleAdd = async () => {
    if (!task.trim()) return;

    // Update existing todo
    if (editingId) {
      const res = await fetch(`${API}/todos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task })
      });

      const data = await res.json();
      setTodos(todos.map(t => (t._id === editingId ? data : t)));
      setEditingId(null);
      setTask("");
      return;
    }

    // Add new todo
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task, completed: false })
    });

    const data = await res.json();
    setTodos([...todos, data]);
    setTask("");
  };

  // Delete todo
  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t._id !== id));
  };

  // Toggle complete
  const handleComplete = async (id, completed) => {
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });

    const data = await res.json();
    setTodos(todos.map(t => (t._id === id ? data : t)));
  };

  // Load todo into input
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setTask(todo.text);
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl bg-blue-100">To Do App</h1>

      <div className="flex gap-2 py-10 px-70">
        <input
          type="text"
          value={task}
          placeholder="Enter Your Task"
          onInput={(e) => setTask(e.target.value)}
          className="flex-1 px-3 py-2 border border-red-400 rounded-2xl 
                     focus:outline-none focus:ring-blue-500 focus:ring-2"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-amber-500 rounded-2xl text-white hover:bg-blue-400"
        >
          {editingId ? "Update" : "Add Task"}
        </button>
      </div>

      <div className="px-10">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex justify-between items-center mb-3 p-3 bg-gray-100 rounded-lg"
          >
            <span className={`${todo.completed ? "line-through text-gray-400" : ""}`}>
              {todo.text}
            </span>

            <div className="flex gap-3">
              <button
                onClick={() => handleComplete(todo._id, todo.completed)}
                className="px-2 py-1 bg-green-500 text-white rounded-md"
              >
                {todo.completed ? "Undo" : "Done"}
              </button>

              <button
                onClick={() => handleEdit(todo)}
                className="px-2 py-1 bg-blue-500 text-white rounded-md"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(todo._id)}
                className="px-2 py-1 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
