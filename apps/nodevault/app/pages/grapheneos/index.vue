<template>
  <UPage>
    <UPageHero
      title="A Phone That Actually Respects Your Privacy"
      description="GrapheneOS is a hardened, open-source Android fork built for Google Pixel phones. It removes all Google tracking, hardens the OS against attacks, and gives you an app sandbox that genuinely contains apps — not just in principle, but in practice."
      align="center">
      <template #links>
        <UButton
          to="/grapheneos/phones"
          size="xl"
          icon="i-lucide-smartphone">
          Buy a Pre-Configured Phone
        </UButton>

        <UButton
          :to="`mailto:${config.contact.email}`"
          size="xl"
          icon="i-lucide-calendar"
          variant="outline"
          color="neutral">
          Book a Setup Consultation
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What Makes GrapheneOS Different"
      description="This isn't just 'Android without Google'. GrapheneOS rebuilds the entire security model from the ground up."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="Our GrapheneOS Services"
      description="Whether you want a phone delivered ready to go, or need help setting up your existing Pixel, we've got you covered."
      align="center">
      <UPageGrid>
        <UPageCard
          title="Pre-Configured Phones"
          description="Order a Google Pixel with GrapheneOS already installed, hardened settings applied, and recommended apps set up. Ships ready to use — no technical knowledge needed."
          icon="i-lucide-package"
          to="/grapheneos/phones">
          <template #footer>
            <UButton
              to="/grapheneos/phones"
              size="sm"
              variant="outline"
              color="neutral"
              icon="i-lucide-arrow-right"
              trailing>
              View phones
            </UButton>
          </template>
        </UPageCard>

        <UPageCard
          title="Setup Consulting"
          description="Already have a Pixel or want to buy one yourself? We'll walk you through installing GrapheneOS, configuring privacy settings, and replacing Google apps — via video call at your own pace."
          icon="i-lucide-video"
          :to="`mailto:${config.contact.email}`">
          <template #footer>
            <UButton
              :to="`mailto:${config.contact.email}`"
              size="sm"
              variant="outline"
              color="neutral"
              icon="i-lucide-arrow-right"
              trailing>
              Get in touch
            </UButton>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="Recommended Apps for GrapheneOS"
      description="We configure these open-source alternatives to replace the surveillance apps that come pre-installed on standard Android phones."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="app in recommendedApps"
          :key="app.name"
          :title="app.name"
          :description="app.description"
          :icon="app.icon" />
      </UPageGrid>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import { useConfig } from '@nodevault/platform.components.nodevault.client'

useSeoMeta({
  title: 'GrapheneOS Phones | NodeVault — Hardened Private Android',
  description: 'GrapheneOS is a hardened, open-source Android fork for Google Pixel phones. Zero Google tracking, full app sandboxing, and hardened memory. Buy pre-configured from NodeVault.',
  ogTitle: 'GrapheneOS Phones | NodeVault',
  ogDescription: 'Zero Google tracking, full app sandboxing, hardened memory. Buy a pre-configured GrapheneOS Pixel from NodeVault.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'GrapheneOS Phones | NodeVault',
  twitterDescription: 'The most secure Android experience available. Pre-configured, hardened, ready to use.',
  keywords: 'GrapheneOS, privacy phone, hardened Android, Google Pixel, no Google tracking, private smartphone, buy GrapheneOS phone, open source Android',
})

const config = useConfig()
const features = [
  {
    title: 'Zero Google Services',
    description: 'No Google Play Services means no location reporting, no ad tracking, and no telemetry — at the OS level. Not a setting you can accidentally toggle off.',
    icon: 'i-lucide-eye-off',
  },
  {
    title: 'Full App Sandboxing',
    description: 'Every app runs in strong isolation (hardened app sandbox). Apps cannot access your contacts, location, camera, or microphone without explicit user permission. GrapheneOS also adds extra toggles (e.g., network and sensors) and scoped storage controls for finer-grained privacy.',
    icon: 'i-lucide-box',
  },
  {
    title: 'Network Permission Control',
    description: 'You can deny any app internet access entirely. Combined with a VPN, you control exactly what data leaves your device and to where.',
    icon: 'i-lucide-wifi-off',
  },
  {
    title: 'Hardened Memory',
    description: 'GrapheneOS uses a hardened memory allocator and kernel that makes exploit development significantly harder than stock Android or iOS — even compared to security-focused competitors.',
    icon: 'i-lucide-cpu',
  },
  {
    title: 'Auto-Relock & Duress PIN',
    description: 'Configure the phone to lock itself after inactivity or when powered off. A separate duress PIN can trigger a secure wipe if you\'re ever forced to unlock under duress.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'Verified Boot',
    description: 'The bootloader is relocked after installation, so every boot is cryptographically verified against a known-good state. Tampered systems won\'t boot.',
    icon: 'i-lucide-shield-check',
  },
]

const recommendedApps = [
  {
    name: 'Signal',
    description: 'Encrypted messaging and calls. Replaces WhatsApp, iMessage, and SMS — with zero metadata collection.',
    icon: 'i-lucide-message-circle',
  },
  {
    name: 'Brave Browser',
    description: 'Chromium-based browser with built-in ad and tracker blocking. Faster than Chrome with none of the surveillance.',
    icon: 'i-lucide-globe',
  },
  {
    name: 'Bitwarden',
    description: 'Open-source password manager. Can be self-hosted on your UmbrelOS server for complete control over your vault.',
    icon: 'i-lucide-key-round',
  },
  {
    name: 'Organic Maps',
    description: 'Offline maps using OpenStreetMap data. Full navigation without sending your location to Google or Apple.',
    icon: 'i-lucide-map-pin',
  },
  {
    name: 'ProtonMail',
    description: 'End-to-end encrypted email from Switzerland. Significantly harder to intercept than Gmail or Outlook.',
    icon: 'i-lucide-mail',
  },
  {
    name: 'Mullvad VPN',
    description: 'No-logs VPN that doesn\'t require an email address to sign up. Pairs with GrapheneOS\'s per-app VPN routing.',
    icon: 'i-lucide-shield',
  },
]
</script>
