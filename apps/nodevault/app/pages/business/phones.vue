<template>
  <UPage>
    <UPageHero
      title="Business Phone Fleet"
      description="Deploy GrapheneOS across your team with consistent security policies, managed app configurations, and verified boot on every device. Purpose-built for businesses that take data security seriously."
      align="center">
      <template #links>
        <UButton
          :to="`mailto:${config.contact.email}`"
          size="xl"
          icon="i-lucide-mail">
          Discuss Your Fleet
        </UButton>

        <UButton
          to="/business"
          size="xl"
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral">
          Back to Business Overview
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What's Different About Business Deployment"
      description="Individual phones are configured for personal use. Business deployments require consistent policies, shared tooling, and the ability to scale across a team."
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
      title="What Every Business Device Gets"
      description="Every phone we provision for your team starts from the same hardened baseline."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
        <div
          v-for="item in baseline"
          :key="item.title"
          class="flex items-start gap-3 p-4 rounded-xl border border-default">
          <UIcon
            :name="item.icon"
            class="size-5 text-primary shrink-0 mt-0.5" />

          <div>
            <p class="font-semibold text-sm">
              {{ item.title }}
            </p>

            <p class="text-sm text-muted mt-0.5">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Business App Configuration"
      description="We pre-configure the apps your team needs, with sandboxed Google Play available where your business tools require it."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
        <div
          v-for="category in appCategories"
          :key="category.name"
          class="flex flex-col gap-3 p-4 rounded-xl border border-default">
          <div class="flex items-center gap-2.5">
            <UIcon
              :name="category.icon"
              class="size-5 text-primary shrink-0" />

            <h3 class="font-semibold text-sm">
              {{ category.name }}
            </h3>
          </div>

          <ul class="space-y-1.5">
            <li
              v-for="app in category.apps"
              :key="app"
              class="flex items-center gap-2 text-sm text-muted">
              <UIcon
                name="i-lucide-check"
                class="size-3.5 text-primary shrink-0" />

              <span>{{ app }}</span>
            </li>
          </ul>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Deployment Process"
      description="From first conversation to devices in your team's hands."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">
        <div
          v-for="(step, index) in deploymentSteps"
          :key="step.title"
          class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
              {{ index + 1 }}
            </div>

            <h3 class="font-semibold text-sm">
              {{ step.title }}
            </h3>
          </div>

          <p class="text-sm text-muted pl-11">
            {{ step.description }}
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto text-center p-8 space-y-4">
        <UIcon
          name="i-lucide-mail"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Get in touch to discuss your fleet
        </h2>

        <p class="text-muted">
          Tell us how many devices you need, what apps your team uses, and what policies matter
          most to you. We'll come back with a clear deployment plan.
        </p>

        <UButton
          :to="`mailto:${config.contact.email}`"
          size="xl"
          icon="i-lucide-arrow-right"
          trailing>
          Start the Conversation
        </UButton>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import { useConfig } from '@nodevault/platform.components.nodevault.client'

useSeoMeta({
  title: 'Business Phone Fleet — GrapheneOS for Teams | NodeVault',
  description: 'Deploy GrapheneOS across your team with consistent security policies, bulk provisioning, and ongoing device management. Every device hardened, verified, and ready from day one.',
  ogTitle: 'Business GrapheneOS Phone Fleet | NodeVault',
  ogDescription: 'Bulk GrapheneOS provisioning for business teams. Consistent policies, sandboxed Google Play, and ongoing device management.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Business GrapheneOS Phone Fleet | NodeVault',
  twitterDescription: 'Deploy GrapheneOS at scale across your team. Consistent security policies, bulk provisioning, and 30-day support.',
  keywords: 'business GrapheneOS, secure business phones, GrapheneOS fleet, team device management, enterprise mobile security, bulk GrapheneOS provisioning, BYOD security',
})

const config = useConfig()
const features = [
  {
    title: 'Bulk Provisioning',
    description: 'We configure multiple devices to the same specification simultaneously. Whether you need 5 phones or 50, every device ships with identical settings, policies, and apps.',
    icon: 'i-lucide-layers',
  },
  {
    title: 'Consistent Security Policies',
    description: 'Every device has the same hardened baseline: strong screen lock requirements, USB data blocking, automatic reboot timers, and network permission restrictions — no exceptions.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Business App Integration',
    description: 'Your existing business tools — Slack, Teams, your CRM, your email provider — work on GrapheneOS via sandboxed Google Play. Privacy and productivity coexist.',
    icon: 'i-lucide-briefcase',
  },
  {
    title: 'Verified Boot on Every Device',
    description: 'Re-locked bootloader with verified boot means each device can prove it hasn\'t been tampered with since we configured it. Critical for businesses handling sensitive client data.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'Ongoing Device Management',
    description: 'We provide a support channel for device questions, OS updates, app additions, and replacements. Your team has someone to call when they need help.',
    icon: 'i-lucide-headphones',
  },
  {
    title: 'Replacements & Onboarding',
    description: 'When a team member joins or a device is replaced, we provision the new phone to the same spec. Consistent, repeatable, documented.',
    icon: 'i-lucide-refresh-cw',
  },
]

const baseline = [
  {
    title: 'GrapheneOS installed & bootloader re-locked',
    icon: 'i-lucide-shield',
    description: 'Latest stable build with verified boot active from first power-on.',
  },
  {
    title: 'Hardened screen lock & USB protection',
    icon: 'i-lucide-lock',
    description: 'Strong PIN/passphrase required. USB data blocked when screen is locked.',
  },
  {
    title: 'Automatic reboot timer configured',
    icon: 'i-lucide-timer',
    description: 'Device reboots automatically after a set idle period, requiring re-authentication.',
  },
  {
    title: 'Network permission restrictions',
    icon: 'i-lucide-wifi-off',
    description: 'Per-app network access restricted. Apps cannot phone home without explicit permission.',
  },
  {
    title: 'Sandboxed Google Play (if required)',
    icon: 'i-lucide-box',
    description: 'Isolated Play environment for any business apps that require it. Contained, not trusted.',
  },
  {
    title: 'Business communication tools pre-installed',
    icon: 'i-lucide-message-square',
    description: 'Signal, your email client, and agreed business apps ready from first boot.',
  },
]

const appCategories = [
  {
    name: 'Communication',
    icon: 'i-lucide-message-circle',
    apps: ['Signal (default messaging)', 'Proton Mail or Tutanota', 'Your existing email provider', 'Slack / Teams (via sandboxed Play)'],
  },
  {
    name: 'Security',
    icon: 'i-lucide-key-round',
    apps: ['Bitwarden / Vaultwarden client', 'Aegis for TOTP codes', 'Mullvad or WireGuard VPN'],
  },
  {
    name: 'Productivity',
    icon: 'i-lucide-briefcase',
    apps: ['Nextcloud (files + calendar)', 'Your CRM (via sandboxed Play)', 'Standard Notes or Joplin', 'Office apps (if needed)'],
  },
  {
    name: 'Navigation',
    icon: 'i-lucide-map-pin',
    apps: ['Organic Maps (offline, no tracking)', 'OsmAnd+ for advanced routing'],
  },
  {
    name: 'Browser',
    icon: 'i-lucide-globe',
    apps: ['Vanadium (hardened default)', 'Brave for general browsing', 'Firefox for extensions'],
  },
  {
    name: 'Business-Specific',
    icon: 'i-lucide-settings',
    apps: ['Any Google Play app via sandbox', 'Custom app configuration', 'Per-role app profiles available'],
  },
]

const deploymentSteps = [
  {
    title: 'Requirements Call',
    description: 'We discuss your team size, the apps you need, your security requirements, and any compliance considerations.',
  },
  {
    title: 'Device Specification',
    description: 'We recommend the right Pixel model and storage configuration for your team\'s use cases and budget.',
  },
  {
    title: 'Bulk Configuration',
    description: 'We source and configure all devices to your agreed spec. Each phone is tested before shipping.',
  },
  {
    title: 'Deployment & Training',
    description: 'Devices shipped to your office or team members directly. We provide a team onboarding call to get everyone comfortable.',
  },
  {
    title: 'Ongoing Support',
    description: 'A dedicated support channel for your business. Updates, additions, replacements, and questions — all covered.',
  },
]
</script>
