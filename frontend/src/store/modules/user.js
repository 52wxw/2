import { defineStore } from 'pinia';
import request from '@/utils/request';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,       // 存储用户信息
    token: null,      // JWT 令牌
    totalScore: 0,    // 用户总分
    loading: false,   // 加载状态
    error: null       // 错误信息
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    // ✅ 修正：使用 some() 方法检查角色数组，避免依赖固定索引
    isAdmin: (state) => state.user?.roles?.some(role => role.name === 'ROLE_ADMIN'),
    username: (state) => state.user?.username || '',
    formattedTotalScore: (state) => (state.totalScore || 0).toLocaleString()
  },

  actions: {
    // 初始化用户状态（修正方法名拼写错误：fetchUser() → fetchUserInfo()）
    async init() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        if (!token) return;

        this.token = token;
        await this.fetchUserInfo(); // ✅ 调用正确的方法名
      } catch (error) {
        this.error = '登录状态失效，请重新登录';
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    // 登录方法（已有逻辑正确，直接存储登录返回的 user 信息）
    async login(credentials) {
      try {
        this.loading = true;
        const response = await request.post('/auth/login', credentials);

        this.token = response.token;
        this.user = response.user; // 包含完整的 roles 数组
        this.totalScore = response.user.totalScore || 0;
        localStorage.setItem('token', response.token);

        return response;
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查账号密码';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取用户详情（保留该方法，用于初始化时加载用户信息）
    async fetchUserInfo() {
      try {
        const response = await request.get('/users/me');
        this.user = response; // 直接使用响应数据（假设后端返回格式与登录一致）
        this.totalScore = response.totalScore || 0;
        console.log('[User Store] 用户信息加载成功:', this.user);
        return response;
      } catch (error) {
        this.error = '获取用户信息失败';
        this.logout();
        throw error;
      }
    },

    // 登出方法（已有逻辑正确）
    logout() {
      this.user = null;
      this.token = null;
      this.totalScore = 0;
      localStorage.removeItem('token');
    },

    // 清除错误信息（已有逻辑正确）
    clearError() {
      this.error = null;
    }
  },

  // 持久化配置（已有逻辑正确）
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['token', 'totalScore']
      }
    ]
  }
});
