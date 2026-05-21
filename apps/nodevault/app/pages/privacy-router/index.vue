<template>
  <UPage>
    <UPageHero
      title="Privacy Router"
      description="A pre-configured hardware appliance that plugs into your home or office network and gives you whole-network DNS blocking, a built-in VPN gateway, and VLAN isolation — all managed from a single dashboard. Privacy infrastructure, without the engineering degree."
      align="center">
      <template #links>
        <UButton
          to="#pricing"
          size="xl"
          icon="i-lucide-box">
          See Pricing
        </UButton>

        <UButton
          to="#how-it-works"
          size="xl"
          icon="i-lucide-cpu"
          variant="outline"
          color="neutral">
          How It Works
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="One Device. Whole-Network Privacy."
      description="Most privacy tools protect one device at a time. Privacy Router protects every device on your network — phones, laptops, smart TVs, IoT devices — the moment they connect to your Wi-Fi."
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
      id="how-it-works"
      title="How It Works"
      description="Privacy Router sits between your router and your network. It inspects DNS queries, blocks trackers and ads at the network level, routes traffic through your chosen VPN, and isolates your IoT devices from your main network."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div
          v-for="(step, index) in howItWorks"
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

      <UCallout
        class="mt-10 text-left max-w-2xl mx-auto"
        icon="i-lucide-zap"
        color="primary">
        Privacy Router uses open source software — Pi-hole/AdGuard Home for DNS filtering, WireGuard for VPN, and OpenWRT for routing. No proprietary lock-in. We build the hardware, write the configuration, and maintain the software stack so you don't have to.
      </UCallout>
    </UPageSection>

    <UPageSection
      title="What Gets Blocked"
      description="DNS-level blocking stops requests before they leave your network. Unlike browser extensions, it protects every device — including those that don't support extensions."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div
          v-for="category in blockedCategories"
          :key="category.title"
          class="flex items-start gap-3 p-4 rounded-xl border border-default bg-muted/20">
          <UIcon
            :name="category.icon"
            class="size-5 text-primary shrink-0 mt-0.5" />

          <div>
            <p class="font-medium text-sm">
              {{ category.title }}
            </p>

            <p class="text-xs text-muted mt-0.5">
              {{ category.description }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="pricing"
      title="Choose Your Router"
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl mx-auto">
        <UCard
          v-for="plan in plans"
          :key="plan.name"
          class="flex flex-col gap-5">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold text-lg">
                {{ plan.name }}
              </h3>

              <UBadge
                v-if="plan.badge"
                :color="plan.badgeColor"
                variant="subtle"
                size="xs">
                {{ plan.badge }}
              </UBadge>
            </div>

            <p class="text-3xl font-bold">
              {{ plan.price }}
            </p>

            <p
              v-if="plan.subscription"
              class="text-sm text-muted mt-0.5">
              + {{ plan.subscription }}/mo subscription
            </p>

            <p class="text-sm text-muted mt-2">
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
            :variant="plan.primary ? 'solid' : 'outline'"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            Order {{ plan.name }}
          </UButton>
        </UCard>
      </div>

      <div class="mt-8 p-4 rounded-xl border border-default bg-muted/20 max-w-2xl mx-auto text-sm text-muted text-center">
        <strong class="text-default">Subscription covers:</strong> software updates, blocklist updates, remote monitoring, and priority support. Cancellation returns the router to manual self-managed mode.
      </div>
    </UPageSection>

    <UPageSection
      title="The NodeVault Dashboard"
      description="Every Privacy Router ships with access to the NodeVault management dashboard. One interface for everything — no SSH, no command line, no config files."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 max-w-3xl mx-auto">
        <div
          v-for="dashFeature in dashboardFeatures"
          :key="dashFeature.title"
          class="flex items-start gap-3">
          <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              :name="dashFeature.icon"
              class="size-4 text-primary" />
          </div>

          <div>
            <p class="font-medium text-sm">
              {{ dashFeature.title }}
            </p>

            <p class="text-xs text-muted mt-0.5">
              {{ dashFeature.description }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="Who Privacy Router Is For"
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
          name="i-lucide-box"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Interested in Privacy Router?
        </h2>

        <p class="text-muted">
          Get in touch and we'll confirm availability, delivery timescale, and answer any questions about setup or compatibility with your existing router.
        </p>

        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-arrow-right"
          trailing>
          Get In Touch
        </UButton>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Router — Whole-Network DNS Blocking & VPN Appliance | NodeVault',
  description: 'Pre-configured hardware appliance with DNS blocking, WireGuard VPN, and VLAN isolation for your home or small office network. Managed via the NodeVault dashboard.',
  ogTitle: 'Privacy Router | NodeVault',
  ogDescription: 'Whole-network privacy in one appliance. DNS blocking, VPN gateway, and IoT isolation — plug in and go.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'privacy router UK, Pi-hole home, DNS blocker hardware, WireGuard VPN home router, network privacy appliance UK, AdGuard Home hardware',
})

const features = [
  {
    title: 'DNS-Level Ad & Tracker Blocking',
    description: 'Blocks adverts, trackers, and malware domains before they reach any device on your network. Works on phones, tablets, smart TVs, and IoT devices without any per-device configuration.',
    icon: 'i-lucide-shield-off',
  },
  {
    title: 'WireGuard VPN Gateway',
    description: 'Connects your whole network to a VPN provider of your choice, or to a NodeVault-managed WireGuard server. Every device gets VPN protection automatically — no apps to configure.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'VLAN Isolation',
    description: 'Separates your IoT devices from your main network using VLANs. Your smart speaker cannot talk to your laptop, even if one is compromised. Critical for homes with smart home devices.',
    icon: 'i-lucide-git-branch',
  },
  {
    title: 'NodeVault Dashboard',
    description: 'A web interface purpose-built for Privacy Router lets you see what\'s being blocked, update settings, and manage VPN connections — no command line knowledge required.',
    icon: 'i-lucide-layout-dashboard',
  },
  {
    title: 'Automatic Updates',
    description: 'Blocklists, firmware, and software are kept up to date automatically with subscription. Emerging threats are blocked without you needing to think about it.',
    icon: 'i-lucide-refresh-cw',
  },
  {
    title: 'Open Source Stack',
    description: 'Pi-hole, AdGuard Home, WireGuard, and OpenWRT — all auditable, community-maintained, and with no vendor lock-in. You own the hardware and the configuration.',
    icon: 'i-lucide-code',
  },
]

const howItWorks = [
  {
    title: 'Plug In',
    description: 'Connect Privacy Router between your router and your network switch (or directly to your router\'s LAN port). Takes about 5 minutes.',
  },
  {
    title: 'DNS Intercept',
    description: 'Privacy Router becomes the DNS resolver for your network. Every domain lookup passes through it before going anywhere.',
  },
  {
    title: 'Block & Filter',
    description: 'Known tracker, ad, and malware domains are blocked at the DNS level. Clean requests are forwarded through encrypted DNS-over-HTTPS.',
  },
  {
    title: 'VPN Routing',
    description: 'Traffic from configured devices is routed through your chosen WireGuard VPN endpoint. IoT devices get isolated into their own VLAN automatically.',
  },
]

const blockedCategories = [
  {
    title: 'Advertising Networks',
    description: 'Google Ads, Facebook Pixel, and hundreds of other ad networks — blocked before the request leaves your network.',
    icon: 'i-lucide-ban',
  },
  {
    title: 'Tracking & Analytics',
    description: 'Google Analytics, Facebook tracking, Hotjar, and other behavioural analytics tools that follow you across the web.',
    icon: 'i-lucide-eye-off',
  },
  {
    title: 'Smart TV & IoT Telemetry',
    description: 'Samsung, LG, Roku, and smart appliance telemetry that sends usage data back to manufacturers without asking.',
    icon: 'i-lucide-tv',
  },
  {
    title: 'Malware & Phishing',
    description: 'Known malware distribution domains and phishing sites — blocked for every device on your network.',
    icon: 'i-lucide-bug',
  },
  {
    title: 'Social Media Trackers',
    description: 'Facebook, Twitter/X, and LinkedIn tracking scripts embedded in third-party websites.',
    icon: 'i-lucide-share-2',
  },
  {
    title: 'Data Broker Domains',
    description: 'Acxiom, Experian Marketing, and similar data broker platforms that aggregate browsing behaviour.',
    icon: 'i-lucide-database',
  },
]

const plans = [
  {
    name: 'Home Router',
    price: '£175',
    subscription: '£12',
    badge: null,
    badgeColor: 'neutral' as const,
    primary: false,
    description: 'For households up to 50 devices. Built on Raspberry Pi 5 with a fanless enclosure.',
    features: [
      'Raspberry Pi 5 hardware, fanless enclosure',
      'Pi-hole + AdGuard Home DNS filtering',
      'WireGuard VPN gateway (your provider)',
      'Basic VLAN support (2 networks)',
      'NodeVault dashboard access',
      'Setup guide and remote onboarding call',
      '12/mo subscription: updates + support',
    ],
  },
  {
    name: 'Office Router',
    price: '£275',
    subscription: '£20',
    badge: 'More Powerful',
    badgeColor: 'primary' as const,
    primary: true,
    description: 'For small offices up to 100 devices. Built on Protectli hardware with dual NICs.',
    features: [
      'Protectli VP2420 quad-core hardware',
      'Dual NIC for proper router-mode deployment',
      'Pi-hole + AdGuard Home with custom lists',
      'WireGuard VPN gateway (your provider or managed)',
      'Full VLAN isolation (up to 8 networks)',
      'Traffic logging and query history',
      'NodeVault dashboard with user management',
      'Setup guide, remote onboarding, and priority support',
      '12/mo subscription: updates, monitoring + support',
    ],
  },
]

const dashboardFeatures = [
  {
    title: 'Blocklist Management',
    icon: 'i-lucide-list-filter',
    description: 'Add, remove, and manage blocklists. See which domains are being queried and blocked in real time.',
  },
  {
    title: 'VPN Status',
    icon: 'i-lucide-lock',
    description: 'See which devices are using the VPN, which server they\'re connected to, and toggle connections per device.',
  },
  {
    title: 'VLAN Configuration',
    icon: 'i-lucide-network',
    description: 'Assign devices to networks, configure isolation rules, and see what\'s connected where — without touching config files.',
  },
  {
    title: 'Query Log',
    icon: 'i-lucide-file-text',
    description: 'Full DNS query history with block/allow status. See exactly what your devices are trying to connect to.',
  },
  {
    title: 'Update Control',
    icon: 'i-lucide-refresh-cw',
    description: 'Approve or schedule firmware and blocklist updates. Automatic updates can be enabled or managed manually.',
  },
  {
    title: 'Alerts',
    icon: 'i-lucide-bell',
    description: 'Email or push notifications for suspicious activity, device connectivity issues, or VPN drops.',
  },
]

const audiences = [
  {
    title: 'Privacy-Conscious Households',
    description: 'Protect every device in your home — phones, tablets, smart TVs, and voice assistants — without installing anything on each one individually.',
    icon: 'i-lucide-home',
  },
  {
    title: 'Remote Workers',
    description: 'A WireGuard VPN gateway means your home office has the same network-level protection as a corporate environment — without a monthly SaaS subscription.',
    icon: 'i-lucide-laptop',
  },
  {
    title: 'Small Offices',
    description: 'VLAN isolation means your guest Wi-Fi can\'t access your file server, and your IoT devices can\'t reach your accountancy software. Simple network security, properly done.',
    icon: 'i-lucide-building-2',
  },
  {
    title: 'Smart Home Owners',
    description: 'Smart speakers, cameras, and appliances are notoriously chatty. Privacy Router blocks their telemetry and isolates them from your main network so a compromised bulb can\'t reach your laptop.',
    icon: 'i-lucide-cpu',
  },
]
</script>
