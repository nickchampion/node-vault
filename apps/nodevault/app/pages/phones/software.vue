<template>
  <UPage>
    <UPageHero
      title="Privacy App Stack"
      description="After the OS installation we configure a curated set of privacy-respecting apps. Every app on this list has been chosen because it collects no data it doesn't need, is open source or independently audited, and does its job as well as — often better than — the mainstream alternative."
      align="center">
      <template #links>
        <UButton
          to="/phones"
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
      title="What Gets Installed"
      description="You choose what gets installed — this is a starting point based on what we recommend for most users. Each category replaces a common mainstream app that tracks you."
      align="center">
      <div class="space-y-10 mt-4">
        <div
          v-for="category in appCategories"
          :key="category.name">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10">
              <UIcon
                :name="category.icon"
                class="size-4 text-primary" />
            </div>

            <h2 class="font-semibold">
              {{ category.name }}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="app in category.apps"
              :key="app.name"
              class="p-4 rounded-xl border border-default bg-muted/20 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-sm">
                  {{ app.name }}
                </p>

                <UBadge
                  v-if="app.recommended"
                  color="primary"
                  variant="subtle"
                  size="xs">
                  Recommended
                </UBadge>
              </div>

              <p class="text-xs text-muted">
                Replaces: <span class="text-default">{{ app.replaces }}</span>
              </p>

              <p class="text-xs text-muted flex-1">
                {{ app.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="What We Remove"
      description="On stock Android, many pre-installed apps cannot be uninstalled — only disabled. On GrapheneOS, the Google apps sandbox is optional and isolated. Here's what's gone by default."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="removed in removedApps"
          :key="removed.title"
          :title="removed.title"
          :description="removed.description"
          :icon="removed.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-xl mx-auto text-center p-8 space-y-4">
        <h2 class="text-xl font-bold">
          Questions about a specific app?
        </h2>

        <p class="text-muted text-sm">
          If there's a specific app you need to keep using, get in touch before booking — we can usually find a compatible privacy-respecting alternative or explain how to use the sandboxed Play Store safely.
        </p>

        <UButton
          to="/company/contact"
          size="lg"
          icon="i-lucide-arrow-right"
          trailing>
          Ask a Question
        </UButton>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Privacy App Stack — What Gets Installed | NodeVault',
  description: 'The curated privacy app stack installed on every NodeVault phone configuration. Signal, Bitwarden, Brave, and more — with the mainstream alternatives they replace.',
  ogTitle: 'Privacy App Stack | NodeVault',
  ogDescription: 'Every app we install on a NodeVault-configured phone, why we chose it, and what mainstream app it replaces.',
  keywords: 'GrapheneOS apps, privacy Android apps, Signal setup, Bitwarden Android, Brave browser Android, de-googled app stack',
})

const appCategories = [
  {
    name: 'Messaging & Communication',
    icon: 'i-lucide-message-circle',
    apps: [
      {
        name: 'Signal',
        replaces: 'WhatsApp, SMS',
        recommended: true,
        description: 'End-to-end encrypted messages, calls, and video. Open source, non-profit, and widely audited. The most practical secure messenger for everyday use.',
      },
      {
        name: 'SimpleX Chat',
        replaces: 'WhatsApp, Telegram',
        recommended: false,
        description: 'No phone number or identity required. Uses a relay model for message routing that means even the server cannot see who is talking to whom.',
      },
      {
        name: 'Briar',
        replaces: 'WhatsApp',
        recommended: false,
        description: 'Peer-to-peer messaging that works without internet — over Tor, Wi-Fi, or Bluetooth. Designed for activists and journalists in hostile environments.',
      },
    ],
  },
  {
    name: 'Email',
    icon: 'i-lucide-mail',
    apps: [
      {
        name: 'Proton Mail',
        replaces: 'Gmail',
        recommended: true,
        description: 'End-to-end encrypted email hosted in Switzerland. Zero-access encryption means Proton cannot read your emails. Full-featured mobile app.',
      },
      {
        name: 'Tutanota',
        replaces: 'Gmail',
        recommended: false,
        description: 'German end-to-end encrypted email with a strong privacy focus. Open source client and independent audit. Good alternative to Proton.',
      },
    ],
  },
  {
    name: 'Browser',
    icon: 'i-lucide-globe',
    apps: [
      {
        name: 'Brave',
        replaces: 'Chrome',
        recommended: true,
        description: 'Chromium-based browser with aggressive ad and tracker blocking built in. No telemetry, no Google sync. Fast, familiar interface for Chrome users.',
      },
      {
        name: 'Firefox (hardened)',
        replaces: 'Chrome',
        recommended: false,
        description: 'Mozilla\'s open source browser configured with uBlock Origin and privacy-hardened settings. Better extension support than Brave for power users.',
      },
      {
        name: 'Mullvad Browser',
        replaces: 'Chrome',
        recommended: false,
        description: 'Built on Firefox with Tor Browser hardening. Maximises fingerprint resistance. Best for high-risk browsing sessions.',
      },
    ],
  },
  {
    name: 'Search',
    icon: 'i-lucide-search',
    apps: [
      {
        name: 'DuckDuckGo',
        replaces: 'Google Search',
        recommended: true,
        description: 'No search history, no personalisation, no tracking between sessions. Good results for most everyday queries. Built-in tracker blocking.',
      },
      {
        name: 'Brave Search',
        replaces: 'Google Search',
        recommended: false,
        description: 'Independent search index — not a Google or Bing reskin. No tracking, no filter bubbles. Strong results for tech and privacy topics.',
      },
      {
        name: 'Startpage',
        replaces: 'Google Search',
        recommended: false,
        description: 'Google results without the tracking. Useful when you need Google\'s index but don\'t want Google to know you searched.',
      },
    ],
  },
  {
    name: 'Passwords & 2FA',
    icon: 'i-lucide-key',
    apps: [
      {
        name: 'Bitwarden',
        replaces: 'Google Password Manager, 1Password',
        recommended: true,
        description: 'Open source password manager with end-to-end encryption. Self-hostable or use their cloud. Free for personal use. Full Android autofill support.',
      },
      {
        name: 'Aegis Authenticator',
        replaces: 'Google Authenticator, Authy',
        recommended: true,
        description: 'Open source TOTP authenticator. Encrypted backup, import/export, and no cloud sync required. The only sensible choice on a de-Googled phone.',
      },
    ],
  },
  {
    name: 'Cloud Storage & Notes',
    icon: 'i-lucide-hard-drive',
    apps: [
      {
        name: 'Nextcloud',
        replaces: 'Google Drive, Dropbox, Google Photos',
        recommended: true,
        description: 'Self-hosted or NodeVault-managed cloud storage, calendar, contacts, and document sync. Your files, on your infrastructure. Full Android client.',
      },
      {
        name: 'Standard Notes',
        replaces: 'Google Keep, Apple Notes',
        recommended: false,
        description: 'End-to-end encrypted notes with offline-first architecture. Simple, fast, and audited. Free tier is fully functional.',
      },
      {
        name: 'Proton Drive',
        replaces: 'Google Drive',
        recommended: false,
        description: 'End-to-end encrypted cloud storage from Proton. Good option if you\'re already using Proton Mail and don\'t want to self-host.',
      },
    ],
  },
  {
    name: 'VPN',
    icon: 'i-lucide-shield',
    apps: [
      {
        name: 'Mullvad VPN',
        replaces: 'NordVPN, ExpressVPN',
        recommended: true,
        description: 'No-logs, no-account VPN. You pay with cash or crypto — Mullvad never knows who you are. Independently audited. WireGuard protocol support.',
      },
      {
        name: 'ProtonVPN',
        replaces: 'NordVPN, ExpressVPN',
        recommended: false,
        description: 'Swiss jurisdiction, no-logs, independently audited. Free tier with no data cap. Good for users already in the Proton ecosystem.',
      },
    ],
  },
]

const removedApps = [
  {
    title: 'Google Play Services',
    description: 'On GrapheneOS, Google Play Services is isolated in a sandboxed container with no special OS privileges. It cannot access your location, contacts, or other data outside the sandbox.',
    icon: 'i-lucide-ban',
  },
  {
    title: 'Google Chrome',
    description: 'Not installed. Replaced with Brave or hardened Firefox. Chrome sends browsing data to Google and cannot be fully de-Googled regardless of settings.',
    icon: 'i-lucide-ban',
  },
  {
    title: 'Google Assistant',
    description: 'Not available on GrapheneOS. Voice assistant functionality is available through open source alternatives if needed.',
    icon: 'i-lucide-ban',
  },
  {
    title: 'Manufacturer Bloatware',
    description: 'GrapheneOS is a clean install with no carrier or manufacturer pre-installed apps. You start with only what you choose to install.',
    icon: 'i-lucide-ban',
  },
]
</script>
