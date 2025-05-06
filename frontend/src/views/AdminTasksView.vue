<template>
  <div class="bg-gray-900 min-h-screen text-gray-100">
    <!-- 页面标题 -->
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">任务管理</h2>
        <div class="flex space-x-3">
          <router-link 
            :to="{ name: 'admin-create-task' }" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i class="fa fa-plus mr-2"></i>创建任务
          </router-link>
          <button 
            @click="confirmDeleteSelectedTasks" 
            :disabled="!selectedTaskIds.length"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i class="fa fa-trash mr-2"></i>删除选中任务
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-gray-800 p-4 rounded-lg mx-6 mb-6 shadow-lg">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-400 mb-1">搜索</label>
          <div class="relative">
            <input 
              v-model="searchQuery" 
              @keyup.enter="fetchTasks" 
              type="text" 
              placeholder="任务标题/描述" 
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button 
              @click="fetchTasks" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>
        
        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-400 mb-1">状态</label>
          <select 
            v-model="statusFilter" 
            @change="fetchTasks" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="pending">待处理</option>
            <option value="inProgress">进行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="fetchTasks" 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <i class="fa fa-refresh mr-2"></i>刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="bg-gray-800 p-6 rounded-lg mx-6 mb-6 shadow-lg overflow-x-auto">
      <!-- 关键修复：添加 Array.isArray(tasks) 检查 -->
      <table v-if="Array.isArray(tasks) && tasks.length > 0" class="min-w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              <input 
                type="checkbox" 
                @change="toggleSelectAll"
                :checked="areAllTasksSelected"
              >
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">任务标题</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">描述</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">分类</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">截止日期</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-700/50 transition-colors">
            <td class="px-4 py-3 whitespace-nowrap">
              <input 
                type="checkbox" 
                v-model="selectedTaskIds"
                :value="task.id"
              >
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-300">#{{ task.id }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm font-medium text-white">{{ task.title }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{{ task.description }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-private_cloud-bg/20 text-private_cloud-text': task.category === 'privateCloud',
                  'bg-public_cloud-bg/20 text-public_cloud-text': task.category === 'publicCloud',
                  'bg-container_cloud-bg/20 text-container_cloud-text': task.category === 'containerCloud'
                }"
              >
                {{ task.category }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{{ formatDate(task.dueDate) }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-gray-100 text-gray-800': task.status === 'pending',
                  'bg-blue-100 text-blue-800': task.status === 'inProgress',
                  'bg-green-100 text-green-800': task.status === 'completed',
                  'bg-red-100 text-red-800': task.status === 'cancelled'
                }"
              >
                {{ task.status }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
              <router-link 
                :to="{ name: 'admin-edit-task', params: { id: task.id } }" 
                class="text-blue-400 hover:text-blue-600 mr-3 transition-colors"
              >
                <i class="fa fa-edit"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 空状态提示 -->
      <div v-else class="p-6 text-gray-400 text-center">
        <div v-if="loading" class="flex items-center justify-center">
          <i class="fa fa-spinner fa-spin mr-2"></i>加载中...
        </div>
        <div v-else>暂无任务数据，请尝试刷新或创建新任务</div>
      </div>
    </div>
    
    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
        <h3 class="text-lg font-semibold text-white mb-4">确认删除</h3>
        <p class="text-gray-300 mb-6">你确定要删除选中的任务吗？此操作不可撤销。</p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            @click="deleteSelectedTasks" 
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAdminStore } from '@/store/modules/admin';
import { useRouter } from 'vue-router';

const adminStore = useAdminStore();
const router = useRouter();

// 状态管理（保持初始化为空数组）
const tasks = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');
const loading = ref(false);
const showDeleteModal = ref(false);
const selectedTaskIds = ref([]);

// 生命周期钩子
onMounted(() => {
  fetchTasks();
});

// 获取任务列表（确保数据类型安全）
const fetchTasks = async () => {
  loading.value = true;
  
  try {
    const params = {
      keyword: searchQuery.value,
      status: statusFilter.value
    };
    
    const response = await adminStore.fetchTasks(params);
    // 关键修复：确保 response 是数组，否则赋值为空数组
    tasks.value = Array.isArray(response) ? response : [];
    selectedTaskIds.value = []; // 清空选中的任务 ID
  } catch (error) {
    console.error('获取任务列表失败:', error);
    alert('获取任务列表失败，请重试');
    tasks.value = []; // 错误时重置为空数组
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString();
};

// 确认删除选中的任务
const confirmDeleteSelectedTasks = () => {
  if (selectedTaskIds.value.length > 0) {
    showDeleteModal.value = true;
  }
};

// 删除选中的任务
const deleteSelectedTasks = async () => {
  try {
    for (const taskId of selectedTaskIds.value) {
      await adminStore.deleteTask(taskId);
    }
    showDeleteModal.value = false;
    fetchTasks();
    alert('选中的任务删除成功');
  } catch (error) {
    console.error('删除任务失败:', error);
    alert('删除任务失败，请重试');
  }
};

// 全选/全不选
const toggleSelectAll = () => {
  if (areAllTasksSelected.value) {
    selectedTaskIds.value = [];
  } else {
    // 确保 tasks 是数组
    if (Array.isArray(tasks.value)) {
      selectedTaskIds.value = tasks.value.map(task => task.id);
    }
  }
};

// 计算是否全选（保持安全检查）
const areAllTasksSelected = computed(() => {
  return Array.isArray(tasks.value) && 
         tasks.value.length > 0 && 
         selectedTaskIds.value.length === tasks.value.length;
});
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
