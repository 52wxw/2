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
              @keyup.enter="refreshTasks"
              type="text"
              placeholder="任务标题/描述"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button
              @click="refreshTasks"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>

        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-400 mb-1">分类</label>
          <select
            v-model="categoryFilter"
            @change="refreshTasks"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="privateCloud">私有云</option>
            <option value="publicCloud">公有云</option>
            <option value="containerCloud">容器云</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="refreshTasks"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <i class="fa fa-refresh mr-2"></i>刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="bg-gray-800 p-6 rounded-lg mx-6 mb-6 shadow-lg overflow-x-auto">
      <table v-if="Array.isArray(filteredTasks) && filteredTasks.length > 0" class="min-w-full">
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
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-700/50 transition-colors">
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
                :class="getCategoryClass(task.category)"
              >
                {{ getCategoryText(task.category) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{{ formatDate(task.dueDate) }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
              <!-- 操作列（如有需要添加编辑/删除按钮） -->
            </td>
          </tr>
        </tbody>
      </table>
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

// 状态管理
const allTasks = ref([]); // 存储所有任务（从后端获取）
const searchQuery = ref('');
const categoryFilter = ref(''); 
const loading = ref(false);
const showDeleteModal = ref(false);
const selectedTaskIds = ref([]);

// 生命周期钩子：加载所有任务
onMounted(() => {
  loadAllTasks();
});

// 获取所有任务（不传递任何参数）
const loadAllTasks = async () => {
  loading.value = true;
  try {
    const params = {
      keyword: searchQuery.value,
      category: categoryFilter.value // 使用分类筛选
    };
    const response = await adminStore.fetchTasks(params); // 假设后端有获取所有任务的接口
    allTasks.value = Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('加载任务失败:', error);
    alert('加载任务失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 刷新任务列表（触发过滤）
const refreshTasks = () => {
  // 无需调用后端，依赖计算属性自动更新
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

// 删除选中的任务（需同步到后端）
const deleteSelectedTasks = async () => {
  try {
    for (const taskId of selectedTaskIds.value) {
      await adminStore.deleteTask(taskId);
      // 从 allTasks 中移除已删除的任务（前端即时更新）
      allTasks.value = allTasks.value.filter(task => task.id !== taskId);
    }
    showDeleteModal.value = false;
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
    selectedTaskIds.value = filteredTasks.value.map(task => task.id);
  }
};

// 计算是否全选
const areAllTasksSelected = computed(() => {
  return filteredTasks.value.length > 0 && 
         selectedTaskIds.value.length === filteredTasks.value.length;
});

// 分类样式映射
const getCategoryClass = (category) => {
  switch (category) {
    case 'privateCloud': return 'bg-purple-100 text-purple-800';
    case 'publicCloud': return 'bg-blue-100 text-blue-800';
    case 'containerCloud': return 'bg-green-100 text-green-800';
    default: return '';
  }
};

// 分类名称映射
const CATEGORY_MAP = {
  privateCloud: '私有云',
  publicCloud: '公有云',
  containerCloud: '容器云'
};

// 获取分类中文名称
const getCategoryText = (category) => CATEGORY_MAP[category] || category;

// 计算属性：前端过滤（搜索+分类）
const filteredTasks = computed(() => {
  return allTasks.value.filter(task => {
    // 搜索过滤：标题或描述包含搜索词（不区分大小写）
    const searchMatch = task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // 分类过滤：选择“全部”或分类匹配
    const categoryMatch = categoryFilter.value === '' || task.category === categoryFilter.value;
    
    return searchMatch && categoryMatch;
  });
});
</script>

<style scoped>
/* 可添加自定义样式 */
</style>
