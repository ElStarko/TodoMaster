import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ username: "", password: "" });

  // Load user and todos on component mount
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(user);
      loadUserTodos(user);
    }
  }, []);

  const loadUserTodos = (username) => {
    const userTodos = localStorage.getItem(`todos_${username}`);
    if (userTodos) {
      setTodos(JSON.parse(userTodos));
    } else {
      setTodos([]);
    }
  };

  const saveUserTodos = (username, todosArray) => {
    localStorage.setItem(`todos_${username}`, JSON.stringify(todosArray));
  };

  const handleAuth = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (isLogin) {
      // Login
      const user = users.find(
        (u) =>
          u.username === authData.username && u.password === authData.password
      );
      if (user) {
        setCurrentUser(authData.username);
        localStorage.setItem("currentUser", authData.username);
        loadUserTodos(authData.username);
      } else {
        alert("Invalid credentials!");
      }
    } else {
      // Register
      const existingUser = users.find((u) => u.username === authData.username);
      if (existingUser) {
        alert("Username already exists!");
        return;
      }

      const newUser = {
        username: authData.username,
        password: authData.password,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setCurrentUser(authData.username);
      localStorage.setItem("currentUser", authData.username);
      setTodos([]);
      saveUserTodos(authData.username, []);

      setAuthData({
        username: "",
        password: "",
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTodos([]);
    localStorage.removeItem("currentUser");
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const updatedTodos = [
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      setTodos(updatedTodos);
      saveUserTodos(currentUser, updatedTodos);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveUserTodos(currentUser, updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveUserTodos(currentUser, updatedTodos);
  };

  const getCompletedCount = () => {
    return todos.filter((todo) => todo.completed).length;
  };

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="app-title">✨ TodoMaster</h1>
          <div className="auth-tabs">
            <button
              className={`tab ${isLogin ? "active" : ""}`}
              onClick={() => {
                setIsLogin(true);
                setAuthData({ username: "", password: "" });
              }}
            >
              Login
            </button>
            <button
              className={`tab ${!isLogin ? "active" : ""}`}
              onClick={() => {
                setIsLogin(false);
                setAuthData({ username: "", password: "" });
              }}
            >
              Register
            </button>
          </div>

          <div className="auth-form">
            <input
              type="text"
              placeholder="Username"
              value={authData.username}
              onChange={(e) =>
                setAuthData({ ...authData, username: e.target.value })
              }
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) =>
                setAuthData({ ...authData, password: e.target.value })
              }
              className="auth-input"
            />
            <button onClick={handleAuth} className="auth-button">
              {isLogin ? "Login" : "Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="todo-container">
        <header className="todo-header">
          <div className="header-content">
            <h1>Vibrant</h1>
            <div className="user-info">
              <span>Welcome, {currentUser}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-text">
              {getCompletedCount()} of {todos.length} tasks completed
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width:
                    todos.length > 0
                      ? `${(getCompletedCount() / todos.length) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        </header>

        <div className="add-todo-section">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            className="todo-input"
          />
          <button onClick={addTodo} className="add-button">
            <span className="plus-icon">+</span> Add Task
          </button>
        </div>

        <div className="todos-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No tasks yet!</h3>
              <p>Add a task above to get started.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="todo-stats">
            <div className="stat-item">
              <span className="stat-number">{todos.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getCompletedCount()}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {todos.length - getCompletedCount()}
              </span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
