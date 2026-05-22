<template>
  <UPage>
    <UPageHero
      title="Your home network is more compromised than you think"
      description="Smart TVs, voice assistants, thermostats, and light bulbs are all connected to the same network as your laptop and phone. Most of them phone home constantly. A privacy router — running Pi-hole, WireGuard, and VLANs — fixes this for every device at once."
      align="center">
      <template #links>
        <UButton
          to="#how-it-works"
          size="xl"
          icon="i-lucide-cpu"
          variant="outline"
          color="neutral">
          How It Works
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
      title="What IoT devices are doing on your network"
      description="Internet of Things devices are notoriously chatty. Most send data to manufacturer servers constantly — and because they sit on your home network alongside your laptop and phone, a compromised or malicious device represents a real risk."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 max-w-4xl mx-auto">
        <div
          v-for="threat in iotThreats"
          :key="threat.device"
          class="flex items-start gap-4 p-5 rounded-xl border border-default bg-muted/20">
          <div class="flex items-center justify-center size-10 rounded-lg bg-muted shrink-0">
            <UIcon
              :name="threat.icon"
              class="size-5 text-muted" />
          </div>

          <div>
            <p class="font-semibold text-sm">
              {{ threat.device }}
            </p>

            <p class="text-xs text-muted mt-1 leading-relaxed">
              {{ threat.detail }}
            </p>
          </div>
        </div>
      </div>

      <UCallout
        class="mt-8 max-w-3xl mx-auto text-left"
        icon="i-lucide-alert-triangle"
        color="warning">
        Research by Princeton's IoT Inspector project found that smart TVs contact known advertising and tracking domains thousands of times per day. By default, there is no network-level mechanism to stop them.
      </UCallout>
    </UPageSection>

    <UPageSection
      title="The two core problems — and how to solve them"
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl mx-auto">
        <div class="rounded-2xl border border-default p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
              <UIcon
                name="i-lucide-eye-off"
                class="size-5 text-primary" />
            </div>

            <h3 class="font-bold">
              Tracking & surveillance
            </h3>
          </div>

          <p class="text-sm text-muted">
            Every ad network, tracker, and telemetry service your devices contact uses DNS lookups — they have to translate a domain name to an IP address before any data can be sent.
          </p>

          <p class="text-sm text-muted">
            A DNS-level blocker (Pi-hole or AdGuard Home) intercepts those lookups before they leave your network. The request never reaches the tracker. This works for <strong>every device on your network</strong> — including TVs, game consoles, and smart speakers that don't support browser extensions or VPNs.
          </p>
        </div>

        <div class="rounded-2xl border border-default p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
              <UIcon
                name="i-lucide-git-branch"
                class="size-5 text-primary" />
            </div>

            <h3 class="font-bold">
              Lateral movement risk
            </h3>
          </div>

          <p class="text-sm text-muted">
            By default, every device on your home network can talk to every other device. A compromised smart bulb, camera, or thermostat could in theory scan your network, identify other devices, and attempt to reach them.
          </p>

          <p class="text-sm text-muted">
            VLAN (Virtual LAN) isolation creates separate network segments — your IoT devices, your trusted devices, and your guests each get their own network that cannot communicate with the others. A compromised bulb literally cannot reach your laptop.
          </p>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      id="how-it-works"
      title="How a privacy router works"
      description="A privacy router sits between your ISP router and your home network. It inspects DNS queries, blocks trackers before they connect, routes traffic through VPN, and keeps your IoT devices away from your main network."
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
        icon="i-lucide-code"
        color="primary">
        The full software stack — Pi-hole, AdGuard Home, WireGuard, and OpenWRT — is open source, auditable, and community-maintained. You own the hardware, you own the configuration, and there's no vendor lock-in.
      </UCallout>
    </UPageSection>

    <UPageSection
      title="One device. Every device protected."
      description="Unlike browser extensions or per-device VPNs, DNS-level blocking works for everything on your network simultaneously."
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
      title="What gets blocked"
      description="DNS-level blocking stops requests before they leave your network. Unlike browser extensions, it covers every device — including those that don't support extensions at all."
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
          If you're thinking about setting up a privacy router and would like some advice — what hardware to use, which software stack makes sense, or how VLANs work — feel free to get in touch. Happy to help.
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
  title: 'Privacy Router — Protect Your Home Network | NodeVault',
  description: 'Smart TVs, voice assistants, and IoT devices phone home constantly. A privacy router with Pi-hole, WireGuard VPN, and VLANs blocks tracking and isolates risky devices for every device on your network.',
  ogTitle: 'Privacy Router — Home Network Protection | NodeVault',
  ogDescription: 'DNS-level tracking protection and VLAN isolation for your home network. Covers every device without installing anything on each one.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'privacy router, Pi-hole home, DNS blocker, WireGuard VPN home, VLAN isolation home network, IoT security home, AdGuard Home',
})

const iotThreats = [
  {
    device: 'Smart TVs',
    icon: 'i-lucide-tv',
    detail: 'Samsung, LG, and Vizio TVs use Automatic Content Recognition to identify every frame of content on screen and report it to advertising platforms. Samsung TVs alone contact over 700 distinct tracking domains. This cannot be disabled from the settings menu.',
  },
  {
    device: 'Amazon Echo / Google Nest',
    icon: 'i-lucide-mic',
    detail: 'Voice assistants listen for wake words continuously and send audio snippets to manufacturer servers. Both Amazon and Google employ human reviewers who listen to recordings. Amazon retains recordings indefinitely unless manually deleted.',
  },
  {
    device: 'Smart thermostats & cameras',
    icon: 'i-lucide-thermometer',
    detail: 'Nest, Ring, and Arlo devices send continuous telemetry including home/away patterns, motion events, and in Ring\'s case, have historically shared footage with law enforcement without user consent.',
  },
  {
    device: 'Smart appliances & bulbs',
    icon: 'i-lucide-lightbulb',
    detail: 'Philips Hue, LIFX, and similar devices regularly contact manufacturer servers even when fully functional offline. Security researchers have found vulnerabilities in smart bulbs that allow network scanning from the device.',
  },
  {
    device: 'Games consoles',
    icon: 'i-lucide-gamepad-2',
    detail: 'Xbox and PlayStation devices send detailed telemetry about usage patterns, achievement data, and network topology to Microsoft and Sony. They also serve advertising and cannot be fully opted out of.',
  },
  {
    device: 'Printers',
    icon: 'i-lucide-printer',
    detail: 'HP, Canon, and Epson printers phone home regularly — reporting ink levels, usage statistics, and in some cases, a log of what you\'ve printed. Some printers contact manufacturer servers even when printing locally.',
  },
]

const howItWorks = [
  {
    title: 'Plug in',
    description: 'The privacy router connects between your ISP router and your home network. All traffic passes through it.',
  },
  {
    title: 'DNS intercept',
    description: 'Every DNS lookup from every device passes through Pi-hole or AdGuard Home before going anywhere on the internet.',
  },
  {
    title: 'Block & filter',
    description: 'Known tracking, ad, and malware domains are blocked at the DNS level. Clean requests are forwarded via encrypted DNS-over-HTTPS.',
  },
  {
    title: 'VLAN isolation',
    description: 'IoT devices, trusted devices, and guests are separated into distinct network segments that cannot communicate with each other.',
  },
]

const features = [
  {
    title: 'DNS-Level Ad & Tracker Blocking',
    description: 'Blocks trackers, adverts, and malware domains before they reach any device. Works on phones, TVs, smart speakers, and anything else connected to your Wi-Fi without per-device setup.',
    icon: 'i-lucide-shield-off',
  },
  {
    title: 'WireGuard VPN Gateway',
    description: 'Connects your entire network to a VPN provider of your choice. Every device gets VPN protection without needing its own VPN app or configuration.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'VLAN Isolation',
    description: 'Separates your IoT devices from your main network. Smart home devices cannot communicate with your laptop or phone — even if one is compromised or malicious.',
    icon: 'i-lucide-git-branch',
  },
  {
    title: 'Open Source Stack',
    description: 'Pi-hole, AdGuard Home, WireGuard, and OpenWRT — all community-maintained and fully auditable. You own the hardware and the config. No subscriptions, no vendor lock-in.',
    icon: 'i-lucide-code',
  },
]

const blockedCategories = [
  {
    title: 'Advertising networks',
    description: 'Google Ads, Facebook Pixel, and hundreds of other ad networks — blocked before the request leaves your network.',
    icon: 'i-lucide-ban',
  },
  {
    title: 'Tracking & analytics',
    description: 'Google Analytics, Facebook tracking, Hotjar, and other behavioural analytics tools that follow you across the web.',
    icon: 'i-lucide-eye-off',
  },
  {
    title: 'Smart TV & IoT telemetry',
    description: 'Samsung, LG, Roku, and smart appliance telemetry that sends usage and viewing data back to manufacturers.',
    icon: 'i-lucide-tv',
  },
  {
    title: 'Malware & phishing domains',
    description: 'Known malware distribution and phishing sites — blocked for every device on your network automatically.',
    icon: 'i-lucide-bug',
  },
  {
    title: 'Social media trackers',
    description: 'Facebook, X/Twitter, and LinkedIn tracking scripts embedded in third-party websites you visit.',
    icon: 'i-lucide-share-2',
  },
  {
    title: 'Data broker platforms',
    description: 'Acxiom, Experian Marketing, and similar data aggregators that profile your browsing behaviour across sites.',
    icon: 'i-lucide-database',
  },
]

const audiences = [
  {
    title: 'Privacy-conscious households',
    description: 'Protect every device in your home — phones, tablets, smart TVs, and voice assistants — without installing anything on each one individually.',
    icon: 'i-lucide-home',
  },
  {
    title: 'Smart home owners',
    description: 'Smart speakers, cameras, and appliances are notoriously chatty. A privacy router blocks their telemetry and isolates them so a compromised bulb can\'t reach your laptop.',
    icon: 'i-lucide-cpu',
  },
  {
    title: 'Remote workers',
    description: 'A WireGuard VPN gateway gives your home network the same protection as a corporate environment — without a monthly SaaS subscription.',
    icon: 'i-lucide-laptop',
  },
  {
    title: 'Families',
    description: 'DNS-level blocking also covers malware and phishing domains — protecting children\'s devices, games consoles, and every other device in the house simultaneously.',
    icon: 'i-lucide-users',
  },
]
</script>
