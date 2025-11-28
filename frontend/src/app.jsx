import { useState, useEffect } from "preact/hooks";

export function App() {
  const API = "https://pro1todo-1.onrender.com";

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(`${API}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(console.error);
  }, []);

  const handleAdd = async () => {
    if (!task.trim()) return;

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

    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task, completed: false })
    });

    const data = await res.json();
    setTodos([...todos, data]);
    setTask("");
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t._id !== id));
  };

  const handleComplete = async (id, completed) => {
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });

    const data = await res.json();
    setTodos(todos.map(t => (t._id === id ? data : t)));
  };

  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setTask(todo.text);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-10">
      <h1 className="text-center font-bold text-3xl md:text-4xl text-gray-800 mb-6 tracking-wide">
        To-Do App
      </h1>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto flex gap-3 p-4 bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200 transition-all">
        <input
          type="text"
          value={task}
          placeholder="Enter a task…"
          onInput={(e) => setTask(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:outline-none shadow-sm"
        />

        <button
          onClick={handleAdd}
          className="px-5 py-3 bg-blue-600 rounded-xl text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Todo List */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex justify-between items-center p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            <span
              className={`text-lg ${
                todo.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              } transition-all`}
            >
              {todo.text}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => handleComplete(todo._id, todo.completed)}
                className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm shadow hover:bg-green-600 active:scale-95 transition"
              >
                {todo.completed ? "Undo" : "Done"}
              </button>

              <button
                onClick={() => handleEdit(todo)}
                className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm shadow hover:bg-blue-600 active:scale-95 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(todo._id)}
                className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm shadow hover:bg-red-600 active:scale-95 transition"
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
