import { defineStore } from 'pinia';
import request from '@/utils/request'; // 引入配置好的请求实例

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,       // 存储用户信息（包含角色等权限数据）
    token: null,      // JWT 令牌
    loading: false,   // 加载状态
    error: null       // 错误信息
  }),

  getters: {
    // 是否认证通过（令牌存在且有效）
    isAuthenticated: (state) => !!state.token,
    // 是否为管理员（根据后端返回的角色字段判断）
    isAdmin: (state) => state.user?.role === 1,
    // 获取用户名（安全处理 null 情况）
    username: (state) => state.user?.username || ''
  },

  actions: {
    // 初始化用户状态（页面加载时调用，恢复登录状态）
    async init() {
      try {
        this.loading = true;
        this.error = null;
        // 从本地存储获取令牌
        const token = localStorage.getItem('token');
        if (!token) return; // 无令牌则直接返回

        // 设置令牌到状态
        this.token = token;
        // 获取用户信息（包含角色等权限数据）
        await this.fetchUser();
      } catch (error) {
        this.error = '登录状态失效，请重新登录';
        this.logout(); // 清除无效令牌
      } finally {
        this.loading = false;
      }
    },

    // 登录方法（核心：发送登录请求时不携带令牌）
    async login(credentials) {
      try {
        this.loading = true;
        this.error = null;
        // ✅ 直接调用 request.post，拦截器会处理令牌（登录请求不携带）
        const response = await request.post('/auth/login', credentials);
        
        // 存储令牌和用户信息（假设后端返回格式：{ token: 'xxx', user: { role: 1, username: 'admin' } }）
        this.token = response.token;
        this.user = response.user;
        // 持久化令牌到本地存储（用户信息每次通过 fetchUser 获取，避免存储敏感数据）
        localStorage.setItem('token', response.token);
        
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败，请检查账号密码';
        throw error; // 向上传递错误，触发前端提示
      } finally {
        this.loading = false;
      }
    },

    // 获取用户详情（用于验证权限和初始化用户信息）
    async fetchUser() {
      try {
        const response = await request.get('/users/me'); // 假设后端用户信息接口
        this.user = response; // 包含 role: 1（管理员）或 2（普通用户）
        return response;
      } catch (error) {
        this.error = '获取用户信息失败';
        this.logout(); // 清除可能无效的令牌
        throw error;
      }
    },

    // 登出方法（清除所有用户状态和本地存储）
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },

    // 清除错误信息（用于表单重置）
    clearError() {
      this.error = null;
    }
  },

  // 持久化配置（仅存储 token，用户信息每次通过接口获取）
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: localStorage,
        paths: ['token'] // 只持久化 token，保证安全性
      }
    ]
  }
});
