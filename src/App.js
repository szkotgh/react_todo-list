import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [tag, setTag] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (!input.trim()) return;

    const now = new Date().toLocaleString();
    const newTodo = {
      id: Date.now(),
      text: input,
      tag,
      time: now,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setTag('');
  };

  const handleDelete = (id) => {
    window.confirm('Are you sure you want to delete this todo?') && setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEdit = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setInput(todo.text);
    setTag(todo.tag);
    setEditingId(id);
  };

  const handleUpdate = () => {
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: input, tag } : todo
    ));
    setInput('');
    setTag('');
    setEditingId(null);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4 text-left">Todo List</h1>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Job name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input
            className="w-32 border rounded p-2"
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          {editingId ? (
            <button onClick={handleUpdate} className="bg-yellow-400 px-4 rounded text-white">
              Config
            </button>
          ) : (
            <button onClick={handleAdd} className="bg-blue-500 px-4 rounded text-white">
              Add
            </button>
          )}
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-gray-400 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded text-sm ${filter === 'completed' ? 'bg-green-400 text-white' : 'bg-green-200'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-3 py-1 rounded text-sm ${filter === 'incomplete' ? 'bg-red-400 text-white' : 'bg-red-200'}`}
          >
            Incomplete
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="bg-gray-50 p-3 rounded shadow flex justify-between items-start">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="mt-1"
                />
                <div>
                  <p className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.text}
                  </p>
                  <p className="text-sm text-gray-500">
                    Time: {todo.time} {todo.tag && <>| Tag: {todo.tag}</>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(todo.id)} className="text-sm text-yellow-600 hover:underline">Config</button>
                <button onClick={() => handleDelete(todo.id)} className="text-sm text-red-600 hover:underline">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
