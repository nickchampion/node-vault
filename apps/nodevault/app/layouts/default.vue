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
    label: 'Privacy Phones',
    to: '/phones',
    children: [
      {
        label: 'De-Google Your Phone', description: 'Why GrapheneOS and how to get started', to: '/phones', icon: 'i-lucide-smartphone',
      },
      {
        label: 'Compatible Devices', description: 'Which Google Pixel models work with GrapheneOS', to: '/phones/devices', icon: 'i-lucide-list',
      },
      {
        label: 'Privacy App Stack', description: 'Privacy-respecting alternatives to Google apps', to: '/phones/software', icon: 'i-lucide-layout-grid',
      },
    ],
  },
  {
    label: 'Home Server',
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
    label: 'Privacy Router',
    to: '/privacy-router',
    children: [
      {
        label: 'Protect Your Network', description: 'Block tracking and isolate IoT devices', to: '/privacy-router', icon: 'i-lucide-box',
      },
      {
        label: 'How It Works', description: 'DNS blocking, WireGuard VPN, and VLAN isolation', to: '/privacy-router#how-it-works', icon: 'i-lucide-cpu',
      },
    ],
  },
  { label: 'Blog', to: '/blog' },
  { label: 'Get in Touch', to: '/company/contact' },
]
</script>
