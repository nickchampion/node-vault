<template>
  <UFooter class="z-10">
    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} Nick Champion
      </p>
    </template>

    <template #right>
      <div class="flex items-center gap-3">
        <UButton
          href="https://github.com/nickchampion"
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          color="neutral"
          size="sm"
          icon="i-simple-icons-github"
          aria-label="GitHub" />

        <AppLogo class="size-8" />
      </div>
    </template>
  </UFooter>
</template>
