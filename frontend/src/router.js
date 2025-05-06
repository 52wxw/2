import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './store/modules/user';

// 导入页面组件
import Login from './components/Pages/Login.vue';
import Register from './components/Pages/Register.vue';
import TaskList from './components/Pages/TaskList.vue';
import Home from './components/Pages/Home.vue';
import TaskDetail from './components/Pages/TaskDetail.vue';
import Ranking from './components/Pages/Ranking.vue';
import Profile from './components/Pages/Profile.vue';
import AdminDashboard from './components/Pages/AdminDashboard.vue';
import EditProfile from './components/Pages/EditProfile.vue';
import NotFound from './components/Pages/NotFound.vue';
import AdminUsersView from './views/AdminUsersView.vue';
import AdminCreateUsersView from './views/AdminCreateUserView.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { auth: false } },
  { path: '/login', component: Login, meta: { auth: false } },
  { path: '/register', component: Register, meta: { auth: false } },
  { path: '/tasks', component: TaskList, meta: { auth: true } },
  { path: '/tasks/:id', component: TaskDetail, name: 'TaskDetail', meta: { auth: true } },
  { path: '/ranking', component: Ranking, meta: { auth: true } },
  { path: '/profile', component: Profile, meta: { auth: true } },
  { path: '/profile/edit', component: EditProfile, name: 'EditProfile', meta: { auth: true } },
  { path: '/admin', component: AdminDashboard, meta: { auth: true, admin: true } },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
  {
    path: '/admin/users',
    name: 'AdminUsersView',
    component: AdminUsersView,
    meta: { auth: true, admin: true } // 假设该页面需要管理员权限
  },
  {
    path: '/admin/users/create',
    name: 'admin-create-user',
    component: AdminCreateUsersView,
    meta: { auth: true, admin: true }
  },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

// 全局前置守卫（权限验证核心逻辑）
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const start = Date.now(); // 性能追踪

  try {
    // 1. 初始化用户信息（确保登录状态和角色已加载）
    if (!userStore.user) {
      await userStore.init(); // 等待用户信息初始化
    }

    // 2. 解析用户角色（关键：从 roles 数组获取 name 字段）
    const userRole = 
      userStore.user?.roles?.[0]?.name || // 优先使用角色名称
      'USER'; // 默认值（防止 undefined）

    // 3. 权限验证参数
    const requiresAuth = to.meta.auth || false;
    const requiresAdmin = to.meta.admin || false;
    const isLoggedIn = !!userStore.user; // 用户对象存在即视为已登录

    // 4. 详细日志（调试用）
    console.groupCollapsed(`[权限验证] 访问 ${to.path}`);
    console.log(`  元信息: ${JSON.stringify(to.meta)}`);
    console.log(`  用户状态: 已登录=${isLoggedIn}, 角色=${userRole}`);
    console.log(`  权限需求: 登录=${requiresAuth}, 管理员=${requiresAdmin}`);
    console.log(`  用户对象:`, userStore.user); // 打印完整用户对象（调试用）

    // 5. 权限验证逻辑
    if (requiresAuth && !isLoggedIn) {
      console.log(`  ❌ 未登录，重定向到 /login`);
      next('/login');
    } else if (requiresAdmin && userRole !== 'ROLE_ADMIN') {
      console.log(`  ❌ 非管理员（角色: ${userRole}），重定向到 /tasks`);
      next('/tasks');
    } else {
      console.log(`  ✅ 权限通过，耗时 ${Date.now() - start}ms`);
      next();
    }

  } catch (error) {
    console.error('[权限验证错误]', error);
    next('/login'); // 清除无效状态
  } finally {
    console.groupEnd();
  }
});

export default router;
