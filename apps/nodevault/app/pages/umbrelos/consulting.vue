<template>
  <UPage>
    <UPageHero
      title="Home Network Setup & Consulting"
      description="We design, source, install, and configure your UmbrelOS home server — then hand it over to you with a full training session. You get a working, private home network without needing to read a single tutorial."
      align="center">
      <template #links>
        <UButton
          :to="`mailto:${config.contact.email}`"
          size="xl"
          icon="i-lucide-mail">
          Get in Touch
        </UButton>

        <UButton
          to="/umbrelos"
          size="xl"
          icon="i-lucide-info"
          variant="outline"
          color="neutral">
          What Is UmbrelOS?
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Service Tiers"
      description="Every situation is different. Pick the level of help you need, or get in touch and we'll figure it out together."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <UCard
          v-for="tier in tiers"
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
            :to="`mailto:${config.contact.email}`"
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

    <UPageSection
      title="What We Can Set Up For You"
      description="Every engagement includes expert configuration of whichever combination of these services fits your life."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="service in services"
          :key="service.title"
          :title="service.title"
          :description="service.description"
          :icon="service.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="How a Consultation Works"
      description="We keep things simple and practical. No jargon, no unnecessary complexity."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">
        <div
          v-for="(step, index) in process"
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
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
import { useConfig } from '@nodevault/platform.components.nodevault.client'

useSeoMeta({
  title: 'UmbrelOS Home Network Setup & Consulting | NodeVault',
  description: 'We design, source, install, and configure your UmbrelOS home server — then hand it over with a full training session. Get a working, private home network without reading a single tutorial.',
  ogTitle: 'UmbrelOS Home Network Setup & Consulting | NodeVault',
  ogDescription: 'Expert UmbrelOS setup from NodeVault. We handle everything — hardware sourcing, installation, configuration, and training.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'UmbrelOS Setup & Consulting | NodeVault',
  twitterDescription: 'Full UmbrelOS home server setup and consulting service. We handle everything so you don\'t have to.',
  keywords: 'UmbrelOS setup, home server consulting, self-hosted setup service, Nextcloud installation, home network configuration, UmbrelOS UK',
})

const config = useConfig()
const tiers = [
  {
    name: 'Advice Session',
    tagline: 'Not sure where to start?',
    price: '£75',
    highlight: false,
    description: 'A one-hour video call to assess your situation, recommend hardware, walk through what UmbrelOS can do for you, and answer every question you have.',
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
    description: 'We procure hardware (or use yours), install UmbrelOS, configure your chosen apps, set up remote access, and hand everything over in a full training call.',
    includes: [
      'Hardware procurement advice & sourcing',
      'UmbrelOS installation & configuration',
      'Up to 5 apps configured (Nextcloud, Vaultwarden, Pi-hole, etc.)',
      'WireGuard VPN for remote access',
      'DNS setup and local domain',
      '2-hour handover & training session',
      '60 days of Signal support included',
    ],
  },
  {
    name: 'Complete Home Network',
    tagline: 'Total digital sovereignty',
    price: '£750',
    highlight: false,
    description: 'A comprehensive overhaul: router and network configuration, VLAN segmentation, server setup, all apps, and ongoing monthly check-ins for three months.',
    includes: [
      'Everything in Full Home Server Setup',
      'Router and network architecture design',
      'VLAN setup (isolate IoT, guest, trusted devices)',
      'Unlimited apps configured',
      'Network-wide Pi-hole with custom blocklists',
      '3 months of monthly check-in calls',
      'Priority Signal support for 3 months',
    ],
  },
]

const services = [
  {
    title: 'File Storage & Sync',
    description: 'Nextcloud configured to auto-backup photos from your phone, sync files across devices, and share with family — just like Dropbox or Google Drive but yours.',
    icon: 'i-lucide-hard-drive',
  },
  {
    title: 'Password Manager',
    description: 'Vaultwarden (self-hosted Bitwarden) set up and connected to your devices. Every password in a vault you control, synced via your home server.',
    icon: 'i-lucide-key-round',
  },
  {
    title: 'Network Ad Blocking',
    description: 'Pi-hole installed and configured to block ads and trackers for every device on your network — without installing anything on phones, TVs, or smart speakers.',
    icon: 'i-lucide-shield',
  },
  {
    title: 'Private VPN',
    description: 'WireGuard configured so you can securely access your home network — and all its services — from anywhere in the world. No commercial VPN fees.',
    icon: 'i-lucide-lock',
  },
  {
    title: 'Media Server',
    description: 'Jellyfin set up to stream your personal film, TV, and music library to any device. Remote access configured so you can watch from anywhere.',
    icon: 'i-lucide-play-circle',
  },
  {
    title: 'Photo Backup',
    description: 'Immich configured to automatically back up photos from every family phone. Face recognition, shared albums, and searchable archive on your hardware.',
    icon: 'i-lucide-image',
  },
]

const process = [
  {
    title: 'Discovery Call',
    description: 'We talk through what you use today, what you want to replace, and what hardware you have or want to buy. Free, 30 minutes.',
  },
  {
    title: 'Hardware Plan',
    description: 'We send a specific shopping list with links. No upselling — just exactly what you need for the services you want.',
  },
  {
    title: 'Remote Setup',
    description: 'Once hardware arrives, we connect remotely (or visit in person for Complete packages) and handle the full installation.',
  },
  {
    title: 'Training Session',
    description: 'A video call where we walk through everything — how to use each app, how to manage the server, what to do if something goes wrong.',
  },
  {
    title: 'Ongoing Support',
    description: 'Access to us via Signal for your included support period. Updates, questions, new apps — we\'re there when you need us.',
  },
]
</script>
