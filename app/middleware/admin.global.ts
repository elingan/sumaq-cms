
export default defineNuxtRouteMiddleware((to) => {
  // Solo aplicar a rutas que empiezan con /admin
  if (!to.path.startsWith('/admin')) return

  const { isAdmin } = useRole()

  // Si no es admin, fuera
  if (!isAdmin.value) {
    return navigateTo('/dashboard')
  }
})
