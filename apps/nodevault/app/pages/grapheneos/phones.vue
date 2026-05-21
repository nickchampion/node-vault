<template>
  <UPage>
    <UPageHero
      title="Pre-Configured GrapheneOS Phones"
      description="Get a Google Pixel with GrapheneOS already installed, hardened, and ready to use out of the box. No technical knowledge required — just switch on and start living more privately."
      align="center">
      <template #links>
        <UButton
          :to="`mailto:${config.contact.email}`"
          size="xl"
          icon="i-lucide-mail">
          Order Now
        </UButton>

        <UButton
          to="/grapheneos"
          size="xl"
          icon="i-lucide-info"
          variant="outline"
          color="neutral">
          Learn About GrapheneOS
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What's Included With Every Phone"
      description="Every phone we sell comes fully set up — not just with an OS, but ready for real-world private daily use."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="item in included"
          :key="item.title"
          :title="item.title"
          :description="item.description"
          :icon="item.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="Available Models"
      description="We stock the full current range of Google Pixel hardware. All models receive GrapheneOS security updates for their full supported lifetime."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <UCard
          v-for="phone in phones"
          :key="phone.model"
          class="flex flex-col gap-4">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="font-semibold text-lg">
                {{ phone.model }}
              </p>

              <p class="text-sm text-muted mt-0.5">
                {{ phone.tagline }}
              </p>
            </div>

            <UBadge
              v-if="phone.popular"
              color="primary"
              variant="subtle"
              label="Popular" />
          </div>

          <p class="text-sm text-muted flex-1">
            {{ phone.description }}
          </p>

          <div class="space-y-1 text-sm">
            <div
              v-for="spec in phone.specs"
              :key="spec"
              class="flex items-center gap-2 text-muted">
              <UIcon
                name="i-lucide-check"
                class="size-4 text-primary shrink-0" />

              <span>{{ spec }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-default">
            <span class="font-semibold text-lg">{{ phone.price }}</span>

            <UButton
              :to="`mailto:${config.contact.email}`"
              size="sm"
              icon="i-lucide-arrow-right"
              trailing>
              Order
            </UButton>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="How It Works"
      description="From order to your hands in four simple steps."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
              {{ index + 1 }}
            </div>

            <h3 class="font-semibold">
              {{ step.title }}
            </h3>
          </div>

          <p class="text-sm text-muted pl-11">
            {{ step.description }}
          </p>
        </div>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import { useConfig } from '@nodevault/platform.components.nodevault.client'

useSeoMeta({
  title: 'Buy a Pre-Configured GrapheneOS Phone | NodeVault',
  description: 'Order a Google Pixel with GrapheneOS pre-installed, hardened, and ready to use out of the box. Pixel 8a, 8, 9, and 9 Pro available. 30 days of support included.',
  ogTitle: 'Buy a Pre-Configured GrapheneOS Phone | NodeVault',
  ogDescription: 'Google Pixel phones with GrapheneOS pre-installed and fully hardened. No technical knowledge required. Ships ready to use.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Buy a Pre-Configured GrapheneOS Phone | NodeVault',
  twitterDescription: 'Pixel 8a, 8, 9, and 9 Pro with GrapheneOS pre-installed. Hardened, ready to use, 30 days support.',
  keywords: 'buy GrapheneOS phone, pre-configured GrapheneOS, Google Pixel GrapheneOS, privacy phone UK, Pixel 8a GrapheneOS, Pixel 9 GrapheneOS, GrapheneOS for sale',
})

const config = useConfig()
const included = [
  {
    title: 'GrapheneOS Installed',
    description: 'Latest stable build installed with the bootloader re-locked for verified boot. Tamper-evident from first power-on.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Hardened Settings Applied',
    description: 'Secure screen lock, USB data blocking when locked, automatic reboot timers, and network permission restrictions all configured.',
    icon: 'i-lucide-settings',
  },
  {
    title: 'Recommended Apps Pre-Installed',
    description: 'Signal, Brave, Bitwarden, Organic Maps, and ProtonMail ready to go. Optional sandboxed Google Play available if needed.',
    icon: 'i-lucide-app-window',
  },
  {
    title: '30 Days of Support',
    description: 'Direct access to us via Signal for 30 days after delivery. Questions, app recommendations, and configuration help included.',
    icon: 'i-lucide-message-circle',
  },
]

const phones = [
  {
    model: 'Pixel 8a',
    tagline: 'Best value',
    popular: true,
    description: 'The most affordable supported Pixel. Excellent performance for everyday privacy use with a great camera.',
    specs: ['6.1" OLED display', '8GB RAM / 128GB storage', '7 years of OS updates', 'Titan M2 security chip'],
    price: 'From £499',
  },
  {
    model: 'Pixel 8',
    tagline: 'Flagship',
    popular: false,
    description: 'Full flagship performance in a compact form. Best camera in its class and full 7-year support lifetime.',
    specs: ['6.2" OLED display', '8GB RAM / 128GB storage', '7 years of OS updates', 'Tensor G3 chip'],
    price: 'From £599',
  },
  {
    model: 'Pixel 9',
    tagline: 'Latest gen',
    popular: false,
    description: 'The newest standard Pixel. Upgraded camera system, improved thermal performance, and full 7-year updates.',
    specs: ['6.3" OLED display', '12GB RAM / 128GB storage', '7 years of OS updates', 'Tensor G4 chip'],
    price: 'From £749',
  },
  {
    model: 'Pixel 9 Pro',
    tagline: 'Ultimate',
    popular: false,
    description: 'The best hardware GrapheneOS supports. Telephoto lens, maximum RAM, and the most powerful Tensor chip.',
    specs: ['6.3" OLED display', '16GB RAM / 128GB storage', '7 years of OS updates', 'Tensor G4 + Titan M2'],
    price: 'From £999',
  },
]

const steps = [
  {
    title: 'Choose Your Model',
    description: 'Pick the Pixel that fits your needs and budget. Email us or use the order form to get started.',
  },
  {
    title: 'We Configure It',
    description: 'We source, install GrapheneOS, apply hardened settings, and install your chosen apps. Takes 1–2 working days.',
  },
  {
    title: 'Shipped to You',
    description: 'Dispatched via tracked delivery. Arrives factory-reset style — just power on and everything is already there.',
  },
  {
    title: '30-Day Support',
    description: 'We\'re on Signal for a month after delivery. Any questions, app recommendations, or configuration tweaks — just ask.',
  },
]
</script>
