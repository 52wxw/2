<template>
  <div class="bg-dark-bg min-h-screen pb-12">
    <!-- 页面标题 -->
    <div class="bg-sub-bg border-b border-gray-800 py-8 px-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white">
              {{ $t('profile.title') }}
            </h1>
            <p class="text-gray-400 mt-2">
              {{ $t('profile.subtitle') }}
            </p>
          </div>
          <div v-if="isSelf">
            <button @click="editProfile" class="text-gray-400 hover:text-white transition-colors">
              <i class="fa-solid fa-pen-to-square text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="container mx-auto px-4 mt-8">
      <!-- 个人信息卡片 -->
      <div class="bg-sub-bg border border-gray-800 rounded-xl p-6 max-w-3xl mx-auto mb-8">
        <div class="flex items-center mb-4">
          <img
            :src="user.avatar || 'https://picsum.photos/200/200?random=1'"
            alt="User avatar"
            class="w-20 h-20 rounded-full object-cover border-4 border-gray-700 mr-4"
          />
          <div>
            <h2 class="text-2xl font-bold text-white">{{ user.username }}</h2>
            <p class="text-gray-400">{{ user.email }}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-400">{{ $t('profile.location') }}</p>
            <p class="text-white">{{ user.location || '-' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">{{ $t('profile.website') }}</p>
            <a
              :href="user.website"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              {{ user.website || '-' }}
            </a>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">{{ $t('profile.organization') }}</p>
            <p class="text-white">{{ user.organization || '-' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-400">{{ $t('profile.position') }}</p>
            <p class="text-white">{{ user.position || '-' }}</p>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm font-medium text-gray-400">{{ $t('profile.about') }}</p>
          <p class="text-white">{{ user.about || '-' }}</p>
        </div>
      </div>

      <!-- 解决的任务列表 -->
      <div class="bg-sub-bg border border-gray-800 rounded-xl p-6 max-w-3xl mx-auto mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">
          {{ $t('profile.solvedTasks') }}
        </h2>
        <div class="flex items-center mb-4">
          <select
            v-model="solveFilterCategory"
            class="bg-dark-bg border border-gray-700 text-white rounded-lg px-4 py-2 mr-2"
          >
            <option value="all">{{ $t('profile.allCategories') }}</option>
            <option v-for="category in solveCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <select
            v-model="solveFilterDifficulty"
            class="bg-dark-bg border border-gray-700 text-white rounded-lg px-4 py-2"
          >
            <option value="all">{{ $t('profile.allDifficulties') }}</option>
            <option value="easy">{{ $t('profile.easy') }}</option>
            <option value="medium">{{ $t('profile.medium') }}</option>
            <option value="hard">{{ $t('profile.hard') }}</option>
          </select>
        </div>
        <div v-if="filteredSolves.length === 0" class="text-gray-400">
          {{ $t('profile.noSolvedTasks') }}
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="solve in filteredSolves"
            :key="solve.id"
            class="bg-dark-bg border border-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 class="text-lg font-medium text-white">{{ solve.title }}</h3>
              <p class="text-sm text-gray-400">
                {{ $t('profile.category') }}:
                <span :class="solveCategoryClass(solve.category)">{{ solve.category }}</span>
              </p>
              <p class="text-sm text-gray-400">
                {{ $t('profile.difficulty') }}:
                <span :class="solveDifficultyClass(solve.difficulty)">{{ solve.difficulty }}</span>
              </p>
            </div>
            <div class="text-green-500">
              <i class="fa-solid fa-check-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 设置 -->
      <div v-if="selectedTab === 'settings'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- 个人信息设置 -->
          <div class="bg-sub-bg border border-gray-800 rounded-xl p-6 lg:col-span-2">
            <h2 class="text-xl font-semibold text-white mb-6">
              {{ $t('profile.personalInfoSettings') }}
            </h2>
            <form @submit.prevent="saveProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.username') }}
                  </label>
                  <input
                    type="text"
                    id="username"
                    v-model="profileForm.username"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.email') }}
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label for="location" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.location') }}
                  </label>
                  <input
                    type="text"
                    id="location"
                    v-model="profileForm.location"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label for="website" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.website') }}
                  </label>
                  <input
                    type="url"
                    id="website"
                    v-model="profileForm.website"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label for="organization" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.organization') }}
                  </label>
                  <input
                    type="text"
                    id="organization"
                    v-model="profileForm.organization"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label for="position" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.position') }}
                  </label>
                  <input
                    type="text"
                    id="position"
                    v-model="profileForm.position"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div class="mb-8">
                <label for="about" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('profile.about') }}
                </label>
                <textarea
                  id="about"
                  v-model="profileForm.about"
                  rows="4"
                  class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                ></textarea>
              </div>
              <div class="flex items-center justify-end space-x-4">
                <button
                  @click="cancelEdit"
                  class="bg-sub-bg hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg px-6 py-2.5 transition-colors"
                >
                  {{ $t('profile.cancel') }}
                </button>
                <button
                  type="submit"
                  class="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-6 py-2.5 transition-colors flex items-center space-x-2"
                  :disabled="loading"
                >
                  <span>{{ $t('profile.saveChanges') }}</span>
                  <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </button>
              </div>
            </form>
          </div>

          <!-- 安全设置 -->
          <div class="bg-sub-bg border border-gray-800 rounded-xl p-6">
            <h2 class="text-xl font-semibold text-white mb-6">
              {{ $t('profile.securitySettings') }}
            </h2>

            <!-- 更改密码 -->
            <div class="mb-8">
              <h3 class="text-lg font-medium text-white mb-4">
                {{ $t('profile.changePassword') }}
              </h3>
              <form @submit.prevent="changePassword">
                <div class="mb-4">
                  <label for="current_password" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.currentPassword') }}
                  </label>
                  <input
                    type="password"
                    id="current_password"
                    v-model="passwordForm.current_password"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label for="new_password" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.newPassword') }}
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    v-model="passwordForm.new_password"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div class="mb-6">
                  <label for="confirm_password" class="block text-sm font-medium text-gray-400 mb-1">
                    {{ $t('profile.confirmPassword') }}
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    v-model="passwordForm.new_password"
                    class="bg-dark-bg border border-gray-700 text-white rounded-lg block w-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-6 py-2.5 transition-colors flex items-center space-x-2"
                  :disabled="loading"
                >
                  <span>{{ $t('profile.changePassword') }}</span>
                  <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </button>
              </form>
            </div>

            <!-- 双因素认证 -->
            <div>
              <h3 class="text-lg font-medium text-white mb-4">
                {{ $t('profile.twoFactorAuth') }}
              </h3>
              <div class="flex items-center justify-between p-4 bg-dark-bg border border-gray-700 rounded-lg">
                <div>
                  <h4 class="font-medium text-white">
                    {{ $t('profile.enable2FA') }}
                  </h4>
                  <p class="text-sm text-gray-400 mt-1">
                    {{ $t('profile.2FADescription') }}
                  </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="twoFactorEnabled" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <p class="text-xs text-gray-400 mt-3">
                {{ $t('profile.2FAWarning') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

// 状态
const loading = ref(true);
const selectedTab = ref('overview');
const user = ref({});
const isSelf = computed(() => {
  return userStore.user.id === parseInt(route.params.id);
});

// 获取用户资料
const fetchUser = async () => {
  try {
    loading.value = true;
    await userStore.fetchUser(route.params.id);
    user.value = userStore.user;
    // 初始化表单数据
    profileForm.username = user.value.username;
    profileForm.email = user.value.email;
    profileForm.location = user.value.location;
    profileForm.website = user.value.website;
    profileForm.organization = user.value.organization;
    profileForm.position = user.value.position;
    profileForm.about = user.value.about;
  } catch (error) {
    router.push('/404');
  } finally {
    loading.value = false;
  }
};

// 监听路由变化
watch(
  () => route.params.id,
  () => {
    fetchUser();
  },
  { immediate: true }
);

// 表单数据
const profileForm = reactive({
  username: '',
  email: '',
  location: '',
  website: '',
  organization: '',
  position: '',
  about: '',
  github: '',
  twitter: '',
  linkedin: '',
  discord: '',
});

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

const twoFactorEnabled = ref(false);

// 编辑资料
const editProfile = () => {
  router.push(`/profile/${userStore.user.id}/edit`);
};

// 保存资料
const saveProfile = async () => {
  try {
    loading.value = true;
    await userStore.updateUser(profileForm);
    // 显示成功通知
    window.$notify.success(
      t('profile.saveSuccessTitle'),
      t('profile.saveSuccessMessage')
    );
    // 重新获取用户资料
    await fetchUser();
    // 关闭编辑模式
    selectedTab.value = 'overview';
  } catch (error) {
    console.error('保存资料失败:', error);
    // 显示错误通知
    window.$notify.error(
      t('profile.saveErrorTitle'),
      t('profile.saveErrorMessage')
    );
  } finally {
    loading.value = false;
  }
};

// 更改密码
const changePassword = async () => {
  try {
    loading.value = true;
    await userStore.changePassword(passwordForm);
    // 显示成功通知
    window.$notify.success(
      t('profile.passwordChangeSuccessTitle'),
      t('profile.passwordChangeSuccessMessage')
    );
    // 清空表单
    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.confirm_password = '';
  } catch (error) {
    console.error('更改密码失败:', error);
    // 显示错误通知
    window.$notify.error(
      t('profile.passwordChangeErrorTitle'),
      t('profile.passwordChangeErrorMessage')
    );
  } finally {
    loading.value = false;
  }
};

// 前往任务列表
const goToTasks = () => {
  router.push('/tasks');
};

// 计算属性：过滤解决的任务
const solveCategories = [
  { id: 'web', name: 'web' },
  { id: 'crypto', name: 'crypto' },
  // 其他分类...
];

const solveFilterCategory = ref('all');
const solveFilterDifficulty = ref('all');

const filteredSolves = computed(() => {
  let solves = user.value.solves || [];
  if (solveFilterCategory.value !== 'all') {
    solves = solves.filter((solve) => solve.category === solveFilterCategory.value);
  }
  if (solveFilterDifficulty.value !== 'all') {
    solves = solves.filter((solve) => solve.difficulty === solveFilterDifficulty.value);
  }
  return solves;
});

// 工具函数：获取分类颜色
const categoryColor = (category) => {
  // 颜色映射逻辑...
  return '#7C3AED';
};

const solveCategoryClass = (category) => {
  // 分类样式逻辑...
  return `bg-${category}-bg/20 text-${category}-text`;
};

const solveDifficultyClass = (difficulty) => {
  // 难度样式逻辑...
  return `bg-${difficulty}-bg/20 text-${difficulty}-text`;
};

// 取消编辑
const cancelEdit = () => {
  selectedTab.value = 'overview';
};
</script>

<style scoped>
/* 动画效果 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
