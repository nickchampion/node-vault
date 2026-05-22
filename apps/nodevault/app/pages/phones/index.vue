<template>
  <UPage>
    <UPageHero
      title="Your phone is tracking you. Here's how to stop it."
      description="Both iOS and Android collect far more data than most people realise — and most of it cannot be turned off through settings. GrapheneOS is a hardened Android operating system that eliminates surveillance at the OS level."
      align="center">
      <template #links>
        <UButton
          to="#what-is-grapheneos"
          size="xl"
          icon="i-lucide-chevron-down"
          variant="outline"
          color="neutral">
          What Is GrapheneOS?
        </UButton>

        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-message-circle"
          variant="ghost"
          color="neutral">
          Need help getting started?
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What your phone is actually sending"
      description="The data collection built into iOS and Android is extensive, largely invisible, and — in most cases — impossible to fully disable through the settings UI."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-w-5xl mx-auto">
        <div class="rounded-2xl border border-default bg-muted/20 p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-10 rounded-xl bg-muted shrink-0">
              <UIcon
                name="i-lucide-apple"
                class="size-5" />
            </div>

            <h3 class="font-bold text-lg">
              iOS
            </h3>
          </div>

          <p class="text-sm text-muted">
            Apple's privacy marketing is aggressive, but iOS still collects significant data by default.
          </p>

          <ul class="space-y-2.5">
            <li
              v-for="item in iosTracking"
              :key="item.title"
              class="flex items-start gap-3 text-sm">
              <UIcon
                name="i-lucide-alert-circle"
                class="size-4 text-warning shrink-0 mt-0.5" />

              <div>
                <p class="font-medium">
                  {{ item.title }}
                </p>

                <p class="text-muted text-xs mt-0.5">
                  {{ item.detail }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-default bg-muted/20 p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-10 rounded-xl bg-muted shrink-0">
              <UIcon
                name="i-lucide-smartphone"
                class="size-5" />
            </div>

            <h3 class="font-bold text-lg">
              Stock Android
            </h3>
          </div>

          <p class="text-sm text-muted">
            Google's business model is advertising. Android is the data collection tool.
          </p>

          <ul class="space-y-2.5">
            <li
              v-for="item in androidTracking"
              :key="item.title"
              class="flex items-start gap-3 text-sm">
              <UIcon
                name="i-lucide-alert-circle"
                class="size-4 text-error shrink-0 mt-0.5" />

              <div>
                <p class="font-medium">
                  {{ item.title }}
                </p>

                <p class="text-muted text-xs mt-0.5">
                  {{ item.detail }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <UCallout
        class="mt-8 max-w-3xl mx-auto text-left"
        icon="i-lucide-info"
        color="neutral">
        A 2018 study by Douglas Leith at Trinity College Dublin found that Google Android sends approximately 20 times more data to Google than iOS sends to Apple. A 2021 follow-up by the same researcher found both platforms send device identifiers even when users have opted out of tracking.
      </UCallout>
    </UPageSection>

    <UPageSection
      id="what-is-grapheneos"
      title="How GrapheneOS addresses this"
      description="GrapheneOS is a hardened, privacy-respecting Android operating system built and maintained by independent security researchers. It eliminates the surveillance layer that Google bakes into Android — without sacrificing security or usability."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="feature in grapheneFeatures"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="GrapheneOS vs. the alternatives"
      description="There are several de-Googled Android projects. GrapheneOS stands apart because it doesn't compromise on security to achieve privacy."
      align="center">
      <div class="overflow-x-auto mt-4 max-w-4xl mx-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default text-left">
              <th class="pb-3 font-semibold pr-4" />
              <th class="pb-3 font-semibold pr-4">
                GrapheneOS
              </th>

              <th class="pb-3 font-semibold pr-4">
                CalyxOS
              </th>

              <th class="pb-3 font-semibold pr-4">
                /e/OS
              </th>

              <th class="pb-3 font-semibold">
                Stock Android
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-default">
            <tr
              v-for="row in comparison"
              :key="row.feature">
              <td class="py-3 font-medium pr-4 text-xs text-muted">
                {{ row.feature }}
              </td>

              <td
                v-for="(value, idx) in row.values"
                :key="idx"
                class="py-3 pr-4">
                <UIcon
                  v-if="value === true"
                  name="i-lucide-check-circle"
                  class="size-4 text-success" />

                <UIcon
                  v-else-if="value === false"
                  name="i-lucide-x-circle"
                  class="size-4 text-error" />

                <span
                  v-else
                  class="text-xs text-muted">{{ value }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UPageSection>

    <UPageSection
      id="compatible-devices"
      title="Compatible devices"
      description="GrapheneOS runs exclusively on Google Pixel phones. Pixel is the only hardware that allows the bootloader to be relocked after installing a custom OS — this is critical for verified boot and the hardware security chain."
      align="center">
      <div class="overflow-x-auto mt-4 max-w-3xl mx-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default text-left">
              <th class="pb-3 font-semibold">Device</th>
              <th class="pb-3 font-semibold">GrapheneOS</th>
              <th class="pb-3 font-semibold">Notes</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-default">
            <tr
              v-for="device in devices"
              :key="device.model">
              <td class="py-3 font-medium">
                {{ device.model }}
              </td>

              <td class="py-3">
                <UIcon
                  name="i-lucide-check-circle"
                  class="size-4 text-success" />
              </td>

              <td class="py-3 text-muted text-xs">
                {{ device.notes }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UCallout
        class="mt-6 text-left max-w-3xl mx-auto"
        icon="i-lucide-info"
        color="neutral">
        The official GrapheneOS installation guide at grapheneos.org is thorough and works with any Chromium-based browser. Most technically comfortable users can complete a fresh install in under an hour.
      </UCallout>
    </UPageSection>

    <UPageSection
      title="Privacy app stack"
      description="Once GrapheneOS is running, replacing the Google apps you rely on is the next step. These are the most widely used privacy-respecting alternatives."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <div
          v-for="category in appStack"
          :key="category.category">
          <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
            <UIcon
              :name="category.icon"
              class="size-4 text-primary" />

            {{ category.category }}
          </h3>

          <ul class="space-y-2">
            <li
              v-for="app in category.apps"
              :key="app.name"
              class="text-sm">
              <p class="font-medium">
                {{ app.name }}
              </p>

              <p class="text-xs text-muted">
                {{ app.replaces }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Who this is for"
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="audience in audiences"
          :key="audience.title"
          :title="audience.title"
          :description="audience.description"
          :icon="audience.icon" />
      </UPageGrid>
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
          If you're thinking about installing GrapheneOS and would like some guidance — on which device to get, how the installation process works, or how to migrate your apps — feel free to get in touch. Happy to help.
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
  title: 'De-Google Your Phone with GrapheneOS | NodeVault',
  description: 'iOS and Android track more than most people realise. GrapheneOS removes surveillance at the OS level — no telemetry, sandboxed Play, and granular permission controls. Here\'s how.',
  ogTitle: 'De-Google Your Phone with GrapheneOS | NodeVault',
  ogDescription: 'Learn how GrapheneOS eliminates tracking from your Android phone at the OS level. Compatible devices, app stack, and installation guidance.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'GrapheneOS guide, de-google phone, privacy phone, GrapheneOS install, GrapheneOS Pixel, remove Google from Android',
})

const iosTracking = [
  {
    title: 'Device analytics shared with Apple and partners',
    detail: 'Enabled by default. Covers usage patterns, crash logs, app interactions, and Siri query content.',
  },
  {
    title: 'iCloud backups scanned for CSAM — and more',
    detail: 'Apple scans iCloud Photo Library contents on-device before upload. The same infrastructure could be applied to other content categories.',
  },
  {
    title: 'Precise location shared for "personalised ads"',
    detail: 'iOS shares location data with Apple\'s advertising platform. Disabling this requires navigating multiple settings screens and doesn\'t cover all data flows.',
  },
  {
    title: 'Siri processes queries on Apple servers',
    detail: 'Even with "improve Siri" disabled, voice queries are processed server-side. Audio snippets are retained for a period.',
  },
  {
    title: 'App Store purchase and browsing history retained',
    detail: 'Apple retains your full App Store history and associates it with your Apple ID indefinitely.',
  },
]

const androidTracking = [
  {
    title: 'OS-level telemetry to Google every few minutes',
    detail: 'Research by Trinity College Dublin found stock Android pings Google servers regularly even with no apps running, sharing location, hardware IDs, and network data.',
  },
  {
    title: 'Google Play Services runs with system-level privileges',
    detail: 'Google Play Services cannot be removed on stock Android. It has access to your contacts, location, app data, and device identifiers — always.',
  },
  {
    title: 'Location history even when "off"',
    detail: 'Google was found to record location even when users had disabled Location History, using Wi-Fi scan data and Cell ID lookups as proxies.',
  },
  {
    title: 'All search, maps, and Assistant queries retained',
    detail: 'Every query across Google apps is logged and associated with your Google account. This includes voice queries to Google Assistant.',
  },
  {
    title: 'Ad ID tracks you across every app',
    detail: 'Android assigns a persistent advertising identifier that follows you across every app. "Resetting" it creates a new ID but doesn\'t delete the history associated with the old one.',
  },
  {
    title: 'Manufacturer and carrier bloatware with own telemetry',
    detail: 'Samsung, OnePlus, and carrier-branded phones ship with additional apps that run their own telemetry independently of Google.',
  },
]

const grapheneFeatures = [
  {
    title: 'No Telemetry at the OS Level',
    description: 'GrapheneOS contains no Google services and no background data collection. Nothing phones home — because there is nothing to phone home to.',
    icon: 'i-lucide-eye-off',
  },
  {
    title: 'Sandboxed Google Play',
    description: 'Need Play Store apps? GrapheneOS lets you run Google Play in an isolated sandbox with no system-level privileges. Apps work normally; Google can\'t see your OS or other apps.',
    icon: 'i-lucide-box',
  },
  {
    title: 'Verified Boot Preserved',
    description: 'Unlike most custom ROMs, GrapheneOS supports relocking the bootloader after installation. Your phone passes hardware attestation and maintains the full security chain.',
    icon: 'i-lucide-shield-check',
  },
  {
    title: 'Monthly Security Updates',
    description: 'GrapheneOS ships security patches on the same schedule as stock Android. You get OS-level privacy without falling behind on security fixes.',
    icon: 'i-lucide-refresh-cw',
  },
  {
    title: 'Hardened Permission Model',
    description: 'Grant apps access to spoofed location data, restrict network access per-app, disable sensor access for untrusted apps. Far beyond what stock Android allows.',
    icon: 'i-lucide-sliders-horizontal',
  },
  {
    title: 'Fully Open Source',
    description: 'Every line of code is publicly auditable. No corporate interests, no monetisation model, no hidden services. Maintained by independent security researchers.',
    icon: 'i-lucide-code',
  },
]

const comparison = [
  {
    feature: 'No Google services by default',
    values: [true, true, true, false],
  },
  {
    feature: 'Bootloader can be relocked',
    values: [true, false, false, true],
  },
  {
    feature: 'Monthly security patches',
    values: [true, true, 'Delayed', true],
  },
  {
    feature: 'Sandboxed Play Store available',
    values: [true, 'MicroG', 'MicroG', 'N/A'],
  },
  {
    feature: 'Pixel 8 / 9 support',
    values: [true, true, false, true],
  },
  {
    feature: 'Hardware attestation passes',
    values: [true, false, false, true],
  },
]

const devices = [
  { model: 'Pixel 6 / 6a / 6 Pro', notes: 'Supported — approaching end of update lifecycle, good budget option' },
  { model: 'Pixel 7 / 7a / 7 Pro', notes: 'Fully supported — solid mid-range option with a good remaining update window' },
  { model: 'Pixel 8 / 8a / 8 Pro', notes: 'Recommended — longest remaining update window at time of writing' },
  { model: 'Pixel 9 / 9 Pro / 9 Pro XL', notes: 'Latest hardware — best performance and longest future support' },
  { model: 'Pixel 9 Pro Fold', notes: 'Supported — for those who want a foldable form factor' },
]

const appStack = [
  {
    category: 'Communication',
    icon: 'i-lucide-message-circle',
    apps: [
      { name: 'Signal', replaces: 'WhatsApp / iMessage' },
      { name: 'SimpleX Chat', replaces: 'WhatsApp / Telegram' },
      { name: 'Proton Mail', replaces: 'Gmail / Outlook' },
    ],
  },
  {
    category: 'Browsing',
    icon: 'i-lucide-globe',
    apps: [
      { name: 'Vanadium', replaces: 'Chrome (built into GrapheneOS)' },
      { name: 'Brave', replaces: 'Chrome / Firefox default' },
      { name: 'DuckDuckGo', replaces: 'Google Search' },
    ],
  },
  {
    category: 'Productivity',
    icon: 'i-lucide-calendar',
    apps: [
      { name: 'Nextcloud', replaces: 'Google Drive / Dropbox' },
      { name: 'Proton Calendar', replaces: 'Google Calendar' },
      { name: 'Standard Notes', replaces: 'Google Keep / Notes' },
    ],
  },
  {
    category: 'Security',
    icon: 'i-lucide-shield',
    apps: [
      { name: 'Bitwarden', replaces: 'Google Password Manager' },
      { name: 'Aegis Authenticator', replaces: 'Google Authenticator' },
      { name: 'Mullvad VPN', replaces: 'No VPN / commercial VPN' },
    ],
  },
]

const audiences = [
  {
    title: 'Privacy-conscious individuals',
    description: 'You don\'t need a threat model to want your phone to stop tracking you. GrapheneOS gives you a normal Android experience without the surveillance layer baked in by Google.',
    icon: 'i-lucide-user',
  },
  {
    title: 'Journalists & activists',
    description: 'Source protection and operational security depend on secure, uncompromised devices. GrapheneOS removes OS-level telemetry and significantly narrows the attack surface.',
    icon: 'i-lucide-pen-line',
  },
  {
    title: 'Healthcare & legal professionals',
    description: 'Client confidentiality extends to the tools you use. A phone that reports your location and contacts to Google is a liability. GrapheneOS eliminates that risk.',
    icon: 'i-lucide-briefcase',
  },
  {
    title: 'Anyone curious about digital sovereignty',
    description: 'Your phone knows where you sleep, who you talk to, what you search for, and what you buy. That data belongs to you — not to an advertising platform.',
    icon: 'i-lucide-heart',
  },
]
</script>
