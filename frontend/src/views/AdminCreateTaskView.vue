<template>
  <div class="bg-gray-900 min-h-screen">
    <!-- 顶部导航栏 -->
    <header class="bg-gradient-to-r from-purple-700 to-blue-700 shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-crown text-yellow-400 text-xl"></i>
          <h1 class="text-white font-bold text-xl">创建任务</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="text-white hover:text-yellow-400 transition-colors">
            <i class="fa-solid fa-arrow-left mr-1"></i>
            <span>返回</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="p-6 bg-gray-900">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h2 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-white mb-2">
          新建任务
        </h2>
        <p class="text-gray-400">填写以下信息创建新任务。</p>
      </div>

      <!-- 任务创建表单 -->
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <form @submit.prevent="createTask">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-400 mb-1">
              任务标题
            </label>
            <input
              type="text"
              id="title"
              v-model="newTask.title"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入任务标题"
            >
          </div>

          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-400 mb-1">
              任务描述
            </label>
            <textarea
              id="description"
              v-model="newTask.description"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入任务描述"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-400 mb-1">
              分类
            </label>
            <select
              id="category"
              v-model="newTask.category"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="privateCloud">私有云</option>
              <option value="containerCloud">容器云</option>
              <option value="publicCloud">公有云</option>
            </select>
          </div>

          <!-- 新增：任务答案字段 -->
          <div class="mb-4">
            <label for="answer" class="block text-sm font-medium text-gray-400 mb-1">
              任务答案
            </label>
            <textarea
              id="answer"
              v-model="newTask.answer"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入任务答案（例如：flag{example}）"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="goBack"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              创建任务
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// 初始化新任务对象（新增 answer 字段，移除 dueDate）
const newTask = ref({
  title: '',
  description: '',
  category: 'privateCloud',
  answer: '' // 任务答案字段
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 创建任务
const createTask = async () => {
  try {
    // 发送POST请求到后端创建任务（包含新增的 answer 字段）
    const response = await axios.post('/api/admin/tasks', newTask.value);
    console.log('任务创建成功:', response.data);

    // 显示成功通知
    window.$notify.success('任务创建成功', '任务已成功创建');

    // 导航回任务列表页面
    router.push('/admin/tasks');
  } catch (error) {
    console.error('创建任务失败:', error);
    // 显示错误通知
    window.$notify.error('操作失败', '创建任务时发生错误，请重试');
  }
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
