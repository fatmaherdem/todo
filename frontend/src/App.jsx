// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Temel stillendirme için

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Todoları Yükle
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/todos`);
        setTodos(response.data);
      } catch (err) {
        console.error("Todolar yüklenirken hata:", err);
        setError('Todolar yüklenirken bir hata oluştu. Backend sunucusunun çalıştığından emin olun.');
        if (err.response) {
            console.error("Hata Detayı:", err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Yeni Todo Ekle
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
        setError("Görev başlığı boş olamaz.");
        return;
    }
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/todos`, { title: newTodoTitle });
      setTodos([response.data, ...todos]); // Yeni todoyu başa ekle
      setNewTodoTitle('');
    } catch (err) {
      console.error("Todo eklerken hata:", err);
      setError(err.response?.data?.error || 'Todo eklenirken bir hata oluştu.');
    }
  };

  // Todo Tamamlandı Durumunu Değiştir
  const handleToggleComplete = async (todo) => {
    try {
      setError(null);
      const updatedTodoData = { completed: !todo.completed };
      const response = await axios.put(`${API_BASE_URL}/todos/${todo.id}`, updatedTodoData);
      setTodos(todos.map(t => (t.id === todo.id ? response.data : t)));
    } catch (err) {
      console.error("Todo güncellerken hata:", err);
      setError(err.response?.data?.error || 'Todo güncellenirken bir hata oluştu.');
    }
  };

  // Todo Sil
  const handleDeleteTodo = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error("Todo silerken hata:", err);
      setError(err.response?.data?.error || 'Todo silinirken bir hata oluştu.');
    }
  };

  if (loading) return <p className="loading-message">Yapılacaklar yükleniyor...</p>;

  return (
    <div className="App">
      <h1>Yapılacaklar Listesi</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Yeni bir görev ekle..."
        />
        <button type="submit">Ekle</button>
      </form>
      { !loading && todos.length === 0 && !error && <p>Henüz hiç görev eklenmemiş.</p> }
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleComplete(todo)}>
              {todo.title}
            </span>
            <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;