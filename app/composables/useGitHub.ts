export const useGitHub = () => {
  const connected = ref(false)
  const loading = ref(false)
  const githubUser = ref<{
    login: string
    avatarUrl: string
  } | null>(null)

  const checkConnection = async () => {
    loading.value = true
    try {
      const data = await $fetch<GitHubConnectionStatus>('/api/github/status')
      connected.value = data.connected
      if (data.connected && data.login) {
        githubUser.value = {
          login: data.login,
          avatarUrl: data.avatarUrl!
        }
      }
    } catch (error) {
      console.error('Error checking GitHub connection:', error)
    } finally {
      loading.value = false
    }
  }

  const connect = () => {
    window.location.href = '/api/github/connect'
  }

  const disconnect = async () => {
    try {
      await $fetch('/api/github/disconnect', { method: 'POST' })
      connected.value = false
      githubUser.value = null
    } catch (error) {
      console.error('Error disconnecting GitHub:', error)
      throw error
    }
  }

  return {
    connected,
    loading,
    githubUser,
    checkConnection,
    connect,
    disconnect
  }
}
