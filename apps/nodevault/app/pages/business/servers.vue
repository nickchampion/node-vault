<template>
  <UPage>
    <UPageHero
      title="Managed Cloud Infrastructure for Small Practices"
      description="We run a secure, EU-hosted stack of open source applications on your behalf — Nextcloud, Vaultwarden, and more — so your practice has proper file storage, password management, and document sharing without relying on US cloud providers. You own the data. We manage everything else."
      align="center">
      <template #links>
        <UButton
          :to="`mailto:${config.contact.email}`"
          size="xl"
          icon="i-lucide-mail">
          Discuss Your Requirements
        </UButton>

        <UButton
          to="/business"
          size="xl"
          icon="i-lucide-arrow-left"
          variant="outline"
          color="neutral">
          Back to Overview
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="What's Included"
      description="Each deployment is a Docker Compose stack running on dedicated cloud infrastructure hosted in Germany. We configure and maintain the applications — you and your team just use them."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="app in apps"
          :key="app.title"
          :title="app.title"
          :description="app.description"
          :icon="app.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="The GDPR Compliance Picture"
      description="Where your data is hosted and who has access to it are material questions under UK GDPR. This infrastructure gives you clear, verifiable answers to both."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div
          v-for="point in gdprPoints"
          :key="point.title"
          class="flex items-start gap-4 p-5 rounded-xl border border-default">
          <UIcon
            :name="point.icon"
            class="size-5 text-primary shrink-0 mt-0.5" />

          <div>
            <p class="font-semibold text-sm">
              {{ point.title }}
            </p>

            <p class="text-sm text-muted mt-1">
              {{ point.detail }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="How This Compares"
      align="center">
      <div class="overflow-x-auto mt-8">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-default">
              <th class="text-left py-3 pr-6 font-semibold text-muted w-48" />

              <th class="text-center py-3 px-4 font-semibold">
                <div class="flex flex-col items-center gap-1">
                  <UIcon
                    name="i-lucide-server"
                    class="size-4 text-primary" />

                  <span>NodeVault Cloud</span>
                </div>
              </th>

              <th class="text-center py-3 px-4 font-semibold text-muted">
                <div class="flex flex-col items-center gap-1">
                  <UIcon
                    name="i-lucide-building"
                    class="size-4" />

                  <span>Google / Microsoft</span>
                </div>
              </th>

              <th class="text-center py-3 px-4 font-semibold text-muted">
                <div class="flex flex-col items-center gap-1">
                  <UIcon
                    name="i-lucide-home"
                    class="size-4" />

                  <span>Office Server</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="row in comparison"
              :key="row.aspect"
              class="border-b border-default last:border-0">
              <td class="py-3 pr-6 font-medium text-sm">
                {{ row.aspect }}
              </td>

              <td class="text-center py-3 px-4">
                <div class="flex flex-col items-center gap-0.5">
                  <UIcon
                    :name="row.nodevault.icon"
                    :class="row.nodevault.positive ? 'text-primary' : 'text-muted'"
                    class="size-4" />

                  <span class="text-xs text-muted">{{ row.nodevault.label }}</span>
                </div>
              </td>

              <td class="text-center py-3 px-4">
                <div class="flex flex-col items-center gap-0.5">
                  <UIcon
                    :name="row.saas.icon"
                    :class="row.saas.positive ? 'text-primary' : 'text-muted'"
                    class="size-4" />

                  <span class="text-xs text-muted">{{ row.saas.label }}</span>
                </div>
              </td>

              <td class="text-center py-3 px-4">
                <div class="flex flex-col items-center gap-0.5">
                  <UIcon
                    :name="row.office.icon"
                    :class="row.office.positive ? 'text-primary' : 'text-muted'"
                    class="size-4" />

                  <span class="text-xs text-muted">{{ row.office.label }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto text-center p-8 space-y-4">
        <UIcon
          name="i-lucide-mail"
          class="size-10 text-primary mx-auto" />

        <h2 class="text-2xl font-bold">
          Get a quote for your practice
        </h2>

        <p class="text-muted">
          Tell us about your team size, what tools you currently use, and what you need to store and share. We'll come back with a clear, fixed monthly price.
        </p>

        <UButton
          :to="`mailto:${config.contact.email}`"
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
import { useConfig } from '@nodevault/platform.components.nodevault.client'

useSeoMeta({
  title: 'Managed Cloud Infrastructure for Small Practices | NodeVault',
  description: 'EU-hosted, GDPR-compliant cloud infrastructure for small professional practices. Nextcloud, Vaultwarden, and more — managed by NodeVault on Hetzner Germany. No US cloud exposure.',
  ogTitle: 'Managed Cloud Infrastructure for Small Practices | NodeVault',
  ogDescription: 'Open source apps hosted in the EU, managed for you. Replace Google Drive and Dropbox with GDPR-compliant infrastructure your practice actually controls.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Managed Cloud Infrastructure for Small Practices | NodeVault',
  twitterDescription: 'EU-hosted Nextcloud and Vaultwarden for small practices. GDPR-compliant, managed by NodeVault.',
  keywords: 'managed cloud infrastructure small business, Nextcloud managed hosting UK, GDPR compliant cloud storage, EU hosted cloud, replace Google Drive GDPR, Hetzner Nextcloud, self-hosted business cloud',
})

const config = useConfig()

const apps = [
  {
    title: 'Nextcloud — File Storage & Sharing',
    description: 'Secure file storage, shared folders, and client document sharing. Replaces Google Drive and Dropbox. Includes Nextcloud Office for collaborative editing of documents, spreadsheets, and presentations — full Microsoft Office compatibility, no Google account required.',
    icon: 'i-lucide-folder-open',
  },
  {
    title: 'Vaultwarden — Password Management',
    description: 'A self-hosted Bitwarden-compatible server for practice-wide password management. Client-side encrypted — the server never sees your plaintext passwords. Share credentials securely between team members with role-based access.',
    icon: 'i-lucide-key-round',
  },
  {
    title: 'Nextcloud Calendar & Contacts',
    description: 'CalDAV and CardDAV built into Nextcloud. Team calendars and contacts synced privately across all devices — replaces Google Calendar and Google Contacts without any data leaving your infrastructure.',
    icon: 'i-lucide-calendar',
  },
  {
    title: 'Nextcloud Talk — Secure Messaging',
    description: 'Encrypted team messaging and video calls hosted on your own infrastructure. A compliant alternative to WhatsApp for internal team communications — no metadata harvesting, no third-party servers.',
    icon: 'i-lucide-message-square',
  },
  {
    title: 'Paperless-ngx — Document Management',
    description: 'Scan, OCR, and organise practice documents — contracts, invoices, correspondence — with automatic tagging and full-text search. Every document indexed and retrievable without paper filing.',
    icon: 'i-lucide-archive',
  },
  {
    title: 'Monitoring & Backups',
    description: 'Automated encrypted backups run daily. Uptime monitoring alerts NodeVault immediately if any service goes down. SSL certificates auto-renewed. You get a system that stays up without any involvement from you.',
    icon: 'i-lucide-activity',
  },
]

const gdprPoints = [
  {
    title: 'EU jurisdiction — Hetzner, Germany',
    icon: 'i-lucide-map-pin',
    detail: 'All infrastructure runs on Hetzner\'s data centres in Germany. German data protection law (BDSG) applies — stricter than most EU member states. No CLOUD Act exposure: US law cannot compel access to data held on EU-based providers with no US parent company.',
  },
  {
    title: 'Signed Data Processing Agreement',
    icon: 'i-lucide-handshake',
    detail: 'UK GDPR Article 28 requires a written DPA with every data processor. NodeVault provides a DPA covering our role as your processor, and we maintain our own DPA with Hetzner as sub-processor. Both are available on request.',
  },
  {
    title: 'A clear answer to "where is data stored?"',
    icon: 'i-lucide-map',
    detail: 'Your ROPA can state precisely: client data is stored on dedicated cloud infrastructure hosted in Nuremberg, Germany, operated by NodeVault under a signed Data Processing Agreement. That is a verifiable, defensible answer — which Google Drive and Dropbox cannot provide.',
  },
  {
    title: 'Your data, isolated from other clients',
    icon: 'i-lucide-lock',
    detail: 'Each practice runs on a dedicated server instance, not a shared database. Your data is logically and physically isolated from other NodeVault clients. Access is restricted to your team and to NodeVault for maintenance purposes only.',
  },
  {
    title: 'Encrypted at rest and in transit',
    icon: 'i-lucide-shield-check',
    detail: 'All data is encrypted in transit via TLS. Disk-level encryption is applied at rest. Vaultwarden stores passwords with client-side encryption — the server holds only ciphertext. Backups are encrypted before leaving the server.',
  },
  {
    title: 'Replaces processors you cannot justify',
    icon: 'i-lucide-cloud-off',
    detail: 'Google Drive, Dropbox, and Microsoft 365 are US-headquartered companies subject to the CLOUD Act. Using them for special category client data is a compliance risk that is difficult to justify when EU-based alternatives exist. This infrastructure removes that risk entirely.',
  },
]

const comparison = [
  {
    aspect: 'Data jurisdiction',
    nodevault: { icon: 'i-lucide-check', label: 'EU (Germany)', positive: true },
    saas: { icon: 'i-lucide-x', label: 'US (CLOUD Act)', positive: false },
    office: { icon: 'i-lucide-check', label: 'On-premises', positive: true },
  },
  {
    aspect: 'Signed DPA available',
    nodevault: { icon: 'i-lucide-check', label: 'Yes, included', positive: true },
    saas: { icon: 'i-lucide-minus', label: 'Varies', positive: false },
    office: { icon: 'i-lucide-minus', label: 'N/A', positive: false },
  },
  {
    aspect: 'Managed for you',
    nodevault: { icon: 'i-lucide-check', label: 'Fully managed', positive: true },
    saas: { icon: 'i-lucide-check', label: 'Yes', positive: true },
    office: { icon: 'i-lucide-x', label: 'You manage it', positive: false },
  },
  {
    aspect: 'Uptime / reliability',
    nodevault: { icon: 'i-lucide-check', label: 'Data centre grade', positive: true },
    saas: { icon: 'i-lucide-check', label: 'High', positive: true },
    office: { icon: 'i-lucide-x', label: 'Depends on office', positive: false },
  },
  {
    aspect: 'Data used for advertising',
    nodevault: { icon: 'i-lucide-check', label: 'Never', positive: true },
    saas: { icon: 'i-lucide-x', label: 'Often', positive: false },
    office: { icon: 'i-lucide-check', label: 'Never', positive: true },
  },
  {
    aspect: 'Access from anywhere',
    nodevault: { icon: 'i-lucide-check', label: 'Yes', positive: true },
    saas: { icon: 'i-lucide-check', label: 'Yes', positive: true },
    office: { icon: 'i-lucide-minus', label: 'VPN required', positive: false },
  },
  {
    aspect: 'Cost model',
    nodevault: { icon: 'i-lucide-check', label: 'Fixed monthly', positive: true },
    saas: { icon: 'i-lucide-minus', label: 'Per seat / month', positive: false },
    office: { icon: 'i-lucide-minus', label: 'Hardware + time', positive: false },
  },
  {
    aspect: 'No vendor lock-in',
    nodevault: { icon: 'i-lucide-check', label: 'Open formats', positive: true },
    saas: { icon: 'i-lucide-x', label: 'Proprietary', positive: false },
    office: { icon: 'i-lucide-check', label: 'Open formats', positive: true },
  },
]
</script>
