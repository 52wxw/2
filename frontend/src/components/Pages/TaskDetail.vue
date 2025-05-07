<template>
  <div class="bg-dark-bg min-h-screen pb-12">
    <!-- 页面标题 -->
    <div class="bg-sub-bg border-b border-gray-800 py-8 px-4">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div v-if="taskLoaded">
            <div v-if="task.id" class="flex items-center mb-2">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                :class="taskCategoryClass"
              >
                {{ $t(`taskList.categories.${task.category}`) }}
              </span>
              <span
                v-if="isSolved"
                class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400"
              >
                {{ $t('taskDetail.solved') }}
              </span>
            </div>
            <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white">
              {{ task.title }}
            </h1>
            <p class="text-gray-400 mt-2 max-w-2xl">
              {{ task.points }} {{ $t('taskDetail.points') }}
            </p>
          </div>
          <div v-else class="text-center w-full py-8">
            <div v-if="loading" class="animate-pulse">
              <div class="h-6 bg-gray-700 rounded w-1/2 mx-auto mb-2"></div>
              <div class="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
            </div>
            <div v-if="errorMessage" class="text-red-500">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务内容 -->
    <div class="container mx-auto px-4 mt-8" v-if="taskLoaded">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 任务描述 -->
        <div class="lg:col-span-2">
          <div v-if="task.id" class="bg-sub-bg border border-gray-800 rounded-xl p-6 mb-6">
            <h2 class="text-xl font-semibold text-white mb-4">
              {{ $t('taskDetail.description') }}
            </h2>
            <div class="prose prose-invert max-w-none">
              <p v-html="task.description"></p>
            </div>
          </div>

          <!-- 附件 -->
          <div v-if="task.id && task.attachments && task.attachments.length > 0" class="bg-sub-bg border border-gray-800 rounded-xl p-6 mb-6">
            <h2 class="text-xl font-semibold text-white mb-4">
              {{ $t('taskDetail.attachments') }}
            </h2>
            <div class="space-y-3">
              <a
                v-for="attachment in task.attachments"
                :key="attachment.id"
                :href="attachment.url"
                target="_blank"
                class="flex items-center text-primary hover:text-primary/80 transition-colors"
              >
                <i class="fa-solid fa-download mr-2"></i>
                <span>{{ attachment.name }}</span>
              </a>
            </div>
          </div>

          <!-- 答案提交表单 -->
          <div v-if="task.id && !isSolved" class="bg-sub-bg border border-gray-800 rounded-xl p-6 mb-6">
            <h2 class="text-xl font-semibold text-white mb-4">
              {{ $t('taskDetail.submitAnswer') }}
            </h2>

            <div v-if="errorMessage" class="mb-4 text-red-500">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="submitAnswer">
              <div class="mb-4">
                <label for="answer" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('taskDetail.answer') }}
                </label>
                <input
                  type="text"
                  id="answer"
                  v-model="answer"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="{{ $t('taskDetail.answerPlaceholder') }}"
                >
              </div>

              <button
                type="submit"
                class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                :disabled="loading"
              >
                <i class="fa-solid fa-paper-plane mr-2"></i>
                {{ $t('taskDetail.submit') }}
              </button>

              <div v-if="loading" class="mt-3 text-gray-400">
                <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                {{ $t('taskDetail.submitting') }}
              </div>
            </form>
          </div>

          <!-- 已解决提示 -->
          <div v-if="task.id && isSolved" class="bg-sub-bg border border-green-600 rounded-xl p-6 mb-6">
            <div class="flex items-center">
              <i class="fa-solid fa-check-circle text-green-500 text-2xl mr-3"></i>
              <div>
                <h3 class="text-lg font-semibold text-green-400">
                  {{ $t('taskDetail.congrats') }}
                </h3>
                <p class="text-gray-400">
                  {{ $t('taskDetail.youSolvedThis') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 任务信息侧边栏 -->
        <div>
          <div class="bg-sub-bg border border-gray-800 rounded-xl p-6 sticky top-24">
            <h2 class="text-xl font-semibold text-white mb-4">
              {{ $t('taskDetail.taskInfo') }}
            </h2>

            <!-- 任务作者 -->
            <div class="flex items-center mb-4">
              <img
                :src="task.author_avatar || 'https://picsum.photos/40/40?random=2'"
                alt="Author avatar"
                class="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
              />
              <div class="ml-3">
                <p class="text-sm font-medium text-white">
                  {{ $t('taskDetail.author') }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ task.author || 'Unknown' }}
                </p>
              </div>
            </div>

            <!-- 解决统计 -->
            <div class="mb-4">
              <p class="text-sm text-gray-400 mb-1">
                {{ $t('taskDetail.solveRate') }}
              </p>
              <div class="flex items-center">
                <div class="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                  <div
                    class="bg-primary h-2.5 rounded-full"
                    :style="{ width: solveRate + '%' }"
                  ></div>
                </div>
                <span class="text-sm text-gray-400 min-w-[40px] text-right">
                  {{ solveRate }}%
                </span>
              </div>
            </div>

            <!-- 首次解决者 -->
            <div v-if="task.first_blood" class="mb-4">
              <p class="text-sm text-gray-400 mb-1">
                {{ $t('taskDetail.firstBlood') }}
              </p>
              <div class="flex items-center">
                <img
                  :src="task.first_blood.avatar || 'https://picsum.photos/32/32?random=3'"
                  alt="First blood user"
                  class="w-8 h-8 rounded-full object-cover border-2 border-red-500"
                />
                <span class="ml-2 text-sm text-gray-300">
                  {{ task.first_blood.username || 'Unknown' }}
                </span>
              </div>
            </div>

            <!-- 相关任务 -->
            <div v-if="relatedTasks.length > 0">
              <p class="text-sm font-medium text-white mb-2">
                {{ $t('taskDetail.relatedTasks') }}
              </p>
              <div class="space-y-2">
                <router-link
                  v-for="relatedTask in relatedTasks"
                  :key="relatedTask.id"
                  :to="`/tasks/${relatedTask.id}`"
                  class="block text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <i class="fa-solid fa-link mr-2 text-gray-500"></i>
                  {{ relatedTask.title }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user.js';
import { useTasksStore } from '@/store/modules/tasks.js';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const taskStore = useTasksStore();
const { t } = useI18n();

// 状态管理
const taskLoaded = ref(false);
const loading = ref(false);
const answer = ref('');
const errorMessage = ref('');

// 计算属性：当前任务（安全获取，避免 undefined）
const task = computed(() => taskStore.currentTask || {});

// 计算属性：任务是否已解决（处理 solvedTasks 可能为 undefined）
const isSolved = computed(() => {
  return (userStore.solvedTasks || []).includes(route.params.id);
});

// 计算属性：解决率（增加空值保护）
const solveRate = computed(() => {
  const total = task.value.total_teams || 0;
  const solves = task.value.solves || 0;
  return total > 0 ? Math.round((solves / total) * 100) : 0;
});

// 计算属性：相关任务（增加空值保护）
const relatedTasks = computed(() => {
  return (taskStore.tasks || []).filter(
    t => t.category === task.value.category && t.id !== task.value.id
  ).slice(0, 3);
});

// 计算属性：任务分类样式
const taskCategoryClass = computed(() => {
  const classes = {
    'private_cloud': 'bg-private_cloud-bg/20 text-private_cloud-text',
    'public_cloud': 'bg-public_cloud-bg/20 text-public_cloud-text',
    'container_cloud': 'bg-container_cloud-bg/20 text-container_cloud-text'
  };
  return classes[task.value.category] || 'bg-gray-700 text-gray-300';
});

// 获取任务详情（增强错误处理）
const fetchTask = async () => {
  const taskId = route.params.id;
  if (!taskId) {
    errorMessage.value = t('taskDetail.invalidTaskId');
    taskLoaded.value = true;
    return;
  }

  loading.value = true;
  taskLoaded.value = false;
  errorMessage.value = '';

  try {
    await taskStore.fetchTask(taskId);
    if (!taskStore.currentTask.id) throw new Error('TASK_NOT_FOUND');
  } catch (error) {
    let errorMsg = t('taskDetail.fetchErrorMessage');
    if (error.response?.status === 404 || error.message === 'TASK_NOT_FOUND') {
      errorMsg = t('taskDetail.taskNotFound');
    } else if (error.response?.status >= 500) {
      errorMsg = t('taskDetail.serverError');
    }

    errorMessage.value = errorMsg;
    if (window.$notify) {
      window.$notify.error(t('taskDetail.fetchErrorTitle'), errorMsg);
    }
    router.push('/tasks');
  } finally {
    loading.value = false;
    taskLoaded.value = true;
  }
};

// 提交答案逻辑（保持不变）
const submitAnswer = async () => {
  if (!answer.value.trim()) {
    errorMessage.value = t('taskDetail.answerRequired');
    return;
  }

  errorMessage.value = '';
  loading.value = true;

  try {
    const result = await taskStore.submitAnswer(route.params.id, answer.value);
    if (result.correct) {
      userStore.addSolvedTask(route.params.id);
      if (window.$notify) {
        window.$notify.success(t('taskDetail.correctTitle'), t('taskDetail.correctMessage'));
      }
      await fetchTask();
    } else {
      if (window.$notify) {
        window.$notify.error(t('taskDetail.incorrectTitle'), t('taskDetail.incorrectMessage'));
      }
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || t('taskDetail.submitError');
  } finally {
    loading.value = false;
  }
};

// 生命周期与路由监听
onMounted(() => fetchTask());
watch(() => route.params.id, () => {
  fetchTask();
  answer.value = '';
  errorMessage.value = '';
});
</script>
