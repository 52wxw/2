import { defineStore } from 'pinia';
import axios from 'axios';
import request from '@/utils/api'; // 引入 request

// 获取存储的 JWT 令牌
const getToken = () => localStorage.getItem('token');

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    tasks: [],
    submissions: [],
    loading: false,
    error: null
  }),

  getters: {
    // 获取所有用户
    allUsers: (state) => state.users,

    // 获取所有任务
    allTasks: (state) => state.tasks,

    // 获取所有提交记录
    allSubmissions: (state) => state.submissions
  },
  actions: {
    async getUsers(params) {
      try {
        this.loading = true;
        this.error = null;
        const token = getToken();
        const response = await axios.get('/api/admin/alluser', {
          headers: { Authorization: `Bearer ${token}` },
          params
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // 删除用户
    async deleteUser(userId) {
      try {
        await request.delete(`/admin/users/${userId}`);
      } catch (error) {
        console.error('删除用户失败:', error);
        throw error;
      }
    },
    /**
     * 添加用户
     * @param {Object} userData 用户数据
     * @returns {Promise<void>}
     */
    async addUser(userData) {
    try {
        this.loading = true;
        this.error = null;
        // 确保正确获取 token
        const token = getToken();
	console.log('获取到的令牌:', token);
        if (!token) {
            throw new Error('未找到有效的令牌');
        }
        const response = await axios.post('/api/admin/users', userData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        this.users.push(response.data);
        return response.data;
    } catch (error) {
        this.error = error.response?.data?.message || '添加用户失败';
        throw error;
    } finally {
        this.loading = false;
    }
    },
    // 获取统计信息
    async getStatistics() {
      try {
        const response = await request.get('/admin/statistics');
        return response.data;
      } catch (error) {
        console.error('获取统计信息失败:', error);
        throw error;
      }
    },
    // 获取用户列表
    async fetchUsers() {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get('/api/admin/user');
        this.users = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 创建新任务
    async createTask(taskData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.post('/api/admin/tasks', taskData);
        this.tasks.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新任务
    async updateTask(taskId, taskData) {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.put(`/api/admin/tasks/${taskId}`, taskData);
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
          this.tasks[taskIndex] = response.data;
        }

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除任务
    async deleteTask(taskId) {
      try {
        const token = getToken();

        const response = await axios.delete(`/api/admin/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // 添加 JWT 令牌到请求头
          }
        });
	return response.data;      
      } catch (error) {
	console.error('删除任务失败:', error);
        throw error;
      }
    },

    // 获取所有任务
    async fetchTasks() {
  try {
    this.loading = true;
    this.error = null;
    const token = getToken();
    const response = await axios.get('/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.tasks = response.data;
    return response.data;
  } catch (error) {
    this.error = error.response?.data?.message || 'Failed to fetch tasks';
    throw error;
  } finally {
    this.loading = false;
  }
},
    // 获取所有提交记录
    async fetchSubmissions() {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get('/api/admin/submissions');
        this.submissions = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(userId) {
      try {
        const token = getToken();
        const response = await axios.delete(`/api/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}` // 添加 JWT 令牌到请求头
          }
        });
        return response.data;
      } catch (error) {
        console.error('删除用户失败:', error);
        throw error;
      }
    },

    // 获取用户总数
    async getTotalUsers() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get('/api/admin/users/count');
        return response.data.count;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取活跃用户数
    async getActiveUsers() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get('/api/admin/users/active/count');
        return response.data.count;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取任务总数
    async getTotalTasks() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get('/api/admin/tasks/count');
        return response.data.count;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取完成任务数
    async getCompletedTasks() {
      try {
        this.loading = true;
        this.error = null;
        const response = await axios.get('/api/admin/tasks/completed/count');
        return response.data.count;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清除错误
    clearError() {
      this.error = null;
    }
  }
});
