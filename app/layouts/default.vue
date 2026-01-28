<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <AppLogo class="w-auto h-6 shrink-0" />
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <SignedOut>
          <UButton to="/login" color="primary" variant="soft">
            Iniciar Sesión
          </UButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            user-profile-mode="navigation"
            user-profile-url="/profile"
          />
        </SignedIn>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <p>Sumaq Sites</p>
      </template>
    </UFooter>
  </div>
</template>
