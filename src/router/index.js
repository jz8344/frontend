import { auth, adminAuth } from '../middleware'; 
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'sobreNosotros',
    component: () => import('../views/About.vue') 
  },
  {
    path: '/rutas',
    name: 'Rutas',
    component: () => import('../views/Rutas.vue')
  },
  {
    path: '/aliados',
    name: 'Aliados',
    component: () => import('../views/Aliados.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
   {
     path: '/editar-perfil',
     name: 'EditarPerfil',
     meta: {
       middleware: [auth]
     },
     component: () => import('../views/EditarPerfil.vue'),
   },  

   {
     path: '/cambiar-email',
     name: 'ChangeEmail',
     component: () => import('../views/ChangeEmail.vue'),
     meta: { middleware: [auth] }
   },
   {
     path: '/cambiar-contrasena',
     name: 'ChangePass',
     component: () => import('../views/ChangePass.vue'),
     meta: { middleware: [auth] }
   },
   {
     path: '/cambiar-password',
     name: 'CambiarContrasena',
     component: () => import('../views/CambiarContrasena.vue'),
     meta: { middleware: [auth] }
   },
   {
     path: '/recuperar-password',
     name: 'RecuperarPassword',
     component: () => import('../components/RecuperarPassword.vue')
   },
   
   // Rutas de Administrador 
   {
     path: '/admin/login',
     name: 'AdminLogin',
     component: () => import('@/admin_frontend/AdminLogin.vue')
   },
   {
     path: '/admin/register',
     name: 'AdminRegister',
     component: () => import('@/admin_frontend/AdminRegister.vue')
   },
   {
     path: '/admin/dashboard',
     name: 'AdminDashboard',
     component: () => import('@/admin_frontend/AdminDashboard.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/usuarios',
     name: 'AdminUsers',
     component: () => import('@/admin_frontend/views/DynamicApp.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/perfil',
     name: 'AdminPerfil',
     component: () => import('@/admin_frontend/AdminPerfil.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/rutas',
     name: 'AdminRutas',
     component: () => import('@/admin_frontend/AdminRutas.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/hijos',
     name: 'AdminHijos',
     component: () => import('@/admin_frontend/AdminHijos.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/choferes',
     name: 'AdminChoferes',
     component: () => import('@/admin_frontend/AdminChoferes.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/unidades',
     name: 'AdminUnidades',
     component: () => import('@/admin_frontend/AdminUnidades.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/estadisticas',
     name: 'AdminEstadisticas',
     component: () => import('@/admin_frontend/AdminEstadisticas.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/configuracion',
     name: 'AdminConfiguracion',
     component: () => import('@/admin_frontend/AdminConfiguracion.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/backups',
     name: 'AdminBackups',
     component: () => import('@/admin_frontend/views/BackupManagement.vue'),
     meta: { middleware: [adminAuth] }
   },
   {
     path: '/admin/app/:app',
     name: 'DynamicApp',
     component: () => import('@/admin_frontend/views/DynamicApp.vue'),
     meta: { middleware: [adminAuth] },
     props: true
   }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.middleware) {
    const middlewares = to.meta.middleware;
    
    for (let i = 0; i < middlewares.length; i++) {
      const middleware = middlewares[i];
      
      const result = await new Promise((resolve) => {
        middleware(to, from, (path) => {
          resolve(path);
        });
      });
      
      if (result && result !== true) {
        next(result);
        return;
      }
    }
  }
  
  next();
});

export default router;
