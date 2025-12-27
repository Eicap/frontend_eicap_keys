export const breadcrumb = {
    dashboard: { label: 'Dashboard', path: '/dashboard' },
    users: { label: 'Usuarios', path: '/users' },
    user: (userId: string, userName: string) => ({ label: userName, path: `/users/${userId}` }),
}