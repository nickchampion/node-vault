<template>
  <UFooter class="z-10">
    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} NodeVault
      </p>
    </template>

    <div class="flex items-center gap-5">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="text-sm text-muted hover:text-default transition-colors">
        {{ link.label }}
      </NuxtLink>
    </div>

    <template #right>
      <AppLogo class="size-8" />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
const links = [
  { label: 'About Us', to: '/company/about' },
  { label: 'Contact', to: '/company/contact' },
  { label: 'Privacy Policy', to: '/company/privacy' },
]
</script>
