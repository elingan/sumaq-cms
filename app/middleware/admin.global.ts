
export default defineNuxtRouteMiddleware(async (to) => {
  // Solo aplicar a rutas que empiezan con /admin
  if (!to.path.startsWith('/admin')) return

  const { user } = useUserSession()

  // Si no es admin, fuera
  if (!user.value || user.value.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})
