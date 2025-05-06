<template>
  <div class="bg-gray-900 min-h-screen text-gray-100">
    <!-- 页面标题 -->
    <div class="p-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">用户管理</h2>
        <button 
          @click="createUser" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <i class="fa fa-plus mr-2"></i>创建用户
        </button>
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
            <option value="ROLE_USER">普通用户</option>
            <option value="ROLE_ADMIN">管理员</option>
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

    <!-- 用户列表 -->
    <div class="bg-gray-800 p-6 rounded-lg mx-6 mb-6 shadow-lg overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              <input type="checkbox" class="rounded text-blue-500 focus:ring-blue-500">
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
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700/50 transition-colors">
            <td class="px-4 py-3 whitespace-nowrap">
              <input type="checkbox" class="rounded text-blue-500 focus:ring-blue-500">
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
                  'bg-blue-100 text-blue-800': user.role === 'ROLE_ADMIN',
                  'bg-gray-100 text-gray-800': user.role === 'ROLE_USER'
                }"
              >
                {{ user.role === 'ROLE_ADMIN' ? '管理员' : '普通用户' }}
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
              {{ formatDate(user.createTime) }}
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
              'px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-gray-600': page !== currentPage
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

// 状态管理
const users = ref([]);
const totalUsers = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const searchQuery = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const loading = ref(false);
const showDeleteModal = ref(false);
const userIdToDelete = ref(null);

// 计算属性：分页页码
const pages = computed(() => {
  const pages = [];
  const maxPages = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
  let endPage = startPage + maxPages - 1;
  
  if (endPage > totalPages.value) {
    endPage = totalPages.value;
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// 生命周期钩子
onMounted(() => {
  fetchUsers();
});

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      keyword: searchQuery.value,
      role: roleFilter.value,
      enabled: statusFilter.value === 'enabled' ? true : statusFilter.value === 'disabled' ? false : undefined
    };
    
    // 修改为调用 fetchUsers 方法
    const response = await adminStore.fetchUsers(params); 
    users.value = response.content;
    totalUsers.value = response.totalElements;
    totalPages.value = Math.ceil(totalUsers.value / pageSize.value);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    alert('获取用户列表失败，请重试');
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

// 分页控制
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchUsers();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchUsers();
  }
};

const gotoPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchUsers();
  }
};

// 编辑用户
const editUser = (userId) => {
  router.push({ name: 'admin-edit-user', params: { id: userId } });
};

// 创建用户
const createUser = () => {
  router.push({ name: '/admin/users/create' });
};

// 删除用户
const deleteUser = (userId) => {
  userIdToDelete.value = userId;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!userIdToDelete.value) return;
  
  showDeleteModal.value = false;
  
  try {
    await adminStore.deleteUser(userIdToDelete.value);
    fetchUsers(); // 刷新列表
    alert('用户删除成功');
  } catch (error) {
    console.error('删除用户失败:', error);
    alert('删除用户失败，请重试');
  }
};
</script>

<style scoped>
/* 自定义样式（如果需要） */
</style>
