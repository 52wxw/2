<template>
  <div class="min-h-screen bg-gradient-to-br from-dark-bg to-sub-bg p-4">
    <div class="container mx-auto text-center py-20">
      <!-- 增大标题文字大小：text-4xl → text-[clamp(2.5rem,5vw,4rem)] -->
      <h1 class="text-[clamp(2.5rem,5vw,4rem)] font-bold text-white mb-4">欢迎来到 406 实验平台</h1>
      
      <!-- 增大描述文字大小：text-lg → text-xl -->
      <p class="text-xl text-gray-400 mb-8">在这里，你可以参与各种有趣的竞赛和任务。</p>
      
      <div class="flex justify-center space-x-4">
        <router-link
          to="/login"
          class="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg py-2.5 px-6 transition-colors"
        >
          登录
        </router-link>
        <router-link
          to="/register"
          class="bg-sub-bg border border-gray-700 text-white font-medium rounded-lg py-2.5 px-6 transition-colors hover:bg-gray-700"
        >
          注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加首页的逻辑，如果有的话
</script>

<style scoped>
/* 可以在这里添加首页的样式 */
</style>
