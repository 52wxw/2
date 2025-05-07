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

          <!-- 任务分数字段 -->
          <div class="mb-4">
            <label for="points" class="block text-sm font-medium text-gray-400 mb-1">
              任务分数
            </label>
            <input
              type="number"
              id="points"
              v-model.number="newTask.points"
              min="1"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入任务分数"
            >
          </div>

          <!-- 任务答案字段 -->
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
import service from '@/utils/api'; // 引入配置好的 service 实例
import { useUserStore } from '@/store/modules/user';

const router = useRouter();

// 初始化新任务对象（移除 level、status、active 和 dueDate）
const newTask = ref({
  title: '',
  description: '',
  category: 'privateCloud',
  points: 10,           // 保留 points 字段
  answer: ''
});

// 返回上一页
const goBack = () => {
  router.back();
};

// 创建任务
const createTask = async () => {
  // 验证必填字段
  if (!newTask.value.title || !newTask.value.description || !newTask.value.answer) {
    window.$notify.error('请填写所有必填字段');
    return;
  }

  // 验证数字类型
  if (isNaN(newTask.value.points) || newTask.value.points <= 0) {
    window.$notify.error('请输入有效的任务分数');
    return;
  }

  // 发送请求
  try {
    const userStore = useUserStore();
    console.log('当前令牌:', userStore.token);
    const response = await service.post('/admin/tasks', newTask.value);
    console.log('响应状态码:', response.status);
    console.log('响应数据:', response.data);
    if (response.status >= 200 && response.status < 300) {
    // 成功处理
  } else {
  }
} catch (error) {
}
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>    
