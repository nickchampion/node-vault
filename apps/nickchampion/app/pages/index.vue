<template>
  <UPage>
    <UPageHero
      title="Privacy Tools for People Who Mean It"
      description="NodeVault offers four practical privacy services: privacy OS installation for your phone, home network protection, a plug-in privacy appliance, and hands-on privacy audits for small businesses. No jargon, no subscriptions you don't need, no Big Tech."
      align="center">
      <template #links>
        <UButton
          to="/phones"
          size="xl"
          icon="i-lucide-smartphone">
          Privacy Phones
        </UButton>

        <UButton
          to="/privacy-router"
          size="xl"
          icon="i-lucide-box"
          variant="outline"
          color="neutral">
          Privacy Router
        </UButton>

        <UButton
          to="/business"
          size="xl"
          icon="i-lucide-building-2"
          variant="outline"
          color="neutral">
          For Business
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Four Ways to Take Back Your Privacy"
      description="Each service is independent — choose what applies to you or combine them for layered protection across your devices, network, and organisation."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <UCard
          v-for="offering in offerings"
          :key="offering.title"
          class="flex flex-col gap-4">
          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center size-12 rounded-xl bg-primary/10 shrink-0">
              <UIcon
                :name="offering.icon"
                class="size-6 text-primary" />
            </div>

            <div class="flex-1">
              <h3 class="font-semibold text-lg leading-tight">
                {{ offering.title }}
              </h3>

              <p class="text-sm text-primary font-medium mt-0.5">
                {{ offering.tagline }}
              </p>
            </div>
          </div>

          <p class="text-sm text-muted flex-1">
            {{ offering.description }}
          </p>

          <ul class="space-y-1.5">
            <li
              v-for="point in offering.points"
              :key="point"
              class="flex items-start gap-2 text-sm">
              <UIcon
                name="i-lucide-check"
                class="size-4 text-primary shrink-0 mt-0.5" />

              <span>{{ point }}</span>
            </li>
          </ul>

          <UButton
            :to="offering.href"
            variant="outline"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            {{ offering.cta }}
          </UButton>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="Why Privacy Matters Now"
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="reason in reasons"
          :key="reason.title"
          :title="reason.title"
          :description="reason.description"
          :icon="reason.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="For Small Businesses"
      description="Therapists, solicitors, accountants, and GPs have legal obligations under UK GDPR around the sensitive client data they hold. We audit your digital footprint, identify the gaps, and give you a clear remediation plan — without the consultancy day rate."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <UCard
          v-for="sector in sectors"
          :key="sector.title"
          class="flex flex-col gap-3 text-center items-center p-5">
          <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10">
            <UIcon
              :name="sector.icon"
              class="size-5 text-primary" />
          </div>

          <p class="font-semibold text-sm">
            {{ sector.title }}
          </p>

          <p class="text-xs text-muted">
            {{ sector.risk }}
          </p>
        </UCard>
      </div>

      <div class="text-center mt-8">
        <UButton
          to="/business"
          size="lg"
          icon="i-lucide-arrow-right"
          trailing>
          See the Business Privacy Audit
        </UButton>
      </div>
    </UPageSection>

    <UPageSection align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <UCard
          v-for="stat in stats"
          :key="stat.label"
          class="text-center p-6 flex flex-col gap-2">
          <p class="text-3xl font-bold text-primary">
            {{ stat.value }}
          </p>

          <p class="font-semibold text-sm">
            {{ stat.label }}
          </p>

          <p class="text-xs text-muted">
            {{ stat.note }}
          </p>
        </UCard>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'NodeVault | Privacy Phones, Home Network Protection & Business Privacy Audits',
  description: 'GrapheneOS phone installation, Privacy Router appliance, UmbrelOS home network setup, and GDPR privacy audits for UK small businesses. Practical privacy tools.',
  ogTitle: 'NodeVault | Privacy Tools for People Who Mean It',
  ogDescription: 'Four practical privacy services: phone OS installation, home network appliance, self-hosted network setup, and business privacy audits.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'NodeVault | Privacy Phones, Network Protection & Business Audits',
  twitterDescription: 'GrapheneOS installation, Privacy Router appliance, UmbrelOS home server setup, and GDPR audits for UK small businesses.',
  keywords: 'GrapheneOS UK, privacy phone UK, Pi-hole hardware UK, home network privacy, GDPR audit small business, UmbrelOS UK, self-hosted home server',
})

const offerings = [
  {
    title: 'Privacy Phone Installation',
    tagline: 'From £200',
    icon: 'i-lucide-smartphone',
    href: '/phones',
    cta: 'Learn About Phone Installation',
    description: 'We install GrapheneOS, CalyxOS, or /e/OS on your Google Pixel and configure a privacy app stack from scratch. Send it in, we do the work, and return it ready to use.',
    points: [
      'GrapheneOS recommended — gold standard in Android privacy',
      'OS install + full app configuration from £350',
      'Signal, Bitwarden, Brave, and more pre-configured',
      'Compatible with Pixel 6 through Pixel 9',
    ],
  },
  {
    title: 'Home Network (UmbrelOS)',
    tagline: 'From £150/device + setup',
    icon: 'i-lucide-server',
    href: '/umbrelos',
    cta: 'Learn About Home Network',
    description: 'Replace Dropbox, Google Photos, and cloud subscriptions with apps you run at home on your own hardware. We design and configure your UmbrelOS server so you can leave Big Tech behind.',
    points: [
      'Nextcloud, Jellyfin, Vaultwarden, Home Assistant',
      'Your data on your hardware, in your home',
      'We handle the setup and configuration',
      'Consulting available for custom requirements',
    ],
  },
  {
    title: 'Privacy Router',
    tagline: 'From £175 + £12/mo',
    icon: 'i-lucide-box',
    href: '/privacy-router',
    cta: 'Learn About Privacy Router',
    description: 'A pre-configured hardware appliance that gives your whole network DNS blocking, a WireGuard VPN gateway, and VLAN isolation. Every device protected, nothing to install.',
    points: [
      'DNS-level ad and tracker blocking for every device',
      'WireGuard VPN gateway — whole-network protection',
      'VLAN isolation keeps IoT devices off your main network',
      'Managed via the NodeVault dashboard',
    ],
  },
  {
    title: 'Business Privacy Audit',
    tagline: 'From £500',
    icon: 'i-lucide-search',
    href: '/business',
    cta: 'Learn About the Business Audit',
    description: 'A hands-on audit of your digital footprint: where your client data goes, what your legal obligations are, and exactly what you need to fix. Written report and remediation plan included.',
    points: [
      'Designed for therapists, solicitors, accountants, and GPs',
      'GDPR compliance gap analysis against all 8 obligations',
      'Written report with prioritised action plan',
      'Optional implementation and quarterly retainer available',
    ],
  },
]

const reasons = [
  {
    title: 'Your Phone Tracks Everything',
    description: 'Stock Android sends location, app usage, and contact data to Google constantly. GrapheneOS eliminates this at the OS level — no Play Services, no background telemetry, no compromise.',
    icon: 'i-lucide-eye-off',
  },
  {
    title: 'Your Network Is an Open Book',
    description: 'Smart TVs, voice assistants, and IoT devices phone home to their manufacturers constantly. DNS blocking and VLAN isolation stop this at the network level, for every device simultaneously.',
    icon: 'i-lucide-wifi-off',
  },
  {
    title: 'GDPR Is Not Optional',
    description: 'UK GDPR applies to every practice handling personal data, regardless of size. A 2-person therapy practice has the same legal obligations as a large firm — and the same ICO enforcement risk.',
    icon: 'i-lucide-gavel',
  },
  {
    title: 'US Cloud ≠ EU Compliance',
    description: 'Google Drive, Dropbox, and Microsoft 365 are subject to the US CLOUD Act. Storing special category client data on US infrastructure creates GDPR exposure that\'s difficult to justify.',
    icon: 'i-lucide-cloud-off',
  },
]

const sectors = [
  {
    title: 'Therapists',
    icon: 'i-lucide-heart-handshake',
    risk: 'Mental health records are special category data under Article 9',
  },
  {
    title: 'Solicitors',
    icon: 'i-lucide-scale',
    risk: 'SRA expects documented cybersecurity practices from all firms',
  },
  {
    title: 'Accountants',
    icon: 'i-lucide-chart-bar',
    risk: 'Unencrypted email and US cloud storage are common GDPR failures',
  },
  {
    title: 'Private Healthcare',
    icon: 'i-lucide-stethoscope',
    risk: 'Patient records carry the highest GDPR protection requirements',
  },
]

const stats = [
  {
    value: '72 hrs',
    label: 'ICO breach notification window',
    note: 'The time you have to report a qualifying data breach to the ICO under UK GDPR Articles 33–34',
  },
  {
    value: '£17.5M',
    label: 'Maximum ICO fine for serious breaches',
    note: 'Or 4% of global annual turnover — whichever is higher',
  },
  {
    value: '99%',
    label: 'Small practices with GDPR gaps',
    note: 'Based on common audit findings — most practices have at least one undocumented processing activity',
  },
]
</script>
