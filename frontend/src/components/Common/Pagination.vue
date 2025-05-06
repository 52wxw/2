<template>
  <div class="pagination">
    <!-- 上一页按钮 -->
    <button
      :disabled="currentPage === 1"
      @click="prevPage"
      class="pagination-button"
    >
      上一页
    </button>

    <!-- 页码列表 -->
    <div class="pagination-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ 'active': page === currentPage }"
        @click="goToPage(page)"
        class="pagination-number"
      >
        {{ page }}
      </button>
    </div>

    <!-- 下一页按钮 -->
    <button
      :disabled="currentPage === totalPages"
      @click="nextPage"
      class="pagination-button"
    >
      下一页
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 接收父组件传递的参数
const props = defineProps({
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

// 计算总页数
const totalPages = ref(Math.ceil(props.totalItems / props.itemsPerPage));

// 上一页方法
const prevPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};

// 下一页方法
const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('update:currentPage', props.currentPage + 1);
  }
};

// 跳转到指定页码
const goToPage = (page) => {
  emit('update:currentPage', page);
};

// 定义自定义事件
const emit = defineEmits(['update:currentPage']);
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
}

.pagination-number {
  background-color: white;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-number.active {
  background-color: #007bff;
  color: white;
}
</style>
