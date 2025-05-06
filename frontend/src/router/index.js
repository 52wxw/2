import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/modules/user';

// 路由懒加载
import Home from '../components/Pages/Home.vue';
const TaskListView = () => import('../views/TaskListView.vue');
const TaskDetailView = () => import('../views/TaskDetailView.vue');
const SubmitFlagView = () => import('../views/SubmitFlagView.vue');
const RankingView = () => import('../views/RankingView.vue');
const TeamView = () => import('../views/TeamView.vue');
const ProfileView = () => import('../views/ProfileView.vue');
const EditProfileView = () => import('../views/EditProfileView.vue');
const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');
const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue');
const AdminTasksView = () => import('../views/admin/AdminTasksView.vue');
const AdminCreateTaskView = () => import('../views/admin/AdminCreateTaskView.vue');
const AdminEditTaskView = () => import('../views/admin/AdminEditTaskView.vue');
const AdminUsersView = () => import('../views/admin/AdminUsersView.vue');
const AdminSubmissionsView = () => import('../views/admin/AdminSubmissionsView.vue');
const NotFoundView = () => import('../views/NotFoundView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskListView
    },
    {
      path: '/tasks/:id',
      name: 'task-detail',
      component: TaskDetailView,
      props: true
    },
    {
      path: '/tasks/:id/submit',
      name: 'submit-flag',
      component: SubmitFlagView,
      props: true
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: RankingView
    },
    {
      path: '/teams',
      name: 'teams',
      component: TeamView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'edit-profile',
      component: EditProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/tasks',
      name: 'admin-tasks',
      component: AdminTasksView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/tasks/create',
      name: 'admin-create-task',
      component: AdminCreateTaskView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/tasks/:id/edit',
      name: 'admin-edit-task',
      component: AdminEditTaskView,
      props: true,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/submissions',
      name: 'admin-submissions',
      component: AdminSubmissionsView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ],

  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 全局前置守卫（依赖 userStore.isAdmin，该 getter 已在 user.js 中修正）
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;
  const isAdmin = userStore.isAdmin; // ✅ 直接使用修正后的 getter

  // 认证检查（已有逻辑正确）
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  // 管理员权限检查（依赖正确的角色判断逻辑）
  if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'home' });
    return;
  }

  next();
});

export default router;
