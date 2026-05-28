<template>
  <div class="bg-background min-h-screen flex flex-col">
    <AppHeader :links="navLinks" />

    <UMain class="flex-1">
      <slot />
    </UMain>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navLinks: NavigationMenuItem[] = [
  {
    label: 'GrapheneOS',
    to: '/grapheneos',
    children: [
      {
        label: 'De-Google Your Phone', description: 'Why GrapheneOS and how to get started', to: '/grapheneos', icon: 'i-lucide-smartphone',
      },
      {
        label: 'Privacy App Stack', description: 'Privacy-respecting alternatives to Google apps', to: '/grapheneos/apps', icon: 'i-lucide-layout-grid',
      },
    ],
  },
  {
    label: 'UmbrelOS',
    to: '/umbrelos',
    children: [
      {
        label: 'Own Your Cloud', description: 'Self-host with UmbrelOS — replace cloud subscriptions with your own server', to: '/umbrelos', icon: 'i-lucide-server',
      },
      {
        label: 'App Directory', description: 'Self-hosted apps and what they replace', to: '/umbrelos/apps', icon: 'i-lucide-layout-grid',
      },
    ],
  },
  {
    label: 'OPNSense Router',
    to: '/opnsense',
    children: [
      {
        label: 'Protect Your Network', description: 'Block tracking and isolate IoT devices', to: '/opnsense', icon: 'i-lucide-box',
      },
      {
        label: 'How It Works', description: 'DNS blocking, WireGuard VPN, and VLAN isolation', to: '/opnsense#how-it-works', icon: 'i-lucide-cpu',
      },
    ],
  },
  // { label: 'Our services', to: '/services' },
  { label: 'Blog', to: '/blog/structuring-your-grapheneos-install' },
]
</script>
