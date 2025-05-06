<template>
  <div class="bg-gray-900 min-h-screen text-gray-100">
    <!-- 页面标题 -->
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">创建用户</h2>
        <router-link :to="{ name: 'AdminUsersView' }" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
          <i class="fa fa-arrow-left mr-2"></i>返回用户列表
        </router-link>
      </div>
    </div>

    <!-- 创建用户表单 -->
    <div class="bg-gray-800 p-6 rounded-lg mx-6 mb-6 shadow-lg">
      <form @submit.prevent="createNewUser">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-400 mb-1">用户名</label>
          <input
            type="text"
            id="username"
            v-model="newUser.username"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入用户名"
            required
          >
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-400 mb-1">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="newUser.email"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入邮箱"
            required
          >
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-400 mb-1">密码</label>
          <input
            type="password"
            id="password"
            v-model="newUser.password"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入密码"
            required
          >
        </div>
        <div class="mb-4">
          <label for="role" class="block text-sm font-medium text-gray-400 mb-1">角色</label>
          <select
            id="role"
            v-model="newUser.role"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ROLE_USER">普通用户</option>
            <option value="ROLE_ADMIN">管理员</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="status" class="block text-sm font-medium text-gray-400 mb-1">状态</label>
          <select
            id="status"
            v-model="newUser.status"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="enabled">已启用</option>
            <option value="disabled">已禁用</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i class="fa fa-plus mr-2"></i>创建用户
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminStore } from '@/store/modules/admin';
import { useRouter } from 'vue-router';

const adminStore = useAdminStore();
const router = useRouter();

// 新用户数据
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'ROLE_USER',
  status: 'enabled'
});

// 创建用户方法
const createNewUser = async () => {
  try {
    // 调用 API 创建用户
    await adminStore.addUser(newUser.value);

    // 显示成功消息
    alert('用户创建成功');

    // 跳转到用户列表页面
    router.push({ name: 'AdminUsersView' });
  } catch (error) {
    console.error('创建用户失败:', error);
    alert('创建用户失败，请重试');
  }
};
</script>

<style scoped>
/* 自定义样式（如果需要） */
</style>
