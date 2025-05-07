<template>
  <div 
    class="bg-sub-bg border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 group fade-in"
    :class="{ 'opacity-70': solved }"
  >
    <!-- 任务卡片内容 -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
      <!-- 左侧内容 -->
      <div class="flex-1 min-w-0">
        <!-- 分类标签 -->
        <div
          :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', categoryClass(task.category)]"
        >
          {{ $t(`pages.taskList.categories.${task.category}`) }}
        </div>

        <!-- 任务标题 -->
        <h3 class="text-lg font-semibold text-white mt-3 group-hover:text-primary transition-colors hover:underline decoration-primary decoration-2">
          <router-link 
            :to="`/tasks/${task.id}`"
            class="block hover:no-underline"
          >{{ task.title }}</router-link>
        </h3>
        
        <!-- 任务描述 -->
        <p class="text-gray-300 text-sm mt-2 line-clamp-2 leading-relaxed">
          {{ task.description }}
        </p>
      </div>

      <!-- 右侧信息 -->
      <div class="flex flex-col items-end justify-between min-h-[70px]">
        <!-- 分数 -->
        <div class="text-xl font-bold text-primary flex items-center gap-2">
          <i class="fa-solid fa-trophy scale-110"></i>
          {{ task.points }}
        </div>
        
        <!-- 解决状态 -->
        <div v-if="solved" class="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 border border-green-500/20 text-green-500">
          <i class="fa-solid fa-check mr-2"></i>
          {{ $t('pages.taskList.solved') }}
        </div>
      </div>
    </div>
    
    <!-- 底部信息 -->
    <div class="mt-6 pt-5 border-t border-gray-700/50 flex justify-between items-center">
      <!-- 作者 -->
      <div class="flex items-center gap-3">
        <img 
          :src="task.author_avatar || 'https://picsum.photos/32/32?random=' + task.id" 
          alt="Author avatar" 
          class="w-7 h-7 rounded-full object-cover border-2 border-gray-800"
        >
        <span class="text-xs text-gray-400 opacity-80">
          {{ task.author || 'Unknown' }}
        </span>
      </div>
      
      <!-- 解决率 -->
      <div class="flex items-center gap-2 text-xs text-gray-400 opacity-80">
        <i class="fa-solid fa-users scale-95"></i>
        {{ solveRate }}% {{ $t('pages.taskList.solveRate') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useUserStore } from '@/store/modules/user.js';

const props = defineProps({
  task: { type: Object, required: true },
  solved: { type: Boolean, default: false }
});

const userStore = useUserStore();

const solveRate = computed(() => {
  const total = props.task.total_teams || 0;
  const solves = props.task.solves || 0;
  return total > 0 ? Math.round((solves / total) * 100) : 0;
});

const categoryClass = (category) => {
  const classes = {
    'private_cloud': 'bg-private_cloud-bg/15 text-private_cloud-text',
    'public_cloud': 'bg-public_cloud-bg/15 text-public_cloud-text',
    'container_cloud': 'bg-container_cloud-bg/15 text-container_cloud-text'
  };
  return classes[category] || 'bg-gray-700/20 text-gray-300';
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* 新增视觉优化样式 */
:deep(.group-hover\:text-primary) {
  transition: color 0.3s ease;
}

:deep(.hover\:underline) {
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

:deep(.scale-110) {
  transform: scale(1.1);
}

:deep(.leading-relaxed) {
  line-height: 1.4;
}
</style>
