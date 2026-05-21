<template>
  <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-default">
    <UContainer class="flex items-center justify-between gap-4 h-16">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 shrink-0">
        <AppLogo class="size-8" />

        <span class="font-semibold text-sm tracking-tight">Nick Champion</span>
      </NuxtLink>

      <UNavigationMenu
        :items="links"
        variant="link"
        color="neutral"
        class="hidden sm:flex" />

      <div class="flex items-center gap-2 shrink-0">
        <ClientOnly>
          <UButton
            :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
            variant="ghost"
            color="neutral"
            aria-label="Toggle colour mode"
            @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'" />
        </ClientOnly>

        <UButton
          class="flex sm:hidden"
          variant="ghost"
          color="neutral"
          :icon="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          aria-label="Toggle menu"
          @click="mobileOpen = true" />
      </div>
    </UContainer>
  </header>

  <USlideover
    v-model:open="mobileOpen"
    side="right"
    :ui="{ content: 'w-72' }">
    <template #content>
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-4 h-16 border-b border-default shrink-0">
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5"
            @click="mobileOpen = false">
            <AppLogo class="size-8" />

            <span class="font-semibold text-sm tracking-tight">NodeVault</span>
          </NuxtLink>

          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-x"
            aria-label="Close menu"
            @click="mobileOpen = false" />
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <UNavigationMenu
            :items="links"
            orientation="vertical"
            variant="link"
            color="neutral"
            class="w-full" />
        </div>

        <div class="p-4 border-t border-default shrink-0">
          <UButton
            to="/auth/login"
            variant="outline"
            color="neutral"
            icon="i-lucide-log-in"
            class="w-full justify-center"
            @click="mobileOpen = false">
            Sign in
          </UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const colorMode = useColorMode()
const mobileOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>
