export function auth (to, from, next) {
    if (!localStorage.getItem('token')) {
        next('/login');
    } else {
        next();
    }
}

export function adminAuth (to, from, next) {
    if (!localStorage.getItem('admin_token')) {
        next('/admin/login');
    } else {
        next();
    }
}