<template>
  <div class="bg-gray-900 min-h-screen text-gray-100">
    <!-- 页面标题 -->
    <div class="p-6">
      <h2 class="text-2xl font-bold">创建用户</h2>
    </div>

    <!-- 创建用户表单 -->
    <div class="bg-gray-800 p-4 rounded-lg mx-6 mb-6 shadow-lg">
      <form @submit.prevent="createNewUser">
        <!-- 用户名 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">用户名</label>
          <input 
            v-model="newUser.username" 
            type="text" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <!-- 邮箱 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">邮箱</label>
          <input 
            v-model="newUser.email" 
            type="email" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <!-- 密码 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">密码</label>
          <input 
            v-model="newUser.password" 
            type="password" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
        </div>

        <!-- 角色 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-400 mb-1">角色</label>
          <select 
            v-model="newUser.role" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ROLE_USER">普通用户</option>
            <option value="ROLE_ADMIN">管理员</option>
          </select>
        </div>

        <!-- 创建按钮 -->
        <div>
          <button 
            type="submit" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            创建用户
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

// 新用户信息
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'ROLE_USER'
});

// 创建用户方法
const createNewUser = async () => {
  try {
    await adminStore.createUser(newUser.value);
    alert('用户创建成功');
    router.push({ name: 'AdminCreateUserView' });
  } catch (error) {
    console.error('创建用户失败:', error);
    alert('创建用户失败，请重试');
  }
};
</script>

<style scoped>
/* 自定义样式（如果需要） */
</style>
