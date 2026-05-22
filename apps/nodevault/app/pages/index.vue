<template>
  <UPage>
    <UPageHero
      title="Take back control of your digital life"
      description="Your phone tracks where you go. Your cloud provider reads your files. Your smart TV watches what you watch. None of this is inevitable — and none of it requires technical expertise to fix."
      align="center">
      <template #links>
        <UButton
          to="/phones"
          size="xl"
          icon="i-lucide-smartphone">
          De-Google Your Phone
        </UButton>

        <UButton
          to="/umbrelos"
          size="xl"
          icon="i-lucide-server"
          variant="outline"
          color="neutral">
          Own Your Cloud
        </UButton>

        <UButton
          to="/privacy-router"
          size="xl"
          icon="i-lucide-box"
          variant="outline"
          color="neutral">
          Secure Your Network
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Three ways to reduce your digital footprint"
      description="You don't need to choose between convenience and privacy. These are practical, proven approaches used by people who simply don't want to be tracked."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <UCard
          v-for="area in areas"
          :key="area.title"
          class="flex flex-col gap-4">
          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 shrink-0">
              <UIcon
                :name="area.icon"
                class="size-6 text-primary" />
            </div>

            <div class="flex-1">
              <h3 class="font-semibold text-lg leading-tight">
                {{ area.title }}
              </h3>

              <p class="text-sm text-primary font-medium mt-0.5">
                {{ area.tagline }}
              </p>
            </div>
          </div>

          <p class="text-sm text-muted flex-1">
            {{ area.description }}
          </p>

          <ul class="space-y-1.5">
            <li
              v-for="point in area.points"
              :key="point"
              class="flex items-start gap-2 text-sm">
              <UIcon
                name="i-lucide-check"
                class="size-4 text-primary shrink-0 mt-0.5" />

              <span>{{ point }}</span>
            </li>
          </ul>

          <UButton
            :to="area.href"
            variant="outline"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            {{ area.cta }}
          </UButton>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="What they're not telling you"
      description="The business models of the world's largest technology companies depend on your data. Understanding what's collected — and how — is the first step to opting out."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="fact in facts"
          :key="fact.title"
          :title="fact.title"
          :description="fact.description"
          :icon="fact.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="This isn't just for tech experts"
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <UCard
          v-for="person in people"
          :key="person.title"
          class="flex flex-col gap-3 text-center items-center p-5">
          <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10">
            <UIcon
              :name="person.icon"
              class="size-5 text-primary" />
          </div>

          <p class="font-semibold text-sm">
            {{ person.title }}
          </p>

          <p class="text-xs text-muted">
            {{ person.description }}
          </p>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto text-center p-8 space-y-4">
        <UIcon
          name="i-lucide-message-circle"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Not sure where to start?
        </h2>

        <p class="text-muted">
          Privacy can feel overwhelming. If you'd like some guidance on any of the above — which approach makes sense for you, what hardware to buy, or how to get started — feel free to get in touch. No sales pitch, no obligation.
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
  title: 'NodeVault | Take Back Control of Your Digital Life',
  description: 'Practical guides to de-Googling your phone with GrapheneOS, replacing cloud subscriptions with a self-hosted home server, and protecting your home network from IoT surveillance.',
  ogTitle: 'NodeVault | Take Back Control of Your Digital Life',
  ogDescription: 'GrapheneOS guides, self-hosted home server setup, and home network privacy. Practical steps to get off Big Tech.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'GrapheneOS guide, de-google phone, self-hosted cloud, UmbrelOS, privacy router, home network privacy, digital privacy',
})

const areas = [
  {
    title: 'De-Google Your Phone',
    tagline: 'GrapheneOS on a Google Pixel',
    icon: 'i-lucide-smartphone',
    href: '/phones',
    cta: 'Learn About GrapheneOS',
    description: 'Stock Android sends a constant stream of data to Google — location, app usage, contacts, voice queries. GrapheneOS removes all of this at the OS level, giving you a fully functional Android phone with zero telemetry.',
    points: [
      'No background data collection at the OS level',
      'Optional sandboxed Google Play — apps work, Google doesn\'t',
      'Granular per-app permission controls',
      'Works on Google Pixel 6 through Pixel 9',
    ],
  },
  {
    title: 'Own Your Cloud',
    tagline: 'Self-hosted with UmbrelOS',
    icon: 'i-lucide-server',
    href: '/umbrelos',
    cta: 'Learn About Self-Hosting',
    description: 'Every file you store with Google, Dropbox, or Apple is subject to their terms of service, data mining, and the risk of account closure or breach. A home server costs around £130 and runs indefinitely — on hardware you own, in a place you control.',
    points: [
      'Replace Dropbox, Google Photos and iCloud with your own server',
      'Files never leave your home network',
      'No monthly subscriptions after the initial hardware cost',
      'Nextcloud, Immich, Jellyfin, Vaultwarden, and more',
    ],
  },
  {
    title: 'Secure Your Network',
    tagline: 'DNS blocking, VPN & VLAN isolation',
    icon: 'i-lucide-box',
    href: '/privacy-router',
    cta: 'Learn About Privacy Router',
    description: 'Your smart TV, voice assistant, and IoT devices are phoning home constantly — often without any way to opt out. A privacy router running Pi-hole, WireGuard, and VLANs blocks tracking at the network level and isolates devices that can\'t be trusted.',
    points: [
      'DNS-level ad and tracker blocking for every device',
      'VLAN isolation keeps IoT devices away from your laptop',
      'WireGuard VPN gateway for your whole network',
      'Open source: Pi-hole, AdGuard Home, OpenWRT',
    ],
  },
]

const facts = [
  {
    title: 'Android Reports to Google Every Few Minutes',
    description: 'Even with no apps open and Wi-Fi off, stock Android devices regularly send location, hardware identifiers, and network data to Google servers. This happens at the OS level — it cannot be disabled through settings.',
    icon: 'i-lucide-radio',
  },
  {
    title: 'Your Smart TV Tracks What You Watch',
    description: 'Samsung, LG, and Roku TVs use Automatic Content Recognition (ACR) to identify every frame of content on screen — including from HDMI inputs — and report it back to their ad platforms. It\'s enabled by default.',
    icon: 'i-lucide-tv',
  },
  {
    title: 'Cloud Providers Can Read Your Files',
    description: 'Dropbox, Google Drive, and OneDrive all reserve the right to scan file contents under their terms of service. Google explicitly uses Drive contents to improve its products. Files on your own hardware are accessible to nobody but you.',
    icon: 'i-lucide-eye',
  },
  {
    title: 'Your IoT Devices Share a Network with Your Laptop',
    description: 'By default, a compromised smart bulb, camera, or thermostat can scan and reach other devices on your home network. VLAN isolation prevents this — each device category gets its own network segment and can\'t communicate across them.',
    icon: 'i-lucide-network',
  },
]

const people = [
  {
    title: 'Curious individuals',
    icon: 'i-lucide-user',
    description: 'You don\'t need a threat model — just the knowledge that your data is your business.',
  },
  {
    title: 'Families',
    icon: 'i-lucide-users',
    description: 'A home server and privacy router protect every device in the house, including children\'s devices.',
  },
  {
    title: 'Remote workers',
    icon: 'i-lucide-laptop',
    description: 'Separate work and personal networks, block tracking, and access your files securely from anywhere.',
  },
  {
    title: 'Healthcare & legal',
    icon: 'i-lucide-briefcase',
    description: 'Client confidentiality starts with the tools you use. A de-Googled phone is a meaningful step.',
  },
]
</script>
