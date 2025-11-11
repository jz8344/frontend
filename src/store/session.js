import { ref } from 'vue';

export const usuario = ref(
  localStorage.getItem('usuario')
    ? JSON.parse(localStorage.getItem('usuario'))
    : null
);

export const admin = ref(
  localStorage.getItem('admin')
    ? JSON.parse(localStorage.getItem('admin'))
    : null
);

export function loginUsuario(user) {
  usuario.value = user;
  localStorage.setItem('usuario', JSON.stringify(user));
}

export function logoutUsuario() {
  usuario.value = null;
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
}

export function loginAdmin(adminUser) {
  admin.value = adminUser;
  localStorage.setItem('admin', JSON.stringify(adminUser));
}

export function logoutAdmin() {
  admin.value = null;
  localStorage.removeItem('admin');
  localStorage.removeItem('admin_token');
}