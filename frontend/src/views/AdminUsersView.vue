<template>
  <div class="bg-gray-900 min-h-screen text-gray-100">
    <!-- 页面标题 -->
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">用户管理</h2>
        <div class="flex items-center space-x-2">
          <button
            @click="createUser"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i class="fa fa-plus mr-2"></i>创建用户
          </button>
          <button
            @click="deleteSelectedUsers"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            :disabled="selectedUserIds.size === 0"
          >
            <i class="fa fa-trash mr-2"></i>删除用户
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
              @keyup.enter="fetchUsers"
              type="text"
              placeholder="用户名/邮箱/ID"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button
              @click="fetchUsers"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>

        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-400 mb-1">角色</label>
          <select
            v-model="roleFilter"
            @change="fetchUsers"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="ROLE_ADMIN">管理员</option>
            <option value="ROLE_USER">普通用户</option>
          </select>
        </div>

        <div class="w-[200px]">
          <label class="block text-sm font-medium text-gray-400 mb-1">状态</label>
          <select
            v-model="statusFilter"
            @change="fetchUsers"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="enabled">已启用</option>
            <option value="disabled">已禁用</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="fetchUsers"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <i class="fa fa-refresh mr-2"></i>刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center text-white p-6">
      <i class="fa fa-spinner fa-spin"></i> 正在加载用户列表...
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="text-center text-red-500 p-6">
      {{ errorMessage }}
    </div>

    <!-- 用户列表 -->
    <div v-if="!loading && !errorMessage" class="bg-gray-800 p-6 rounded-lg mx-6 mb-6 shadow-lg overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              <input
                type="checkbox"
                class="rounded text-blue-500 focus:ring-blue-500"
                :checked="selectedUserIds.size === pagedUsers.length && pagedUsers.length > 0"
                :indeterminate="selectedUserIds.size > 0 && selectedUserIds.size < pagedUsers.length"
                @change="toggleSelectAll($event.target.checked)"
              >
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">用户名</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">邮箱</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">角色</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">注册时间</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="user in pagedUsers" :key="user.id" class="hover:bg-gray-700/50 transition-colors">
            <td class="px-4 py-3 whitespace-nowrap">
              <input
                type="checkbox"
                class="rounded text-blue-500 focus:ring-blue-500"
                :checked="selectedUserIds.has(user.id)"
                @change="toggleSelection(user.id, $event.target.checked)"
              >
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-300">#{{ user.id }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center">
                <img
                  :src="user.avatar || 'https://picsum.photos/200/200?random=' + user.id"
                  alt="用户头像"
                  class="h-8 w-8 rounded-full mr-3"
                >
                <div>
                  <div class="text-sm font-medium text-white">{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{{ user.email }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': getUserRole(user) === 'ROLE_ADMIN',
                  'bg-gray-100 text-gray-800': getUserRole(user) === 'ROLE_USER'
                }"
              >
                {{ getUserRoleText(user) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': user.enabled,
                  'bg-red-100 text-red-800': !user.enabled
                }"
              >
                {{ user.enabled ? '已启用' : '已禁用' }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
              <button
                @click="editUser(user.id)"
                class="text-blue-400 hover:text-blue-600 mr-3 transition-colors"
              >
                <i class="fa fa-edit"></i>
              </button>
              <button
                @click="deleteUser(user.id)"
                class="text-red-400 hover:text-red-600 transition-colors"
              >
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="mt-6 flex justify-between items-center">
        <div class="text-sm text-gray-400">
          显示 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, totalUsers) }} 条，共 {{ totalUsers }} 条
        </div>
        <div class="flex space-x-1">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fa fa-chevron-left"></i>
          </button>

          <button
            v-for="page in pages"
            :key="page"
            :class="{
              'px-3 py-1 rounded-lg bg-blue-500 text-white': page === currentPage,
              'bg-gray-700 text-white hover:bg-gray-600': page !== currentPage
            }"
            @click="gotoPage(page)"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !errorMessage && pagedUsers.length === 0" class="text-center py-16">
      <div class="text-gray-400 mb-4">
        <i class="fa fa-users text-5xl"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-300 mb-2">暂无用户数据</h3>
      <p class="text-gray-500 mb-6">请尝试刷新页面或添加新用户</p>
      <button
        @click="createUser"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i class="fa fa-plus mr-2"></i>创建用户
      </button>
    </div>

    <!-- 删除确认模态框 -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
        <h3 class="text-lg font-semibold text-white mb-4">确认删除</h3>
        <p class="text-gray-300 mb-6">你确定要删除这个用户吗？此操作不可撤销。</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
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

// 全量原始用户数据（前端过滤基础）
const rawUsers = ref([]);
// 搜索/筛选条件
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
// 分页状态
const currentPage = ref(1);
const pageSize = ref(10);
// 计算属性：过滤后数据 + 分页后数据 + 分页信息
const filteredUsers = computed(() => {
  let result = rawUsers.value;
  const keyword = searchQuery.value.trim().toLowerCase();

  // 搜索过滤（ID/用户名/邮箱，不区分大小写）
  if (keyword) {
    result = result.filter(user => {
      const idMatch = user.id.toString().toLowerCase().includes(keyword);
      const usernameMatch = user.username.toLowerCase().includes(keyword);
      const emailMatch = user.email.toLowerCase().includes(keyword);
      return idMatch || usernameMatch || emailMatch;
    });
  }

  // 角色过滤
  if (roleFilter.value) {
    result = result.filter(user => getUserRole(user) === roleFilter.value);
  }

  // 状态过滤
  if (statusFilter.value) {
    result = statusFilter.value === 'enabled' 
      ? result.filter(user => user.enabled) 
      : result.filter(user => !user.enabled);
  }

  return result;
});

const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredUsers.value.slice(start, start + pageSize.value);
});

const totalUsers = computed(() => filteredUsers.value.length);
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value));
const pages = computed(() => {
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = startPage + maxPages - 1;
  endPage = Math.min(endPage, totalPages.value);
  startPage = Math.max(1, endPage - maxPages + 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 其他状态
const loading = ref(false);
const showDeleteModal = ref(false);
const userIdToDelete = ref(null);
const errorMessage = ref('');
const selectedUserIds = ref(new Set());

// 辅助函数
const getUserRole = (user) => {
  return user.roles?.[0]?.name || 'ROLE_USER';
};

const getUserRoleText = (user) => getUserRole(user) === 'ROLE_ADMIN' ? '管理员' : '普通用户';

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString() : '';

// 选择相关逻辑
const toggleSelection = (userId, isChecked) => {
  isChecked ? selectedUserIds.value.add(userId) : selectedUserIds.value.delete(userId);
};

const toggleSelectAll = (isChecked) => {
  if (isChecked) {
    pagedUsers.value.forEach(user => selectedUserIds.value.add(user.id));
  } else {
    selectedUserIds.value.clear();
  }
};

// 生命周期：初始化加载数据
onMounted(() => {
  fetchUsers();
});

// 数据加载（获取全量数据）
const fetchUsers = async () => {
  loading.value = true;
  try {
    rawUsers.value = await adminStore.getUsers(); // 假设此处返回全量用户数组
    errorMessage.value = '';
  } catch (error) {
    console.error('获取用户列表失败:', error);
    errorMessage.value = '获取用户列表失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 分页控制
const prevPage = () => currentPage.value > 1 && (currentPage.value--);
const nextPage = () => currentPage.value < totalPages.value && (currentPage.value++);
const gotoPage = (page) => currentPage.value !== page && (currentPage.value = page);

// 路由跳转
const editUser = (userId) => router.push({ name: 'admin-edit-user', params: { id: userId } });
const createUser = () => router.push({ name: 'admin-create-user' });

// 删除相关逻辑
const deleteUser = (userId) => {
  userIdToDelete.value = userId;
  showDeleteModal.value = true;
};

const deleteSelectedUsers = () => {
  const selectedCount = selectedUserIds.value.size;
  if (selectedCount === 0) {
    alert('请选择要删除的用户');
    return;
  }
  if (confirm(`确定要删除选中的 ${selectedCount} 个用户吗？此操作不可撤销`)) {
    const idsArray = Array.from(selectedUserIds.value);
    const deleteSequentially = async () => {
      for (const id of idsArray) {
        try {
          await adminStore.deleteUser(id);
          selectedUserIds.value.delete(id); // 删除后立即从选中集合移除
        } catch (error) {
          console.error(`删除用户 ${id} 失败:`, error);
        }
      }
      fetchUsers(); // 重新加载全量数据（包含删除后的结果）
    };
    deleteSequentially();
  }
};

const confirmDelete = async () => {
  if (!userIdToDelete.value) return;
  showDeleteModal.value = false;
  try {
    await adminStore.deleteUser(userIdToDelete.value);
    fetchUsers(); // 重新加载数据
    alert('用户删除成功');
  } catch (error) {
    console.error('删除用户失败:', error);
    errorMessage.value = '删除用户失败，请重试';
    alert('删除用户失败，请重试');
  }
};
</script>

<style scoped>
/* 自定义样式（如果需要） */
</style>
