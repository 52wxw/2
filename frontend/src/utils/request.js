import axios from 'axios';
import { useUserStore } from '../store/modules/user';

const service = axios.create({
  baseURL: '/api', // 与前端代理配置一致
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器（已有逻辑正确，确保非登录请求携带令牌）
service.interceptors.request.use(config => {
  const userStore = useUserStore();
  const token = userStore.token;
  const isLoginRequest = config.url.includes('/auth/login');

  if (token && !isLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  // 调试日志（保留或移除均可，生产环境建议移除）
  console.log('[请求拦截器] URL:', config.url);
  console.log('[请求拦截器] 令牌状态:', token ? '存在（非登录请求）' : '不存在/登录请求');
  console.log('[请求拦截器] 最终请求头:', config.headers);

  return config;
});

// 响应拦截器（已有逻辑正确，处理 401/403 错误）
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { status } = error.response || {};
    const userStore = useUserStore();

    if (status === 401) {
      userStore.logout();
      window.location.href = '/login';
    }
    if (status === 403) {
      alert('无权限执行此操作！');
    }

    return Promise.reject(error);
  }
);

export default service;
