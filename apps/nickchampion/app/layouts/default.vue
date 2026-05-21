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
        label: 'Phone Hardening Service', description: 'GrapheneOS, CalyxOS & /e/OS installation', to: '/phones', icon: 'i-lucide-smartphone',
      },
      {
        label: 'Compatible Devices', description: 'Phones we work with and recommend', to: '/phones/devices', icon: 'i-lucide-list',
      },
      {
        label: 'Privacy App Stack', description: 'What gets installed and configured', to: '/phones/software', icon: 'i-lucide-layout-grid',
      },
    ],
  },
  {
    label: 'Home Network',
    to: '/umbrelos',
    children: [
      {
        label: 'Self-Hosting Overview', description: 'Replace Big Tech with apps you own', to: '/umbrelos', icon: 'i-lucide-server',
      },
      {
        label: 'Consulting', description: 'Expert setup for your home network', to: '/umbrelos/consulting', icon: 'i-lucide-wrench',
      },
      {
        label: 'App Directory', description: 'Self-hosted app reviews and guides', to: '/umbrelos/apps', icon: 'i-lucide-layout-grid',
      },
    ],
  },
  {
    label: 'Privacy Router',
    to: '/privacy-router',
    children: [
      {
        label: 'What Is Privacy Router?', description: 'Whole-network privacy in one appliance', to: '/privacy-router', icon: 'i-lucide-box',
      },
      {
        label: 'How It Works', description: 'DNS blocking, VPN, VLAN isolation', to: '/privacy-router#how-it-works', icon: 'i-lucide-cpu',
      },
      {
        label: 'Pricing & Options', description: 'Home and office hardware bundles', to: '/privacy-router#pricing', icon: 'i-lucide-tag',
      },
    ],
  },
  {
    label: 'For Business',
    to: '/business',
    children: [
      {
        label: 'Privacy Audit', description: 'Find and fix your data exposure', to: '/business', icon: 'i-lucide-search',
      },
      {
        label: 'GDPR Guide', description: 'Your legal obligations explained plainly', to: '/gdpr', icon: 'i-lucide-scroll-text',
      },
    ],
  },
  { label: 'Contact', to: '/company/contact' },
]
</script>
