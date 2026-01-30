export const useRole = () => {
  const { user } = useUserSession()

  const role = computed(() => {
    return user.value?.role || 'editor'
  })

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
