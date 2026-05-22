<template>
  <UPage>
    <UPageHero
      title="Consultancy Services"
      description="We offer hands-on setup services for every area we cover. Tell us what you need — we handle the sourcing, configuration, and installation, and hand it over ready to use."
      align="center">
      <template #links>
        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-mail">
          Get in Touch
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Privacy Phone Setup"
      description="A bespoke GrapheneOS phone configured exactly to your specification — sourced, installed, and ready to use."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl mx-auto">
        <UCard
          v-for="plan in phonePlans"
          :key="plan.name"
          :class="['flex flex-col gap-4', plan.highlight ? 'ring-2 ring-primary' : '']">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <h3 class="font-semibold text-lg">
                {{ plan.name }}
              </h3>

              <UBadge
                v-if="plan.highlight"
                color="primary"
                variant="subtle"
                label="Most popular" />
            </div>

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
            :variant="plan.highlight ? 'solid' : 'outline'"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            Book This Service
          </UButton>
        </UCard>
      </div>

      <p class="text-sm text-muted text-center mt-6">
        Turnaround 2–4 business days from order. Phone delivered by tracked courier or collected in person.
      </p>
    </UPageSection>

    <UDivider class="my-4" />

    <UPageSection
      title="Home Server Setup (UmbrelOS)"
      description="We design, source, install, and configure your UmbrelOS home server — then hand it over with a full training session. You get a working private home network without reading a single tutorial."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <UCard
          v-for="tier in homeServerTiers"
          :key="tier.name"
          :class="['flex flex-col gap-4', tier.highlight ? 'ring-2 ring-primary' : '']">
          <div class="space-y-1">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-semibold text-lg">
                {{ tier.name }}
              </h3>

              <UBadge
                v-if="tier.highlight"
                color="primary"
                variant="subtle"
                label="Most popular" />
            </div>

            <p class="text-sm text-muted">
              {{ tier.tagline }}
            </p>
          </div>

          <p class="text-3xl font-bold">
            {{ tier.price }}
          </p>

          <p class="text-sm text-muted flex-1">
            {{ tier.description }}
          </p>

          <ul class="space-y-2">
            <li
              v-for="item in tier.includes"
              :key="item"
              class="flex items-start gap-2 text-sm">
              <UIcon
                name="i-lucide-check"
                class="size-4 text-primary shrink-0 mt-0.5" />

              <span>{{ item }}</span>
            </li>
          </ul>

          <UButton
            to="/company/contact"
            :variant="tier.highlight ? 'solid' : 'outline'"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            Get started
          </UButton>
        </UCard>
      </div>
    </UPageSection>

    <UDivider class="my-4" />

    <UPageSection
      title="Privacy Router Installation"
      description="We source the hardware, build the appliance, configure DNS blocking, VPN, and VLAN isolation, and install it in your home. Every device on your network protected from day one."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl mx-auto">
        <UCard
          v-for="plan in routerPlans"
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
              + {{ plan.subscription }}/mo optional subscription
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
            variant="outline"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            Book Installation
          </UButton>
        </UCard>
      </div>

      <p class="text-sm text-muted text-center mt-6">
        Subscription covers software updates, blocklist updates, remote monitoring, and priority support. Optional — the router continues to work without it.
      </p>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto text-center p-8 space-y-4">
        <UIcon
          name="i-lucide-message-circle"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Not sure which service you need?
        </h2>

        <p class="text-muted">
          Drop us a message and we'll talk through your situation — no commitment, no pressure. We'll tell you honestly what we think will make the most difference for you.
        </p>

        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-arrow-right"
          trailing>
          Get in Touch
        </UButton>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Consultancy Services | NodeVault',
  description: 'Hands-on privacy setup services: bespoke GrapheneOS phones, UmbrelOS home server setup, and Privacy Router installation. We source, configure, and install — you just use it.',
  ogTitle: 'Consultancy Services | NodeVault',
  ogDescription: 'GrapheneOS phone setup, UmbrelOS home server installation, and Privacy Router configuration. We handle everything.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'privacy setup service UK, GrapheneOS installation UK, UmbrelOS setup service, home network privacy setup, privacy router installation UK',
})

const phonePlans = [
  {
    name: 'Installation Only',
    price: '£200',
    highlight: false,
    description: 'Supply your own compatible Pixel (6–9). We install GrapheneOS and hand it back configured and ready.',
    features: [
      'GrapheneOS installation on your device',
      'Bootloader relocked, verified boot confirmed',
      'Base privacy app stack (browser, messaging)',
      'Permission review and lockdown',
      'Written setup guide',
    ],
  },
  {
    name: 'Bespoke Full Setup',
    price: '£350',
    highlight: true,
    description: 'We source the phone, install GrapheneOS, and configure everything to your specification — your apps, your settings, your way.',
    features: [
      'Phone sourced on your behalf (Pixel 8a or 9 recommended)',
      'GrapheneOS installation, bootloader relocked',
      'Full privacy app stack installed to your spec',
      'Permission audit and lockdown, app by app',
      'Accounts and cloud services configured',
      '30-minute video call handover walkthrough',
      '30 days email support included',
    ],
  },
]

const homeServerTiers = [
  {
    name: 'Advice Session',
    tagline: 'Not sure where to start?',
    price: '£75',
    highlight: false,
    description: 'A one-hour video call to assess your situation, recommend hardware, and walk through what UmbrelOS can do for you.',
    includes: [
      '1-hour video call',
      'Personalised hardware recommendations',
      'Software stack recommendations',
      'Written summary of what we discussed',
      'Follow-up email Q&A for 7 days',
    ],
  },
  {
    name: 'Full Home Server Setup',
    tagline: 'We handle everything',
    price: '£350',
    highlight: true,
    description: 'We procure hardware (or use yours), install UmbrelOS, configure your chosen apps, set up remote access, and hand over in a training call.',
    includes: [
      'Hardware procurement and sourcing',
      'UmbrelOS installation and configuration',
      'Up to 5 apps configured (Nextcloud, Vaultwarden, Pi-hole, etc.)',
      'WireGuard VPN for remote access',
      'DNS setup and local domain',
      '2-hour handover and training session',
      '60 days Signal support included',
    ],
  },
  {
    name: 'Complete Home Network',
    tagline: 'Total digital sovereignty',
    price: '£750',
    highlight: false,
    description: 'A comprehensive overhaul: router and network configuration, VLAN segmentation, server setup, all apps, and 3 months of monthly check-ins.',
    includes: [
      'Everything in Full Home Server Setup',
      'Router and network architecture design',
      'VLAN setup (IoT, guest, trusted device isolation)',
      'Unlimited apps configured',
      'Network-wide Pi-hole with custom blocklists',
      '3 months of monthly check-in calls',
      'Priority Signal support for 3 months',
    ],
  },
]

const routerPlans = [
  {
    name: 'Home Router',
    price: '£175',
    subscription: '£12',
    badge: null,
    badgeColor: 'neutral' as const,
    description: 'For households up to 50 devices. Raspberry Pi 5 based, fanless enclosure — sourced, built, and installed by us.',
    features: [
      'Components sourced and built by us',
      'Pi-hole + AdGuard Home DNS filtering',
      'WireGuard VPN gateway',
      'Basic VLAN support (2 networks)',
      'Full home installation included',
      'NodeVault dashboard access',
      'Remote onboarding call',
    ],
  },
  {
    name: 'Office Router',
    price: '£275',
    subscription: '£20',
    badge: 'More Powerful',
    badgeColor: 'primary' as const,
    description: 'For homes or offices up to 100 devices. Protectli hardware with dual NICs — sourced, built, and installed by us.',
    features: [
      'Components sourced and built by us',
      'Protectli VP2420 quad-core hardware',
      'Dual NIC for proper router-mode deployment',
      'Pi-hole + AdGuard Home with custom blocklists',
      'WireGuard VPN gateway',
      'Full VLAN isolation (up to 8 networks)',
      'Full home installation included',
      'Traffic logging and query history',
      'NodeVault dashboard with user management',
      'Priority support and remote onboarding',
    ],
  },
]
</script>
