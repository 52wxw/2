<!-- src/components/Pages/Dashboard.vue -->
<template>
  <div class="min-h-screen bg-dark-bg text-white">
    <nav class="bg-sub-bg p-4 mb-8">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-xl font-bold">
          {{ $t('dashboard.title') }}
        </div>
        <div>
          <button 
            @click="handleLogout" 
            class="text-primary hover:underline"
          >
            {{ $t('dashboard.logout') }}
          </button>
        </div>
      </div>
    </nav>

    <div class="container mx-auto p-8">
      <h2 class="text-2xl font-bold mb-4">
        {{ $t('dashboard.welcome') }}
      </h2>
      <!-- 这里添加用户专属内容，如订单列表、数据统计等 -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const handleLogout = async () => {
  try {
    await axios.post('/api/logout');
    router.push('/');
  } catch (error) {
    console.error('登出失败:', error);
  }
};
</script>
