<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
    <UContainer class="flex items-center justify-between gap-4 h-16">
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5 shrink-0">
        <AppLogo class="size-8" />

        <span class="font-semibold text-sm tracking-tight text-slate-900">Nick Champion</span>
      </NuxtLink>

      <UNavigationMenu
        :items="links"
        variant="link"
        color="primary"
        class="hidden sm:flex" />

      <div class="flex items-center gap-2 shrink-0">
        <UButton
          href="https://github.com/nickchampion"
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          class="hidden sm:flex" />

        <UButton
          to="/contact"
          variant="solid"
          color="primary"
          size="sm"
          class="hidden sm:flex"
          icon="i-lucide-mail">
          Get in touch
        </UButton>

        <UButton
          class="flex sm:hidden"
          variant="ghost"
          color="primary"
          :icon="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen" />
      </div>
    </UContainer>
  </header>

  <USlideover
    v-model:open="mobileOpen"
    side="right"
    :ui="{ content: 'w-64' }">
    <template #content>
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-4 h-16 border-b border-slate-200 shrink-0">
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5"
            @click="mobileOpen = false">
            <AppLogo class="size-8" />

            <span class="font-semibold text-sm tracking-tight">Nick Champion</span>
          </NuxtLink>

          <UButton
            variant="ghost"
            color="primary"
            icon="i-lucide-x"
            aria-label="Close menu"
            @click="mobileOpen = false" />
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <UNavigationMenu
            :items="links"
            orientation="vertical"
            variant="link"
            color="primary"
            class="w-full" />
        </div>

        <div class="p-4 border-t border-slate-200 shrink-0">
          <UButton
            to="/contact"
            variant="outline"
            color="primary"
            icon="i-lucide-mail"
            class="w-full justify-center"
            @click="mobileOpen = false">
            Get in touch
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

const mobileOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>
