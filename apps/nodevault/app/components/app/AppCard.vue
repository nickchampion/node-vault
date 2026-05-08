<template>
  <UCard class="flex flex-col gap-4 h-full">
    <div class="flex items-start gap-3">
      <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
        <UIcon
          :name="app.icon"
          class="size-5 text-primary" />
      </div>

      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-base leading-snug">
          {{ app.name }}
        </h3>

        <div class="flex items-center gap-1.5 mt-1 flex-wrap">
          <UBadge
            v-if="app.openSource"
            color="green"
            variant="subtle"
            size="xs"
            label="Open Source" />

          <UBadge
            v-if="app.free"
            color="neutral"
            variant="subtle"
            size="xs"
            label="Free" />
        </div>
      </div>
    </div>

    <p class="text-sm text-muted flex-1 pt-2 pb-2">
      {{ app.description }}
    </p>

    <ul class="space-y-1.5">
      <li
        v-for="feature in app.features"
        :key="feature"
        class="flex items-start gap-2 text-sm">
        <UIcon
          name="i-lucide-check-circle"
          class="size-4 text-primary shrink-0 mt-0.5" />

        <span>{{ feature }}</span>
      </li>
    </ul>

    <div
      v-if="app.tags?.length"
      class="flex items-center gap-1.5 flex-wrap pt-3 mt-3 border-t border-default">
      <UBadge
        v-for="tag in app.tags"
        :key="tag"
        color="neutral"
        variant="outline"
        size="xs"
        :label="tag" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface AppEntry {
  name: string
  icon: string
  description: string
  features: string[]
  openSource?: boolean
  free?: boolean
  tags?: string[]
}

defineProps<{ app: AppEntry }>()
</script>
