<template>
  <UPage>
    <UPageHero
      title="Privacy Phone Installation & Configuration"
      description="We install GrapheneOS, CalyxOS, or /e/OS on your Android device and configure it for a life without tracking, telemetry, or Big Tech surveillance. Your phone, running software that works for you — not for advertisers."
      align="center">
      <template #links>
        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-smartphone">
          Book Installation
        </UButton>

        <UButton
          to="#compatible-devices"
          size="xl"
          icon="i-lucide-chevron-down"
          variant="outline"
          color="neutral">
          See Compatible Phones
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What We Do"
      description="We take your existing Google Pixel phone — or supply one — and replace the stock Android operating system with a privacy-respecting alternative. Then we configure it from scratch with the apps and settings that give you back control."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <UCard
          v-for="os in operatingSystems"
          :key="os.name"
          class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
              <UIcon
                :name="os.icon"
                class="size-5 text-primary" />
            </div>

            <div>
              <h3 class="font-semibold">
                {{ os.name }}
              </h3>

              <UBadge
                :color="os.recommended ? 'primary' : 'neutral'"
                variant="subtle"
                size="xs">
                {{ os.recommended ? 'Recommended' : 'Available' }}
              </UBadge>
            </div>
          </div>

          <p class="text-sm text-muted flex-1">
            {{ os.description }}
          </p>

          <ul class="space-y-1.5">
            <li
              v-for="point in os.points"
              :key="point"
              class="flex items-start gap-2 text-xs text-muted">
              <UIcon
                name="i-lucide-check"
                class="size-3.5 text-primary shrink-0 mt-0.5" />

              <span>{{ point }}</span>
            </li>
          </ul>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="What's Included"
      description="Every installation includes setup, app configuration, and a walkthrough so you know how to use your phone confidently from day one."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div
          v-for="item in included"
          :key="item.title"
          class="flex items-start gap-3 p-4 rounded-xl border border-default bg-muted/20">
          <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              :name="item.icon"
              class="size-4 text-primary" />
          </div>

          <div>
            <p class="font-medium text-sm">
              {{ item.title }}
            </p>

            <p class="text-xs text-muted mt-0.5">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="compatible-devices"
      title="Compatible Devices"
      description="We work exclusively with Google Pixel devices. Pixel hardware is the only platform that allows the bootloader to be relocked after installing a custom OS — this is critical for verified boot and proper hardware security."
      align="center">
      <div class="overflow-x-auto mt-4">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default text-left">
              <th class="pb-3 font-semibold">Device</th>
              <th class="pb-3 font-semibold">GrapheneOS</th>
              <th class="pb-3 font-semibold">CalyxOS</th>
              <th class="pb-3 font-semibold">/e/OS</th>
              <th class="pb-3 font-semibold">Notes</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-default">
            <tr
              v-for="device in devices"
              :key="device.model"
              class="py-3">
              <td class="py-3 font-medium">
                {{ device.model }}
              </td>

              <td class="py-3">
                <UIcon
                  :name="device.graphene ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="device.graphene ? 'text-success' : 'text-muted'"
                  class="size-4" />
              </td>

              <td class="py-3">
                <UIcon
                  :name="device.calyx ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
                  :class="device.calyx ? 'text-success' : 'text-muted'"
                  class="size-4" />
              </td>

              <td class="py-3">
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
        Don't have a compatible phone? We can supply a refurbished Pixel 8 or 9 — just mention it when you contact us.
      </UCallout>
    </UPageSection>

    <UPageSection
      title="Privacy App Stack"
      description="After the OS install we configure a curated set of privacy-respecting apps. You choose what gets installed — this is a starting point, not a prescription."
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
      id="pricing"
      title="Pricing"
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-3xl mx-auto">
        <UCard
          v-for="plan in pricing"
          :key="plan.name"
          class="flex flex-col gap-4">
          <div>
            <h3 class="font-semibold text-lg">
              {{ plan.name }}
            </h3>

            <p class="text-3xl font-bold mt-1">
              {{ plan.price }}
            </p>

            <p class="text-sm text-muted mt-1">
              {{ plan.description }}
            </p>
          </div>

          <ul class="space-y-2 flex-1">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2 text-sm">
              <UIcon
                name="i-lucide-check-circle"
                class="size-4 text-primary shrink-0 mt-0.5" />

              <span>{{ feature }}</span>
            </li>
          </ul>

          <UButton
            to="/company/contact"
            variant="outline"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            Book This Service
          </UButton>
        </UCard>
      </div>

      <p class="text-sm text-muted text-center mt-6">
        Send-in or drop-off service. Turnaround 1–2 business days. Postal return covered for send-in orders.
      </p>
    </UPageSection>

    <UPageSection
      title="Who This Is For"
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
          name="i-lucide-smartphone"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Ready to take back your phone?
        </h2>

        <p class="text-muted">
          Get in touch with the device model you have (or ask about supply) and which OS you're interested in. We'll confirm availability and turnaround.
        </p>

        <UButton
          to="/company/contact"
          size="xl"
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
  title: 'Privacy Phone Installation — GrapheneOS, CalyxOS & /e/OS | NodeVault',
  description: 'Professional GrapheneOS, CalyxOS, and /e/OS installation service for Google Pixel phones. Privacy app configuration included. UK-based send-in or drop-off service.',
  ogTitle: 'Privacy Phone Installation — GrapheneOS, CalyxOS & /e/OS | NodeVault',
  ogDescription: 'We install and configure a privacy OS on your Pixel phone and set up everything you need to leave Google behind.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'GrapheneOS installation UK, CalyxOS install, privacy phone UK, de-googled phone, GrapheneOS Pixel, privacy Android UK',
})

const operatingSystems = [
  {
    name: 'GrapheneOS',
    icon: 'i-lucide-shield',
    recommended: true,
    description: 'The gold standard in Android privacy. GrapheneOS is a hardened Android fork built by security researchers. It eliminates all Google services at the OS level while remaining compatible with the apps you need via sandboxed Google Play.',
    points: [
      'No telemetry or background tracking',
      'Sandboxed Google Play — run apps without giving Google OS access',
      'Hardware-level verified boot after install',
      'Regular security updates on the same schedule as stock Android',
      'Supported on Pixel 6 through Pixel 9 series',
    ],
  },
  {
    name: 'CalyxOS',
    icon: 'i-lucide-shield-check',
    recommended: false,
    description: 'A community-focused privacy OS with MicroG support built in. Easier for users transitioning from stock Android who need more app compatibility out of the box — Google services are replaced with open-source alternatives rather than sandboxed.',
    points: [
      'MicroG for Google-dependent app compatibility',
      'F-Droid and Aurora Store pre-configured',
      'Mozilla Location Services replaces Google location',
      'Supported on Pixel 6 through Pixel 8 series',
    ],
  },
  {
    name: '/e/OS',
    icon: 'i-lucide-shield-off',
    recommended: false,
    description: 'The most user-friendly option. /e/OS is designed for people who want a completely de-Googled experience with a familiar UI. Comes with a suite of cloud services (Murena Cloud) and strong app compatibility. Best for non-technical users.',
    points: [
      'Murena Cloud: calendar, contacts, mail sync',
      'Familiar interface close to stock Android',
      'App Lounge for accessing Play Store apps without a Google account',
      'Supported on a wider range of devices than GrapheneOS',
    ],
  },
]

const included = [
  {
    title: 'OS Installation',
    icon: 'i-lucide-download',
    description: 'Full custom OS install with bootloader relocked and verified boot confirmed.',
  },
  {
    title: 'App Configuration',
    icon: 'i-lucide-layout-grid',
    description: 'Privacy app stack installed and configured to your preferences.',
  },
  {
    title: 'Secure Messaging',
    icon: 'i-lucide-message-circle',
    description: 'Signal, Session, or SimpleX set up and ready — you choose your preferred app.',
  },
  {
    title: 'Browser Setup',
    icon: 'i-lucide-globe',
    description: 'Brave or Firefox with hardened settings, privacy-respecting search engine configured.',
  },
  {
    title: 'Permission Lockdown',
    icon: 'i-lucide-lock',
    description: 'Microphone, camera, location, and network access reviewed and restricted by default.',
  },
  {
    title: 'Walkthrough Included',
    icon: 'i-lucide-book-open',
    description: 'Written guide or video call walkthrough so you\'re confident using your new setup.',
  },
]

const devices = [
  { model: 'Pixel 6 / 6a / 6 Pro', graphene: true, calyx: true, eos: true, notes: 'Supported, approaching end of update lifecycle' },
  { model: 'Pixel 7 / 7a / 7 Pro', graphene: true, calyx: true, eos: true, notes: 'Fully supported, recommended budget option' },
  { model: 'Pixel 8 / 8a / 8 Pro', graphene: true, calyx: true, eos: true, notes: 'Recommended — longest remaining update window' },
  { model: 'Pixel 9 / 9 Pro / 9 Pro XL', graphene: true, calyx: false, eos: false, notes: 'GrapheneOS only — newest hardware' },
  { model: 'Pixel 9 Pro Fold', graphene: true, calyx: false, eos: false, notes: 'GrapheneOS only' },
]

const appStack = [
  {
    category: 'Communication',
    icon: 'i-lucide-message-circle',
    apps: [
      { name: 'Signal', replaces: 'WhatsApp / iMessage' },
      { name: 'SimpleX Chat', replaces: 'WhatsApp / Telegram' },
      { name: 'Tutanota or Proton Mail', replaces: 'Gmail / Outlook' },
    ],
  },
  {
    category: 'Browsing',
    icon: 'i-lucide-globe',
    apps: [
      { name: 'Brave', replaces: 'Chrome / Firefox default' },
      { name: 'Mullvad Browser', replaces: 'Chrome' },
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

const pricing = [
  {
    name: 'Installation Only',
    price: '£200',
    description: 'Bring your own Pixel 6–9. We install the OS and hand it back.',
    features: [
      'OS installation of your choice',
      'Bootloader relocked, verified boot confirmed',
      'Base app configuration (browser, messaging)',
      'Written setup guide',
      'Send-in or drop-off',
    ],
  },
  {
    name: 'Full Configuration',
    price: '£350',
    description: 'Complete install, app setup, and a personalised walkthrough.',
    features: [
      'Everything in Installation Only',
      'Full privacy app stack installed',
      'Permission audit and lockdown',
      'Secure messaging configured',
      'Cloud storage integration (Nextcloud)',
      '30-minute video call walkthrough',
      '30 days email support',
    ],
  },
]

const audiences = [
  {
    title: 'Journalists & Activists',
    description: 'Source protection and operational security depend on secure devices. A de-Googled phone removes a significant attack surface and eliminates the risk of OS-level data collection.',
    icon: 'i-lucide-pen-line',
  },
  {
    title: 'Legal & Healthcare Professionals',
    description: 'Client confidentiality extends to the tools you use. A phone that reports your location and contacts to Google creates GDPR processing you have not documented or consented to.',
    icon: 'i-lucide-briefcase',
  },
  {
    title: 'Privacy-Conscious Individuals',
    description: 'You don\'t need a threat model to want your phone to stop tracking you. GrapheneOS gives you a normal Android experience without the surveillance layer baked in by the manufacturer.',
    icon: 'i-lucide-user',
  },
  {
    title: 'Business Owners & Executives',
    description: 'Sensitive business discussions, financial data, and client relationships all pass through your phone. Reducing the attack surface reduces your exposure.',
    icon: 'i-lucide-building-2',
  },
]
</script>
