import axios from 'axios';
import { useUserStore } from '../store/modules/user';

const service = axios.create({
  baseURL: '/api', // 与前端代理配置一致
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器：精准控制令牌添加（登录请求绝不携带令牌）
service.interceptors.request.use(config => {
  const userStore = useUserStore();
  const token = userStore.token;
  // ✅ 明确标识登录请求（根据实际接口路径调整）
  const isLoginRequest = config.url.includes('/auth/login');

  // ✅ 核心逻辑：非登录请求且有令牌时添加，否则移除令牌头
  if (token && !isLoginRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // 防御性清除：避免登录请求携带任何旧令牌
    delete config.headers.Authorization;
  }

  // 保留调试日志（生产环境可移除）
  console.log('[请求拦截器] URL:', config.url);
  console.log('[请求拦截器] 令牌状态:', token ? '存在（非登录请求）' : '不存在/登录请求');
  console.log('[请求拦截器] 最终请求头:', config.headers);

  return config;
});

// 响应拦截器：处理认证和权限错误（保持原有逻辑，新增 403 提示）
service.interceptors.response.use(
  (response) => {
    // 成功响应：直接返回数据（可根据后端规范添加业务码校验）
    return response.data;
  },
  (error) => {
    const { status, data } = error.response || {};
    const userStore = useUserStore();

    // 详细错误日志（生产环境可简化）
    console.error('[响应错误] 状态码:', status);
    console.error('[响应错误] 错误信息:', data?.message || error.message);
    console.error('[响应错误] 完整错误对象:', error);

    // 1. 未认证（令牌无效或未登录）
    if (status === 401) {
      userStore.logout(); // 清除无效令牌
      window.location.href = '/login'; // 强制跳转登录
    }
    // 2. 权限不足（明确提示用户）
    if (status === 403) {
      alert('无权限执行此操作！'); // 可替换为更友好的提示组件
    }

    return Promise.reject(error); // 将错误传递给调用方
  }
);

export default service;
