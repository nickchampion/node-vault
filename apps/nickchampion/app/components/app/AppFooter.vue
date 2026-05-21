<template>
  <UFooter class="z-10">
    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} Nick Champion
      </p>
    </template>

    <template #right>
      <AppLogo class="size-8" />
    </template>
  </UFooter>
</template>
