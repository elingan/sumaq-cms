export const useRole = () => {
  const { user } = useUser()

  const role = useState<'admin' | 'owner' | 'editor'>('user-role', () => {
    return (user.value?.publicMetadata?.role as 'admin' | 'owner' | 'editor') || 'owner'
  })

  // Forzar actualización cuando el usuario cambie
  watch(() => user.value?.publicMetadata?.role, (newRole) => {
    if (newRole) {
      role.value = newRole as 'admin' | 'owner' | 'editor'
    }
  }, { immediate: true })

  const isAdmin = computed(() => role.value === 'admin')
  const isOwner = computed(() => role.value === 'owner')
  const isEditor = computed(() => role.value === 'editor')

  return {
    role,
    isAdmin,
    isOwner,
    isEditor,
  }
}
