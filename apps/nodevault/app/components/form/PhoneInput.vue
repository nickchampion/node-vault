<template>
  <div class="flex gap-2">
    <USelect
      v-model="countryCode"
      :items="countryItems"
      class="w-36 shrink-0" />

    <UInput
      v-model="number"
      type="tel"
      placeholder="7700 900000"
      class="flex-1" />
  </div>
</template>

<script setup lang="ts">
import { Countries } from '@nodevault/platform.components.domain'

type PhoneValue = { countryCode: string, number: string } | undefined

const model = defineModel<PhoneValue>()

const countryItems = Countries.map(c => ({
  label: `${flag(c.iso)} ${c.countryCode}`,
  value: c.countryCode,
}))

const countryCode = computed({
  get: () => model.value?.countryCode ?? Countries[0]?.countryCode ?? '',
  set: (v) => { model.value = { countryCode: v, number: model.value?.number ?? '' } },
})

const number = computed({
  get: () => model.value?.number ?? '',
  set: (v) => {
    if (!v) {
      model.value = undefined
      return
    }

    model.value = { countryCode: countryCode.value, number: v }
  },
})

function flag(iso: string): string {
  return [...iso.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('')
}
</script>
