export {}

declare global {
  interface UserPublicMetadata {
    role?: 'admin' | 'owner' | 'editor'
  }
}
