<template>
  <div class="bg-white min-h-screen flex flex-col">
    <AppHeader :links="navLinks" />

    <UMain class="flex-1">
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navLinks: NavigationMenuItem[] = [
  { label: 'Home', to: '/' },
  { label: 'CV', to: '/cv' },
  { label: 'Projects', to: '/nodevault' },
  { label: 'Contact', to: '/contact' },
]
</script>
