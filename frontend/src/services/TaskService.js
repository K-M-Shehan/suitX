const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Get all tasks
export async function getAllTasks() {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

// Get tasks by project ID
export async function getTasksByProject(projectId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks for project');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    throw error;
  }
}

// Get tasks by assignee (user ID)
export async function getTasksByAssignee(userId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/assignee/${userId}`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks for user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    throw error;
  }
}

// Get task by ID
export async function getTaskById(id) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch task with id: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
}

// Create a single task
export async function createTask(taskData) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// Create multiple tasks for a project
export async function createMultipleTasks(tasks, projectId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/bulk?projectId=${projectId}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(tasks),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating tasks:', error);
    throw error;
  }
}

// Update a task
export async function updateTask(id, taskData) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const error = new Error(`Failed to update task with id: ${id}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

// Delete a task
export async function deleteTask(id) {
  try {
    const token = getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete task with id: ${id}`);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}
