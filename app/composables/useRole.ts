export const useRole = () => {
  const { user } = useUser()

  const role = useState<'admin' | 'owner' | 'editor'>('user-role', () => {
    return (user.value?.publicMetadata?.role as 'admin' | 'owner' | 'editor') || 'owner'
  })

  watch(user, (newUser) => {
    role.value = (newUser?.publicMetadata?.role as 'admin' | 'owner' | 'editor') || 'owner'
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
