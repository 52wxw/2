<template>
  <div class="bg-dark-bg min-h-screen pb-12">
    <!-- 页面标题 -->
    <div class="bg-sub-bg border-b border-gray-800 py-8 px-4">
      <div class="container mx-auto">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white">
          {{ $t('pages.taskList.title') }}
        </h1>
        <p class="text-gray-400 mt-2 max-w-2xl">
          {{ $t('pages.taskList.subtitle') }}
        </p>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="bg-dark-bg border-b border-gray-800 py-4 px-4">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- 分类筛选 -->
          <div class="relative">
            <select
              v-model="selectedCategory"
              class="bg-sub-bg border border-gray-700 text-white rounded-lg py-2 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="all">{{ $t('pages.taskList.allCategories') }}</option>
              <option value="private_cloud">{{ $t('pages.taskList.categories.private_cloud') }}</option>
              <option value="public_cloud">{{ $t('pages.taskList.categories.public_cloud') }}</option>
              <option value="container_cloud">{{ $t('pages.taskList.categories.container_cloud') }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i class="fa-solid fa-chevron-down text-gray-400"></i>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="bg-sub-bg border border-gray-700 text-white rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="{{ $t('pages.taskList.searchPlaceholder') }}"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="container mx-auto px-4 mt-8">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredTasks.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
          <i class="fa-solid fa-puzzle-piece text-primary text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">
          {{ $t('pages.taskList.noTasksTitle') }}
        </h3>
        <p class="text-gray-400 max-w-md mx-auto">
          {{ $t('pages.taskList.noTasksDescription') }}
        </p>
      </div>

      <!-- 任务卡片网格 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          :solved="solvedTaskIds.includes(task.id)"
          @solve="handleSolveTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import TaskCard from '@/components/Common/TaskCard.vue';
import { useUserStore } from '@/store/modules/user.js';
import { useTasksStore } from '@/store/modules/tasks.js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const userStore = useUserStore();
const taskStore = useTasksStore();

// 状态
const loading = ref(true);
const selectedCategory = ref('all');
const searchQuery = ref('');

// 获取任务列表
const fetchTasks = async () => {
  try {
    loading.value = true;
    await Promise.all([
      taskStore.fetchTasks(),
      userStore.fetchUserInfo()
    ]);
  } catch (error) {
    window.$notify.error(
      t('pages.taskList.fetchErrorTitle'),
      t('pages.taskList.fetchErrorMessage')
    );
  } finally {
    loading.value = false;
  }
};

// 处理任务解决
const handleSolveTask = (taskId) => {
  // 显示成功通知
  window.$notify.success(
    t('pages.taskList.solveSuccessTitle'),
    t('pages.taskList.solveSuccessMessage')
  );

  // 更新已解决任务ID列表
  userStore.addSolvedTask(taskId);

  // 刷新用户分数
  userStore.fetchUserInfo();
};

// 计算属性：过滤后的任务列表
const filteredTasks = computed(() => {
  let tasks = taskStore.tasks;

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    tasks = tasks.filter(task => task.category === selectedCategory.value);
  }

  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    tasks = tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  }

  // 按解决状态排序（已解决的排在前面）
  tasks.sort((a, b) => {
    const aSolved = userStore.solvedTasks.includes(a.id);
    const bSolved = userStore.solvedTasks.includes(b.id);

    if (aSolved && !bSolved) return -1;
    if (!aSolved && bSolved) return 1;
    return 0;
  });

  return tasks;
});

// 计算属性：已解决任务ID列表
const solvedTaskIds = computed(() => userStore.solvedTasks);

// 初始化
onMounted(() => {
  fetchTasks();
});

// 监听搜索框变化
watch(searchQuery, (newVal) => {
  console.log('Search query changed:', newVal);
});
</script>
