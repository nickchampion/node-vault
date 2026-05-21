<template>
  <UPage>
    <UPageHero
      title="Compatible Devices"
      description="We work exclusively with Google Pixel devices. Pixel is the only Android hardware that allows the bootloader to be relocked after installing a custom OS — this is critical for verified boot and hardware-level security."
      align="center">
      <template #links>
        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-smartphone">
          Book Installation
        </UButton>

        <UButton
          to="/phones"
          size="xl"
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral">
          Back to Phone Service
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Supported Pixel Models"
      align="center">
      <div class="overflow-x-auto mt-4">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default text-left">
              <th class="pb-3 font-semibold pr-6">Device</th>
              <th class="pb-3 font-semibold pr-6">GrapheneOS</th>
              <th class="pb-3 font-semibold pr-6">CalyxOS</th>
              <th class="pb-3 font-semibold pr-6">/e/OS</th>
              <th class="pb-3 font-semibold">Notes</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-default">
            <tr
              v-for="device in devices"
              :key="device.model">
              <td class="py-3 font-medium pr-6">
                {{ device.model }}
              </td>

              <td class="py-3 pr-6">
                <UIcon
                  :name="device.graphene ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="device.graphene ? 'text-success' : 'text-muted'"
                  class="size-4" />
              </td>

              <td class="py-3 pr-6">
                <UIcon
                  :name="device.calyx ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="device.calyx ? 'text-success' : 'text-muted'"
                  class="size-4" />
              </td>

              <td class="py-3 pr-6">
                <UIcon
                  :name="device.eos ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="device.eos ? 'text-success' : 'text-muted'"
                  class="size-4" />
              </td>

              <td class="py-3 text-muted text-xs">
                {{ device.notes }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UCallout
        class="mt-6 text-left"
        icon="i-lucide-info"
        color="neutral">
        Don't have a compatible phone? We can supply a refurbished Pixel 8 or 9 — mention it when you get in touch.
      </UCallout>
    </UPageSection>

    <UPageSection
      title="Why Only Google Pixel?"
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="reason in reasons"
          :key="reason.title"
          :title="reason.title"
          :description="reason.description"
          :icon="reason.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-xl mx-auto text-center p-8 space-y-4">
        <h2 class="text-xl font-bold">
          Ready to book?
        </h2>

        <p class="text-muted text-sm">
          Tell us which device you have and which OS you're interested in.
        </p>

        <UButton
          to="/company/contact"
          size="lg"
          icon="i-lucide-arrow-right"
          trailing>
          Book an Installation
        </UButton>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Compatible Devices — GrapheneOS & CalyxOS | NodeVault',
  description: 'Google Pixel devices compatible with GrapheneOS, CalyxOS, and /e/OS installation. Pixel 6 through Pixel 9 supported.',
  ogTitle: 'Compatible Privacy Phone Devices | NodeVault',
  ogDescription: 'Full compatibility table for GrapheneOS, CalyxOS, and /e/OS installation across the Pixel 6–9 range.',
  keywords: 'GrapheneOS compatible phones, CalyxOS Pixel, privacy phone hardware, de-googled Android devices',
})

const devices = [
  { model: 'Pixel 6 / 6a / 6 Pro', graphene: true, calyx: true, eos: true, notes: 'Supported — approaching end of security update lifecycle' },
  { model: 'Pixel 7 / 7a / 7 Pro', graphene: true, calyx: true, eos: true, notes: 'Recommended budget option — full update support' },
  { model: 'Pixel 8 / 8a / 8 Pro', graphene: true, calyx: true, eos: true, notes: 'Recommended — longest remaining update window' },
  { model: 'Pixel 9 / 9 Pro / 9 Pro XL', graphene: true, calyx: false, eos: false, notes: 'GrapheneOS only — newest hardware generation' },
  { model: 'Pixel 9 Pro Fold', graphene: true, calyx: false, eos: false, notes: 'GrapheneOS only' },
]

const reasons = [
  {
    title: 'Bootloader Relocking',
    description: 'Google Pixel is the only Android device that allows the bootloader to be relocked after flashing a custom OS. Relocking enables verified boot — the hardware checks the OS signature on every startup, protecting against tampered software.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'Verified Boot',
    description: 'With a relocked bootloader, the phone verifies the entire OS on boot. This is a hardware security guarantee — not software. It means even a sophisticated attacker cannot modify the OS without the phone detecting it.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Titan M2 Security Chip',
    description: 'Pixel 6 and later include Google\'s Titan M2 security chip — the same hardware used in enterprise security keys. GrapheneOS uses this for hardware-backed encryption and attack resistance that generic Android devices don\'t offer.',
    icon: 'i-lucide-cpu',
  },
  {
    title: 'Regular Security Updates',
    description: 'GrapheneOS ships security patches on the same schedule as stock Android for supported Pixel hardware. You get the same update cadence as a stock phone, with none of the telemetry.',
    icon: 'i-lucide-refresh-cw',
  },
]
</script>
