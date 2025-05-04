<template>
  <div class="bg-dark-bg min-h-screen pb-12">
    <!-- 页面标题 -->
    <div class="bg-sub-bg border-b border-gray-800 py-8 px-4">
      <div class="container mx-auto">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white">
          {{ $t('pages.ranking.title') }}
        </h1>
        <p class="text-gray-400 mt-2 max-w-2xl">
          {{ $t('pages.ranking.subtitle') }}
        </p>
      </div>
    </div>

    <!-- 筛选和切换 -->
    <div class="bg-dark-bg border-b border-gray-800 py-4 px-4">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- 时间范围筛选 -->
          <div class="relative">
            <select
              v-model="selectedTimeRange"
              class="bg-sub-bg border border-gray-700 text-white rounded-lg py-2 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="all">{{ $t('pages.ranking.allTime') }}</option>
              <option value="month">{{ $t('pages.ranking.thisMonth') }}</option>
              <option value="week">{{ $t('pages.ranking.thisWeek') }}</option>
              <option value="day">{{ $t('pages.ranking.today') }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i class="fa-solid fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜内容 -->
    <div class="container mx-auto px-4 mt-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="usersRanking.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
          <i class="fa-solid fa-trophy text-primary text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">
          {{ $t('pages.ranking.noDataTitle') }}
        </h3>
        <p class="text-gray-400 max-w-md mx-auto">
          {{ $t('pages.ranking.noDataDescription') }}
        </p>
      </div>

      <!-- 排行榜表格 -->
      <div v-else>
        <!-- 前三名卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- 第二名 -->
          <div v-if="usersRanking.length >= 2" class="bg-sub-bg border border-gray-800 rounded-xl p-6 relative transform hover:-translate-y-1 transition-all duration-300">
            <div class="absolute -top-4 -right-4 text-4xl text-gray-700 opacity-50">
              <i class="fa-solid fa-medal"></i>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <span class="text-4xl font-bold text-gray-400">2</span>
              </div>
              <div class="mb-2">
                <img
                  :src="usersRanking[1].avatar"
                  alt="Second place avatar"
                  class="w-16 h-16 rounded-full object-cover border-4 border-gray-600"
                />
              </div>
              <h3 class="text-lg font-semibold text-white mb-1">
                {{ usersRanking[1].username }}
              </h3>
              <p class="text-sm text-gray-400 mb-3">
                {{ usersRanking[1].team_name || '-' }}
              </p>
              <div class="text-primary font-bold text-xl">
                {{ usersRanking[1].score }}
              </div>
              <p class="text-xs text-gray-400 mt-1">
                {{ $t('pages.ranking.points') }}
              </p>
            </div>
          </div>

          <!-- 第一名 -->
          <div v-if="usersRanking.length >= 1" class="bg-sub-bg border border-gray-800 rounded-xl p-6 relative transform hover:-translate-y-2 transition-all duration-300 scale-105 md:scale-110">
            <div class="absolute -top-4 -right-4 text-4xl text-yellow-500 opacity-50">
              <i class="fa-solid fa-medal"></i>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3">
                <span class="text-4xl font-bold text-yellow-500">1</span>
              </div>
              <div class="mb-2">
                <img
                  :src="usersRanking[0].avatar"
                  alt="First place avatar"
                  class="w-16 h-16 rounded-full object-cover border-4 border-yellow-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-white mb-1">
                {{ usersRanking[0].username }}
              </h3>
              <p class="text-sm text-gray-400 mb-3">
                {{ usersRanking[0].team_name || '-' }}
              </p>
              <div class="text-primary font-bold text-xl">
                {{ usersRanking[0].score }}
              </div>
              <p class="text-xs text-gray-400 mt-1">
                {{ $t('pages.ranking.points') }}
              </p>
            </div>
          </div>

          <!-- 第三名 -->
          <div v-if="usersRanking.length >= 3" class="bg-sub-bg border border-gray-800 rounded-xl p-6 relative transform hover:-translate-y-1 transition-all duration-300">
            <div class="absolute -top-4 -right-4 text-4xl text-gray-700 opacity-50">
              <i class="fa-solid fa-medal"></i>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <span class="text-4xl font-bold text-orange-500">3</span>
              </div>
              <div class="mb-2">
                <img
                  :src="usersRanking[2].avatar"
                  alt="Third place avatar"
                  class="w-16 h-16 rounded-full object-cover border-4 border-orange-500"
                />
              </div>
              <h3 class="text-lg font-semibold text-white mb-1">
                {{ usersRanking[2].username }}
              </h3>
              <p class="text-sm text-gray-400 mb-3">
                {{ usersRanking[2].team_name || '-' }}
              </p>
              <div class="text-primary font-bold text-xl">
                {{ usersRanking[2].score }}
              </div>
              <p class="text-xs text-gray-400 mt-1">
                {{ $t('pages.ranking.points') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 排行榜表格 -->
        <div class="bg-sub-bg border border-gray-800 rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-dark-bg">
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {{ $t('pages.ranking.rank') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {{ $t('pages.ranking.user') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {{ $t('pages.ranking.team') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {{ $t('pages.ranking.score') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {{ $t('pages.ranking.solves') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {{ $t('pages.ranking.lastSolve') }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                <tr
                  v-for="(item, index) in usersRanking.slice(3)"
                  :key="item.id || index"
                  class="hover:bg-gray-800/50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-400">
                        {{ index + 4 }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          :src="item.avatar"
                          alt="User avatar"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-white">
                          {{ item.username }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-400">
                      {{ item.team_name || '-' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-white">
                      {{ item.score }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-400">
                      {{ item.solves }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {{ item.last_solve || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页 -->
          <div class="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-400 bg-sub-bg hover:bg-gray-700">
                {{ $t('pages.ranking.previous') }}
              </button>
              <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-400 bg-sub-bg hover:bg-gray-700">
                {{ $t('pages.ranking.next') }}
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-400">
                  {{ $t('pages.ranking.showing') }}
                  <span class="font-medium">1</span>
                  {{ $t('pages.ranking.to') }}
                  <span class="font-medium">10</span>
                  {{ $t('pages.ranking.of') }}
                  <span class="font-medium">{{ usersRanking.length }}</span>
                  {{ $t('pages.ranking.results') }}
                </p>
              </div>
              <div>
                <!-- 修正：为 aria-label 添加引号 -->
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-sub-bg text-sm font-medium text-gray-400 hover:bg-gray-700">
                    <span class="sr-only">{{ $t('pages.ranking.previous') }}</span>
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <button class="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-primary text-sm font-medium text-white">
                    1
                  </button>
                  <button class="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-sub-bg text-sm font-medium text-gray-400 hover:bg-gray-700">
                    2
                  </button>
                  <button class="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-sub-bg text-sm font-medium text-gray-400 hover:bg-gray-700">
                    3
                  </button>
                  <span class="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-sub-bg text-sm font-medium text-gray-400">
                    ...
                  </span>
                  <button class="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-sub-bg text-sm font-medium text-gray-400 hover:bg-gray-700">
                    10
                  </button>
                  <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-sub-bg text-sm font-medium text-gray-400 hover:bg-gray-700">
                    <span class="sr-only">{{ $t('pages.ranking.next') }}</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </nav>
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
import { useRankingStore } from '@/store/modules/ranking';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();


const rankingStore = useRankingStore();

// 状态
const loading = ref(true);
const selectedTimeRange = ref('all');

// 获取排行榜数据
const fetchRanking = async () => {
  try {
    loading.value = true;
    await rankingStore.fetchUserRanking({ timeRange: selectedTimeRange.value });
  } catch (error) {
    window.$notify.error(
      t('pages.ranking.fetchErrorTitle'),
      t('pages.ranking.fetchErrorMessage')
    );
  } finally {
    loading.value = false;
  }
};

// 计算属性：用户排行榜
const usersRanking = computed(() => {
  return rankingStore.users || [];
});

// 监听筛选条件变化，重新加载排行榜
watch([selectedTimeRange], () => {
  fetchRanking();
});

// 初始化
onMounted(() => {
  fetchRanking();
});
</script>

<style scoped>
/* 动画效果 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
