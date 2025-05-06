<template>
  <div class="bg-gray-900 min-h-screen">
    <!-- 顶部导航栏 -->
    <header class="bg-gradient-to-r from-purple-700 to-blue-700 shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-crown text-yellow-400 text-xl"></i>
          <h1 class="text-white font-bold text-xl">Admin Dashboard</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="logout" class="text-white hover:text-yellow-400 transition-colors">
            <i class="fa-solid fa-sign-out-alt mr-1"></i>
            <span>{{ $t('common.logout') }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="p-6 bg-gray-900">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h2 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-white mb-2">
          {{ $t('adminDashboard.welcome') }}: {{ user.username || 'Admin' }}
        </h2>
        <p class="text-gray-400">{{ $t('adminDashboard.description') }}</p>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 用户统计 -->
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 text-sm font-medium">{{ $t('admin.totalUsers') }}</h3>
            <span class="text-gray-400">
              <i class="fa-solid fa-users"></i>
            </span>
          </div>
          <div class="flex items-end justify-between">
            <p class="text-3xl font-bold text-white">{{ totalUsers }}</p>
            <span class="text-green-500 text-sm">
              <i class="fa-solid fa-arrow-up"></i> 12%
            </span>
          </div>
          <p class="text-gray-500 text-xs mt-2">
            {{ $t('admin.sinceLastMonth') }}
          </p>
        </div>

        <!-- 任务统计 -->
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 text-sm font-medium">{{ $t('admin.totalTasks') }}</h3>
            <span class="text-gray-400">
              <i class="fa-solid fa-tasks"></i>
            </span>
          </div>
          <div class="flex items-end justify-between">
            <p class="text-3xl font-bold text-white">{{ totalTasks }}</p>
            <span class="text-red-500 text-sm">
              <i class="fa-solid fa-arrow-down"></i> 3%
            </span>
          </div>
          <p class="text-gray-500 text-xs mt-2">
            {{ $t('admin.sinceLastMonth') }}
          </p>
        </div>

        <!-- 系统 CPU 使用率统计 -->
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 text-sm font-medium">{{ $t('admin.cpuUsage') }}</h3>
            <span class="text-gray-400">
              <i class="fa-solid fa-microchip"></i>
            </span>
          </div>
          <div class="flex items-end justify-between">
            <p class="text-3xl font-bold text-white">{{ cpuUsage }}%</p>
            <span :class="[{ 'text-green-500': cpuUsage < 80, 'text-red-500': cpuUsage >= 80 }, 'text-sm']">
              <i :class="{'fa-solid fa-arrow-up': cpuUsageTrend > 0, 'fa-solid fa-arrow-down': cpuUsageTrend < 0}"></i> {{ cpuUsageTrend }}%
            </span>
          </div>
          <p class="text-gray-500 text-xs mt-2">
            {{ $t('admin.past7Days') }}
          </p>
        </div>

        <!-- 系统内存使用率统计 -->
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 transform hover:scale-105 transition-transform">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-gray-400 text-sm font-medium">{{ $t('admin.memoryUsage') }}</h3>
            <span class="text-gray-400">
              <i class="fa-solid fa-memory"></i>
            </span>
          </div>
          <div class="flex items-end justify-between">
            <p class="text-3xl font-bold text-white">{{ memoryUsage }}%</p>
            <span :class="[{ 'text-green-500': memoryUsage < 80, 'text-red-500': memoryUsage >= 80 }, 'text-sm']">
              <i :class="{'fa-solid fa-arrow-up': memoryUsageTrend > 0, 'fa-solid fa-arrow-down': memoryUsageTrend < 0}"></i> {{ memoryUsageTrend }}%
            </span>
          </div>
          <p class="text-gray-500 text-xs mt-2">
            {{ $t('admin.past7Days') }}
          </p>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 mb-8">
        <div class="p-6 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">{{ $t('admin.recentActivities') }}</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-blue-500 rounded-full p-2">
                <i class="fa-solid fa-user-plus text-white"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-300">
                  <span class="font-medium text-white">{{ $t('admin.Numberofusers') }}:</span>
                  <span class="text-blue-400">john_doe</span>
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-green-500 rounded-full p-2">
                <i class="fa-solid fa-tasks text-white"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-300">
                  <span class="font-medium text-white">{{ $t('admin.Numberoftasks') }}:</span>
                  <span class="text-blue-400">Design homepage</span>
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-yellow-500 rounded-full p-2">
                <i class="fa-solid fa-exclamation-triangle text-white"></i>
              </div>
              <div class="ml-4">
                <p class="text-gray-300">
                  <span class="font-medium text-white">{{ $t('admin.Systemwarnings') }}:</span>
                  <span class="text-blue-400">High CPU usage detected</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户管理表格 -->
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 mb-8">
        <div class="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white">{{ $t('admin.users') }}</h3>
          <div class="flex space-x-3">
            <button
              @click="openAddUserModal"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i class="fa-solid fa-plus mr-2"></i>
              {{ $t('admin.addUser') }}
            </button>
            <button
              @click="confirmClearScores"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i class="fa-solid fa-trash mr-2"></i>
              {{ $t('admin.clearAllScores') }}
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.avatar') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.username') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.email') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.role') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.score') }}
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full" :src="user.avatar || 'https://picsum.photos/200/200?random=' + user.id" alt="User avatar">
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ user.username }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-400">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-blue-100 text-blue-800': user.role === 'admin',
                          'bg-green-100 text-green-800': user.role === 'user',
                          'bg-yellow-100 text-yellow-800': user.role ==='moderator'
                        }">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-green-100 text-green-800': user.status === 'active',
                          'bg-red-100 text-red-800': user.status === 'inactive',
                          'bg-yellow-100 text-yellow-800': user.status === 'pending'
                        }">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ user.score || 0 }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editUser(user.id)" class="text-blue-400 hover:text-blue-600 mr-3">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button @click="deleteUser(user.id)" class="text-red-400 hover:text-red-600">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-6 border-t border-gray-700">
          <button @click="openViewAllUsers" class="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors">
            {{ $t('admin.viewAllUsers') }}
          </button>
        </div>
      </div>

      <!-- 任务管理模块 -->
      <div class="bg-gray-800 rounded-lg shadow-lg border border-gray-700 mb-8">
        <div class="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white">{{ $t('admin.taskManagement') }}</h3>
          <button
            @click="openAddTaskModal"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i class="fa-solid fa-plus mr-2"></i>
            {{ $t('admin.addTask') }}
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.taskTitle') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.description') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.category') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.dueDate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.status') }}
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {{ $t('admin.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-white">{{ task.title }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-400 truncate max-w-xs">{{ task.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-400">
                    {{ task.category === 'privateCloud' ? $t('admin.privateCloud') : 
                       task.category === 'containerCloud' ? $t('admin.containerCloud') : 
                       task.category === 'publicCloud' ? $t('admin.publicCloud') : task.category }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-400">{{ formatDate(task.dueDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-gray-100 text-gray-800': task.status === 'pending',
                          'bg-blue-100 text-blue-800': task.status === 'inProgress',
                          'bg-green-100 text-green-800': task.status === 'completed',
                          'bg-red-100 text-red-800': task.status === 'cancelled'
                        }">
                    {{ $t(`admin.${task.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editTask(task.id)" class="text-blue-400 hover:text-blue-600 mr-3">
                    <i class="fa-solid fa-pencil"></i>
                  </button>
                  <button @click="confirmDeleteTask(task.id)" class="text-red-400 hover:text-red-600">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-6 border-t border-gray-700">
          <button
            @click="openViewAllTasks"
            class="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors"
          >
            {{ $t('admin.viewAllTasks') }}
          </button>
        </div>
      </div>

      <!-- 添加用户模态框 -->
      <div v-if="addUserModalVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div class="p-6 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white">
              {{ $t('admin.addUser') }}
            </h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="addUser">
              <div class="mb-4">
                <label for="username" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.username') }}
                </label>
                <input
                  type="text"
                  id="username"
                  v-model="newUser.username"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                >
              </div>
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.email') }}
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="newUser.email"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                >
              </div>
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.password') }}
                </label>
                <input
                  type="password"
                  id="password"
                  v-model="newUser.password"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                >
              </div>
              <div class="mb-4">
                <label for="role" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.role') }}
                </label>
                <select
                  id="role"
                  v-model="newUser.role"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">{{ $t('admin.admin') }}</option>
                  <option value="user">{{ $t('admin.user') }}</option>
                  <option value="moderator">{{ $t('admin.moderator') }}</option>
                </select>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeAddUserModal"
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {{ $t('common.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 添加任务模态框 -->
      <div v-if="addTaskModalVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div class="p-6 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white">
              {{ $t('admin.addTask') }}
            </h3>
          </div>
          <div class="p-6">
            <form @submit.prevent="addTask">
              <div class="mb-4">
                <label for="title" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.taskTitle') }}
                </label>
                <input
                  type="text"
                  id="title"
                  v-model="newTask.title"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                >
              </div>
              <div class="mb-4">
                <label for="description" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.description') }}
                </label>
                <textarea
                  id="description"
                  v-model="newTask.description"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                ></textarea>
              </div>
              <div class="mb-4">
                <label for="category" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.category') }}
                </label>
                <select
                  id="category"
                  v-model="newTask.category"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="privateCloud">{{ $t('admin.privateCloud') }}</option>
                  <option value="containerCloud">{{ $t('admin.containerCloud') }}</option>
                  <option value="publicCloud">{{ $t('admin.publicCloud') }}</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="dueDate" class="block text-sm font-medium text-gray-400 mb-1">
                  {{ $t('admin.dueDate') }}
                </label>
                <input
                  type="date"
                  id="dueDate"
                  v-model="newTask.dueDate"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeAddTaskModal"
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {{ $t('common.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 确认清空分数模态框 -->
      <div v-if="confirmClearModalVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div class="p-6 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white">
              {{ $t('admin.confirmClearScores') }}
            </h3>
          </div>
          <div class="p-6">
            <p class="text-gray-300 mb-6">
              {{ $t('admin.confirmClearScoresMessage') }}
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="cancelClearScores"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="clearAllScores"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                {{ $t('common.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 确认删除任务模态框 -->
      <div v-if="confirmDeleteModalVisible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
          <div class="p-6 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white">
              {{ $t('admin.confirmDeleteTask') }}
            </h3>
          </div>
          <div class="p-6">
            <p class="text-gray-300 mb-6">
              {{ $t('admin.confirmDeleteTaskMessage') }}
            </p>
            <div class="flex justify-end space-x-3">
              <button
                @click="cancelDeleteTask"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="deleteSelectedTask"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                {{ $t('common.confirm') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useAdminStore } from '@/store/modules/admin';

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();

// 获取用户信息
const user = computed(() => userStore.user);

// 数据统计
const totalUsers = ref(0);
const totalTasks = ref(0);
const cpuUsage = ref(0);
const cpuUsageTrend = ref(0);
const memoryUsage = ref(0);
const memoryUsageTrend = ref(0);

// 列表数据
const users = ref([]);
const tasks = ref([]);

// 模态框状态
const addUserModalVisible = ref(false);
const addTaskModalVisible = ref(false);
const confirmClearModalVisible = ref(false);
const confirmDeleteModalVisible = ref(false);
const selectedTaskId = ref(null);

// 表单数据
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
});

const newTask = ref({
  title: '',
  description: '',
  category: '',
  dueDate: '',
  status: 'pending',
  answer: ''
});

// 页面加载时初始化数据
onMounted(async () => {
  try {
    // 检查用户权限
    if (!userStore.isAdmin) {
      router.push('/');
      return;
    }
    
    // 获取统计数据
    const stats = await adminStore.getStatistics();
    totalUsers.value = stats.totalUsers;
    totalTasks.value = stats.totalTasks;
    cpuUsage.value = stats.cpuUsage;
    cpuUsageTrend.value = stats.cpuUsageTrend;
    memoryUsage.value = stats.memoryUsage;
    memoryUsageTrend.value = stats.memoryUsageTrend;
    
    // 获取用户列表
    users.value = await adminStore.fetchUsers();
    
    // 获取任务列表
    tasks.value = await adminStore.fetchUsers();
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    alert('Failed to load admin dashboard. Please try again later.');
  }
});

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// 退出登录
const logout = () => {
  userStore.logout();
  router.push('/login');
};

// 打开添加用户模态框
const openAddUserModal = () => {
  addUserModalVisible.value = true;
};

// 关闭添加用户模态框
const closeAddUserModal = () => {
  addUserModalVisible.value = false;
  newUser.value = {
    username: '',
    email: '',
    password: '',
    role: 'user'
  };
};

// 打开添加任务模态框
const openAddTaskModal = () => {
  addTaskModalVisible.value = true;
};

// 关闭添加任务模态框
const closeAddTaskModal = () => {
  addTaskModalVisible.value = false;
  newTask.value = {
    title: '',
    description: '',
    category: '',
    dueDate: '',
    status: 'pending',
    answer: ''
  };
};

// 添加用户
const addUser = async () => {
  try {
    if (!newUser.value.username || !newUser.value.email || !newUser.value.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    // 调用 API 添加用户
    await adminStore.addUser(newUser.value);
    
    // 更新用户列表
    users.value = await adminStore.getUsers();
    
    // 关闭模态框
    closeAddUserModal();
    
    // 显示成功消息
    alert('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Failed to add user. Please try again.');
  }
};

// 添加任务
const addTask = async () => {
  try {
    // 验证表单
    if (!newTask.value.title || !newTask.value.description || !newTask.value.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // 调用 API 添加任务
    await adminStore.addTask(newTask.value);
    
    // 更新任务列表
    tasks.value = await adminStore.getTasks();
    
    // 更新任务统计
    const stats = await adminStore.getStatistics();
    totalTasks.value = stats.totalTasks;
    
    // 关闭模态框
    closeAddTaskModal();
    
    // 显示成功消息
    alert('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Failed to add task. Please try again.');
  }
};

// 编辑用户
const editUser = (userId) => {
  router.push({ name: 'EditUser', params: { id: userId } });
};

// 编辑任务
const editTask = (taskId) => {
  router.push({ name: 'EditTask', params: { id: taskId } });
};

// 查看所有用户
const openViewAllUsers = () => {
  router.push('/admin/users');
};

// 查看所有任务
const openViewAllTasks = () => {
  router.push({ name: 'admin-tasks' });
};

// 确认清空分数
const confirmClearScores = () => {
  confirmClearModalVisible.value = true;
};

// 取消清空分数
const cancelClearScores = () => {
  confirmClearModalVisible.value = false;
};

// 清空所有分数
const clearAllScores = async () => {
  try {
    await adminStore.clearAllScores();
    
    // 更新用户列表
    users.value = await adminStore.getUsers();
    
    // 关闭模态框
    confirmClearModalVisible.value = false;
    
    // 显示成功消息
    alert('All scores have been cleared');
  } catch (error) {
    console.error('Error clearing scores:', error);
    alert('Failed to clear scores. Please try again.');
  }
};

// 确认删除任务
const confirmDeleteTask = (taskId) => {
  selectedTaskId.value = taskId;
  confirmDeleteModalVisible.value = true;
};

// 取消删除任务
const cancelDeleteTask = () => {
  selectedTaskId.value = null;
  confirmDeleteModalVisible.value = false;
};

// 删除选中的任务
const deleteSelectedTask = async () => {
  try {
    if (!selectedTaskId.value) return;
    
    await adminStore.deleteTask(selectedTaskId.value);
    
    // 更新任务列表
    tasks.value = tasks.value.filter(task => task.id !== selectedTaskId.value);
    
    // 更新任务统计
    const stats = await adminStore.getStatistics();
    totalTasks.value = stats.totalTasks;
    
    // 关闭模态框
    confirmDeleteModalVisible.value = false;
    selectedTaskId.value = null;
    
    // 显示成功消息
    alert('Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task. Please try again.');
  }
};

// 删除用户
const deleteUser = async (userId) => {
  try {
    if (confirm('Are you sure you want to delete this user?')) {
      await adminStore.deleteUser(userId);
      
      // 更新用户列表
      users.value = users.value.filter(user => user.id !== userId);
      
      // 更新用户统计
      const stats = await adminStore.getStatistics();
      totalUsers.value = stats.totalUsers;
      
      // 显示成功消息
      alert('User deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Failed to delete user. Please try again.');
  }
};
</script>

<style scoped>
/* 全局样式 */
body {
  font-family: 'Inter', system-ui, sans-serif;
}

/* 统计卡片悬停效果 */
.bg-gray-800:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

/* 按钮过渡效果 */
button {
  transition: all 0.2s ease;
}

/* 表格行悬停效果 */
tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 输入框焦点效果 */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* 加载动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
