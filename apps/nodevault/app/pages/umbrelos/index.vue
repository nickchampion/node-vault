<template>
  <UPage>
    <UPageHero
      title="Stop paying for cloud services that profit from your data"
      description="Dropbox, Google Drive, iCloud, and Google Photos are convenient. They're also subscription services that scan your files, mine your behaviour, and reserve the right to change their terms at any time. A home server costs around £130 to set up and nothing to run."
      align="center">
      <template #links>
        <UButton
          to="#what-you-can-self-host"
          size="xl"
          icon="i-lucide-chevron-down"
          variant="outline"
          color="neutral">
          What Can I Self-Host?
        </UButton>

        <UButton
          href="https://getumbrel.com"
          target="_blank"
          size="xl"
          icon="i-lucide-external-link"
          variant="ghost"
          color="neutral">
          UmbrelOS Website
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What cloud platforms are actually doing"
      description="The terms of service you agreed to without reading tell a story the marketing doesn't."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-w-4xl mx-auto">
        <div
          v-for="concern in cloudConcerns"
          :key="concern.title"
          class="flex items-start gap-4 p-5 rounded-xl border border-default bg-muted/20">
          <div class="flex items-center justify-center size-10 rounded-lg bg-muted shrink-0">
            <UIcon
              :name="concern.icon"
              class="size-5 text-muted" />
          </div>

          <div>
            <p class="font-semibold text-sm">
              {{ concern.title }}
            </p>

            <p class="text-xs text-muted mt-1 leading-relaxed">
              {{ concern.detail }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="The real cost of cloud storage"
      description="Cloud subscription costs are designed to feel small individually. They add up quickly."
      align="center">
      <div class="max-w-3xl mx-auto mt-4 space-y-3">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-default text-left">
                <th class="pb-3 font-semibold">Service</th>
                <th class="pb-3 font-semibold">What it replaces</th>
                <th class="pb-3 font-semibold">Monthly cost</th>
                <th class="pb-3 font-semibold">Annual cost</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-default">
              <tr
                v-for="sub in subscriptions"
                :key="sub.service">
                <td class="py-3 font-medium">
                  {{ sub.service }}
                </td>

                <td class="py-3 text-muted text-xs">
                  {{ sub.replaces }}
                </td>

                <td class="py-3">
                  {{ sub.monthly }}
                </td>

                <td class="py-3 font-semibold">
                  {{ sub.annual }}
                </td>
              </tr>

              <tr class="bg-muted/20">
                <td
                  class="py-3 font-bold"
                  colspan="2">
                  Combined total
                </td>

                <td class="py-3 font-bold">
                  ~£35/mo
                </td>

                <td class="py-3 font-bold text-error">
                  ~£420/yr
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <UCallout
          icon="i-lucide-server"
          color="primary"
          class="text-left">
          A Mini PC running UmbrelOS costs around £130 and draws 6W of power — roughly £6/year in electricity. It replaces every service in that table, permanently, with no ongoing costs and no data leaving your home.
        </UCallout>
      </div>
    </UPageSection>

    <UPageSection
      id="what-you-can-self-host"
      title="What you can self-host"
      description="One home server can replace a dozen paid cloud subscriptions. These are the most popular self-hosted applications."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="app in apps"
          :key="app.name"
          :title="app.name"
          :description="app.description"
          :icon="app.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="Why self-hosting is more private"
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

    <UPageSection
      title="What hardware do you need?"
      description="UmbrelOS runs on almost anything — but Umbrel also make purpose-built hardware that ships with umbrelOS pre-installed and takes about five minutes to set up."
      align="center">

      <!-- Official Umbrel hardware -->
      <div class="mb-8">
        <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-4 text-center">
          Official Umbrel hardware
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div
            v-for="option in umbrelHardware"
            :key="option.title"
            class="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col gap-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold text-sm">
                  {{ option.title }}
                </h3>

                <p class="text-xs text-primary font-medium mt-0.5">
                  {{ option.subtitle }}
                </p>
              </div>

              <UBadge
                variant="subtle"
                color="primary"
                size="xs">
                Official
              </UBadge>
            </div>

            <p class="text-sm text-muted leading-relaxed">
              {{ option.description }}
            </p>

            <ul class="space-y-1.5 flex-1">
              <li
                v-for="spec in option.specs"
                :key="spec"
                class="flex items-start gap-2 text-xs text-muted">
                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-3.5 text-primary shrink-0 mt-0.5" />
                {{ spec }}
              </li>
            </ul>

            <UButton
              :href="option.href"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              color="primary"
              size="sm"
              icon="i-lucide-external-link"
              trailing
              block>
              View {{ option.title }}
            </UButton>
          </div>
        </div>
      </div>

      <!-- DIY options -->
      <div>
        <p class="text-xs font-semibold text-muted uppercase tracking-wide mb-4 text-center">
          DIY alternatives
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="option in hardware"
            :key="option.title"
            class="rounded-2xl border border-default p-6 flex flex-col gap-4">
            <div class="flex items-start gap-3">
              <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10 shrink-0">
                <UIcon
                  :name="option.icon"
                  class="size-5 text-primary" />
              </div>

              <div>
                <h3 class="font-bold text-sm">
                  {{ option.title }}
                </h3>

                <p class="text-xs text-primary font-medium mt-0.5">
                  {{ option.subtitle }}
                </p>
              </div>
            </div>

            <p class="text-sm text-muted leading-relaxed">
              {{ option.description }}
            </p>

            <ul class="space-y-1.5 flex-1">
              <li
                v-for="spec in option.specs"
                :key="spec"
                class="flex items-start gap-2 text-xs text-muted">
                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-3.5 text-primary shrink-0 mt-0.5" />
                {{ spec }}
              </li>
            </ul>

            <div
              v-if="option.note"
              class="text-xs text-muted bg-muted/30 rounded-lg px-3 py-2 leading-relaxed">
              {{ option.note }}
            </div>
          </div>
        </div>
      </div>

      <UCallout
        class="mt-8 max-w-3xl mx-auto text-left"
        icon="i-lucide-hard-drive"
        color="neutral">
        DIY builds: add an external USB 3.0 hard drive for storage — a 4TB drive costs around £70 and is where your files, photos, and backups will live. Umbrel Home and Pro have internal NVMe storage, though a large external drive is still worthwhile for media libraries.
      </UCallout>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto text-center p-8 space-y-4">
        <UIcon
          name="i-lucide-message-circle"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Want some guidance?
        </h2>

        <p class="text-muted">
          If you're thinking about setting up a home server and would like some advice — what hardware to buy, how to get started with UmbrelOS, or which apps make sense for your situation — feel free to get in touch. Happy to help.
        </p>

        <UButton
          to="/company/contact"
          size="xl"
          variant="outline"
          color="neutral"
          icon="i-lucide-arrow-right"
          trailing>
          Get in touch
        </UButton>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Own Your Cloud with UmbrelOS | NodeVault',
  description: 'Replace Dropbox, Google Photos, and iCloud with a home server you own and control. UmbrelOS makes self-hosting approachable. Your data, your hardware, no subscriptions.',
  ogTitle: 'Own Your Cloud — Self-Hosting with UmbrelOS | NodeVault',
  ogDescription: 'Stop paying for cloud services that scan your files. Run Nextcloud, Immich, and Vaultwarden on your own hardware at home.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'UmbrelOS, self-hosted, home server, Nextcloud, replace Dropbox, replace Google Photos, personal cloud, digital sovereignty',
})

const cloudConcerns = [
  {
    title: 'Google scans your files to improve its products',
    icon: 'i-lucide-eye',
    detail: 'Google Drive\'s terms explicitly state that your content may be used to improve Google\'s services and develop new features. This includes documents, photos, and any other files you store.',
  },
  {
    title: 'Dropbox can share data with third-party partners',
    icon: 'i-lucide-share-2',
    detail: 'Dropbox\'s privacy policy permits sharing usage data and metadata with analytics and advertising partners. Dropbox employees can also access file contents for legal compliance or safety purposes.',
  },
  {
    title: 'iCloud is subject to US government requests',
    icon: 'i-lucide-landmark',
    detail: 'Apple regularly receives and complies with government data requests for iCloud contents. In 2023, Apple provided data in response to thousands of requests from law enforcement agencies globally.',
  },
  {
    title: 'Accounts can be closed without warning',
    icon: 'i-lucide-user-x',
    detail: 'Every major cloud provider reserves the right to terminate accounts for Terms of Service violations — including AI-flagged false positives. Several photographers have permanently lost years of Google Photos libraries.',
  },
  {
    title: 'Your data is used to train AI models',
    icon: 'i-lucide-cpu',
    detail: 'Google, Microsoft, and Dropbox have all updated their terms to include AI training on user content. Opting out is buried in settings — and isn\'t always honoured for data already collected.',
  },
  {
    title: 'Subscription prices only go up',
    icon: 'i-lucide-trending-up',
    detail: 'Google One, iCloud, and Dropbox have all increased prices in the past two years. You have no leverage and no alternative if you\'re already locked into their ecosystem.',
  },
]

const subscriptions = [
  { service: 'iCloud 2TB', replaces: 'File storage & photo backup', monthly: '£6.99', annual: '£83.88' },
  { service: 'Dropbox Plus', replaces: 'File storage & sharing', monthly: '£9.99', annual: '£119.88' },
  { service: 'Google One 2TB', replaces: 'Drive, Photos & Gmail storage', monthly: '£8.99', annual: '£107.88' },
  { service: 'LastPass / 1Password', replaces: 'Password management', monthly: '£2.99', annual: '£35.88' },
  { service: 'Plex Pass', replaces: 'Media streaming', monthly: '£4.99', annual: '£59.88' },
]

const apps = [
  {
    name: 'Nextcloud',
    description: 'Your own Google Drive and Google Photos replacement. Files, contacts, calendars, and photo backups — synced to all your devices, stored on your hardware.',
    icon: 'i-lucide-cloud',
  },
  {
    name: 'Immich',
    description: 'A fast, self-hosted Google Photos alternative with face recognition, automatic phone backups, and family album sharing. Indistinguishable from Google Photos to use.',
    icon: 'i-lucide-image',
  },
  {
    name: 'Vaultwarden',
    description: 'A self-hosted Bitwarden-compatible password manager. Your entire password vault lives on your server — not on a company\'s cloud where a breach can expose it.',
    icon: 'i-lucide-key-round',
  },
  {
    name: 'Jellyfin',
    description: 'Stream your own music, films, and TV shows to any device at home or away. No subscription, no licensing restrictions, no content that suddenly disappears.',
    icon: 'i-lucide-play-circle',
  },
  {
    name: 'Home Assistant',
    description: 'Smart home automation that runs entirely offline and locally. Connects to thousands of devices without sending your home activity data to Amazon, Google, or Apple.',
    icon: 'i-lucide-home',
  },
  {
    name: 'Paperless-ngx',
    description: 'Scan, OCR, and organise all your documents. Search your entire archive instantly — bank statements, warranties, invoices — without anything leaving your home.',
    icon: 'i-lucide-file-text',
  },
  {
    name: 'Pi-hole / AdGuard Home',
    description: 'Network-wide DNS blocking for every device — phones, TVs, smart speakers — without installing anything on each one. Works alongside a Privacy Router or standalone.',
    icon: 'i-lucide-shield',
  },
  {
    name: 'WireGuard VPN',
    description: 'Securely access your home server from anywhere. Better than commercial VPNs because you control the server, you set the policy, and there are no logs by design.',
    icon: 'i-lucide-lock',
  },
]

const reasons = [
  {
    title: 'Your data never leaves your home',
    description: 'Files stored on your Nextcloud or Immich server stay on your server. No terms-of-service changes, no data mining, no breach notifications from someone else\'s cloud.',
    icon: 'i-lucide-house',
  },
  {
    title: 'No accounts to compromise',
    description: 'Self-hosted services don\'t share a login database with millions of other users. A breach at Dropbox or LastPass cannot affect you if your data isn\'t there.',
    icon: 'i-lucide-user-x',
  },
  {
    title: 'Works when the internet is down',
    description: 'Local network access means your files, music, and home automation keep working during outages. No "service unavailable" — it\'s your server, always on.',
    icon: 'i-lucide-wifi-off',
  },
  {
    title: 'Pay once, own forever',
    description: 'Hardware is a one-time cost. The software stack — Nextcloud, Immich, Vaultwarden — is free and open source. No subscriptions, ever.',
    icon: 'i-lucide-receipt',
  },
]

const umbrelHardware = [
  {
    title: 'Umbrel Home',
    subtitle: 'From $549 · umbrel.com/umbrel-home',
    href: 'https://umbrel.com/umbrel-home',
    description: 'Purpose-built hardware from the team behind UmbrelOS. Ships pre-installed and ready in 30 seconds — no setup knowledge required. The simplest possible way to get started.',
    specs: [
      'Intel N150 quad-core, 3.6GHz',
      '16GB DDR5 RAM',
      '512GB, 1TB, 2TB, or 4TB NVMe SSD options',
      '3× USB 3.0, Gigabit Ethernet, WiFi, Bluetooth',
      '6W power draw — costs pence per month to run',
      'umbrelOS pre-installed, 1-year warranty',
    ],
  },
  {
    title: 'Umbrel Pro',
    subtitle: 'Premium · umbrel.com/umbrel-pro',
    href: 'https://umbrel.com/umbrel-pro',
    description: 'The high-end option. Designed for serious storage with up to 32TB across four NVMe slots, FailSafe RAID mode to protect against drive failure, and a premium aluminium and walnut enclosure.',
    specs: [
      'Intel Core i3-N300, 8 cores, 3.8GHz',
      '16GB LPDDR5 RAM',
      '4× M.2 NVMe slots — up to 32TB total storage',
      'FailSafe Mode (RAID) protects against a single drive failure',
      '2.5GbE, 2× USB 3.2 Gen 2 (Type-C), HDMI 2.1, WiFi 6',
      'Aluminium and American walnut build, magnetic lid for tool-free SSD swaps',
    ],
  },
]

const hardware = [
  {
    title: 'Mini PC',
    subtitle: 'Recommended · ~£120–160',
    icon: 'i-lucide-server',
    description: 'The best all-round option. An Intel N100 or N95 mini PC is silent, uses around 6W idle (under £6/year in electricity), and handles everything including 4K video transcoding.',
    specs: [
      'Beelink EQ12 or Trigkey G5 — widely available on Amazon',
      'Intel N100 quad-core, 16GB RAM, 500GB NVMe SSD',
      'Fits in a palm — hides behind a router or in a cupboard',
      'Runs 24/7 without fan noise or heat issues',
      'Add a USB 3.0 hard drive for media and file storage',
    ],
    note: 'Look for models with at least 16GB RAM and a 2.5GbE port if you plan to run Jellyfin with hardware transcoding.',
  },
  {
    title: 'Raspberry Pi 5',
    subtitle: 'Lightweight option · ~£70–90 board only',
    icon: 'i-lucide-cpu',
    description: 'A capable platform for lighter workloads — Nextcloud file sync, Vaultwarden, Pi-hole, and Home Assistant. Struggles with 4K video transcoding.',
    specs: [
      'Raspberry Pi 5 (4GB or 8GB RAM)',
      'Official active cooler recommended for sustained loads',
      'Boot from a fast USB 3.0 SSD — not an SD card',
      'NVMe HAT available for a neater internal SSD setup',
      'Around 3–5W idle — very low running cost',
    ],
    note: 'Storage speed matters. Use an SSD via USB 3.0 or the official NVMe HAT — SD cards are too slow and unreliable for a server.',
  },
  {
    title: 'Existing PC or laptop',
    subtitle: 'Zero cost · repurpose what you have',
    icon: 'i-lucide-laptop',
    description: 'Any machine from the last decade can run UmbrelOS. If you have an old laptop or desktop sitting unused, this is the cheapest and most sustainable starting point.',
    specs: [
      'Minimum: 4GB RAM, dual-core CPU, 64GB storage',
      'UmbrelOS installs directly — no existing OS needed',
      'Laptops have a built-in UPS if the power cuts out',
      'Can be tucked away and forgotten about',
      'Check the wattage — older desktops can be expensive to run 24/7',
    ],
    note: 'An older desktop pulling 60W costs ~£50/year to run. A mini PC at 6W costs under £6. Worth factoring in before repurposing.',
  },
]
</script>
