const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

class TodoAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Todo CRUD operations
  async getTodos(userId) {
    return this.request(`/api/todos?userId=${userId}`);
  }

  async createTodo(todoData) {
    return this.request('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todoData),
    });
  }

  async updateTodo(todoId, updates) {
    return this.request(`/api/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTodo(todoId) {
    return this.request(`/api/todos/${todoId}`, {
      method: 'DELETE',
    });
  }

  async toggleTodoComplete(todoId, completed) {
    return this.request(`/api/todos/${todoId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  }
}

export const todoAPI = new TodoAPI();