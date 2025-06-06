import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 创建 Pinia 实例
const pinia = createPinia();

// 配置持久化插件
pinia.use(piniaPluginPersistedstate);

export default pinia;
