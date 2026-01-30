// Helper para verificar si una ruta coincide con un patrón
function matchesRoute(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    const regex = new RegExp(pattern.replace('(.*)', '.*'))
    return regex.test(path)
  })
}

// Define las rutas protegidas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/billing',
  '/notifications',
  '/settings',
  '/site',
  '/profile',
  '/admin'
]

// Define las rutas de autenticación (login, register)
const authRoutes = ['/login', '/forgot-password', '/reset-password']

export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession()

  const currentPath = to.path

  // Si el usuario está autenticado y trata de acceder a login/register,
  // redirigir al dashboard
  if (loggedIn.value && matchesRoute(currentPath, authRoutes)) {
    return navigateTo('/dashboard')
  }

  // Si el usuario NO está autenticado y trata de acceder a una ruta protegida,
  // redirigir al login
  if (!loggedIn.value && matchesRoute(currentPath, protectedRoutes)) {
    return navigateTo('/login')
  }
})
