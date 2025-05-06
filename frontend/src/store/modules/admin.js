import { defineStore } from 'pinia';
import axios from 'axios';

// 获取存储的 JWT 令牌
const getToken = () => localStorage.getItem('token');

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],          // 用户列表
    tasks: [],          // 任务列表
    submissions: [],    // 提交记录列表
    loading: false,     // 加载状态
    error: null         // 错误信息
  }),

  getters: {
    // 获取所有用户（只读）
    allUsers: (state) => state.users,
    // 获取所有任务（只读）
    allTasks: (state) => state.tasks,
    // 获取所有提交记录（只读）
    allSubmissions: (state) => state.submissions
  },

  actions: {
    // ------------------------------ 用户管理 ------------------------------
    /**
     * 获取用户列表
     * @returns {Promise<void>}
     */
    async fetchUsers() {
      try {
        this.loading = true;
        this.error = null;
        const token = getToken();
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.users = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 删除用户
     * @param {number} userId - 用户 ID
     * @returns {Promise<void>}
     */
    async deleteUser(userId) {
      try {
        this.loading = true;
        const token = getToken();
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 从本地列表移除已删除用户
        this.users = this.users.filter(user => user.id !== userId);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------ 任务管理 ------------------------------
    /**
     * 获取任务列表
     * @returns {Promise<void>}
     */
    async fetchTasks() {
      try {
        this.loading = true;
        this.error = null;
        const token = getToken();
        const response = await axios.get('/api/admin/tasks', {
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

    /**
     * 创建新任务
     * @param {object} taskData - 任务数据
     * @returns {Promise<object>} 新创建的任务
     */
    async createTask(taskData) {
      try {
        this.loading = true;
        this.error = null;
        const token = getToken();
        const response = await axios.post('/api/admin/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.tasks.push(response.data); // 添加到本地列表
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新任务
     * @param {number} taskId - 任务 ID
     * @param {object} taskData - 更新的任务数据
     * @returns {Promise<object>} 更新后的任务
     */
    async updateTask(taskId, taskData) {
      try {
        this.loading = true;
        this.error = null;
        const token = getToken();
        const response = await axios.put(`/api/admin/tasks/${taskId}`, taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 找到并更新本地任务
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) this.tasks[taskIndex] = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 删除任务
     * @param {number} taskId - 任务 ID
     * @returns {Promise<void>}
     */
    async deleteTask(taskId) {
      try {
        this.loading = true;
        const token = getToken();
        await axios.delete(`/api/admin/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 从本地列表移除已删除任务
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------ 统计数据 ------------------------------
    /**
     * 获取用户总数
     * @returns {Promise<number>} 用户总数
     */
    async getTotalUsers() {
      const token = getToken();
      const response = await axios.get('/api/admin/users/count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.count;
    },

    /**
     * 获取任务总数
     * @returns {Promise<number>} 任务总数
     */
    async getTotalTasks() {
      const token = getToken();
      const response = await axios.get('/api/admin/tasks/count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.count;
    },

    /**
     * 获取完成任务数
     * @returns {Promise<number>} 完成任务数
     */
    async getCompletedTasks() {
      const token = getToken();
      const response = await axios.get('/api/admin/tasks/completed/count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.count;
    },

    /**
     * 获取系统统计数据（包含用户、任务、服务器状态）
     * @returns {Promise<object>} 统计数据对象
     */
    async getStatistics() {
      try {
        this.loading = true;
        this.error = null;
        const token = getToken();
        
        // 并发获取多个统计数据
        const [totalUsers, totalTasks, completedTasks] = await Promise.all([
          this.getTotalUsers(),
          this.getTotalTasks(),
          this.getCompletedTasks()
        ]);

        // 服务器性能数据（假设后端提供对应 API）
        const [cpuResponse, memoryResponse] = await Promise.all([
          axios.get('/api/admin/system/cpu-usage', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/admin/system/memory-usage', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        return {
          totalUsers,
          totalTasks,
          completedTasks,
          cpuUsage: cpuResponse.data.usage,
          memoryUsage: memoryResponse.data.usage
        };

      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to get statistics';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ------------------------------ 通用方法 ------------------------------
    /**
     * 清除错误信息
     */
    clearError() {
      this.error = null;
    }
  }
});
