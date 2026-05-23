<template>
  <UPage>
    <!-- Header -->
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b border-slate-200 py-12 sm:py-16">
      <UContainer>
        <div class="max-w-3xl">
          <div class="flex items-center gap-3 mb-4">
            <p class="text-sky-600 font-semibold text-sm tracking-wide uppercase">
              Personal project
            </p>

            <UBadge
              color="success"
              variant="subtle"
              size="sm"
              icon="i-lucide-circle">
              Live
            </UBadge>
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            NodeVault
          </h1>

          <p class="text-xl text-slate-600 font-medium mb-4">
            Take back control of your digital life
          </p>

          <p class="text-lg text-slate-500 leading-relaxed max-w-2xl mb-8">
            A personal project I'm actively developing, NodeVault covers three practical paths
            to reducing your digital footprint: de-Googling your phone with GrapheneOS, replacing cloud
            subscriptions with a self-hosted UmbrelOS home server and protecting your home network from IoT surveillance.
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              href="https://www.nodevault.cloud"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              color="primary"
              icon="i-lucide-external-link"
              trailing>
              Visit NodeVault
            </UButton>

            <UButton
              href="https://github.com/nickchampion/node-vault"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              color="neutral"
              icon="i-simple-icons-github">
              View on GitHub
            </UButton>

            <UButton
              to="/"
              size="lg"
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left">
              Back to profile
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <UContainer class="py-12">
      <div class="max-w-4xl space-y-14">
        <!-- Three areas -->
        <section>
          <SectionHeading>Three paths to better privacy</SectionHeading>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div
              v-for="area in areas"
              :key="area.title"
              class="rounded-xl border border-slate-200 p-6 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <div class="flex items-center justify-center size-10 rounded-lg bg-sky-50 shrink-0">
                  <UIcon
                    :name="area.icon"
                    class="size-5 text-sky-600" />
                </div>

                <h3 class="font-bold text-slate-900 text-sm">
                  {{ area.title }}
                </h3>
              </div>

              <p class="text-sm text-slate-600 leading-relaxed">
                {{ area.description }}
              </p>
            </div>
          </div>
        </section>

        <!-- What I built -->
        <section>
          <SectionHeading>What I built</SectionHeading>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div
              v-for="layer in stack"
              :key="layer.label"
              class="rounded-xl border border-slate-200 p-5">
              <div class="flex items-center gap-2 mb-3">
                <UIcon
                  :name="layer.icon"
                  class="size-4 text-sky-500" />

                <span class="text-sm font-semibold text-slate-700">{{ layer.label }}</span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <UBadge
                  v-for="tech in layer.tech"
                  :key="tech"
                  variant="subtle"
                  color="neutral"
                  size="sm">
                  {{ tech }}
                </UBadge>
              </div>
            </div>
          </div>
        </section>

        <!-- Highlights -->
        <section>
          <SectionHeading>Engineering highlights</SectionHeading>

          <ul class="space-y-3">
            <li
              v-for="highlight in highlights"
              :key="highlight"
              class="flex items-start gap-3 text-sm text-slate-600">
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-sky-400 shrink-0 mt-0.5" />
              {{ highlight }}
            </li>
          </ul>
        </section>

        <!-- CTA -->
        <section class="rounded-2xl bg-sky-50 border border-sky-100 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 class="font-bold text-slate-900 text-lg mb-1">
              See it live
            </h3>

            <p class="text-slate-500 text-sm">
              Guides on GrapheneOS, UmbrelOS self-hosting, and home network privacy.
            </p>
          </div>

          <UButton
            href="https://www.nodevault.cloud"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            size="lg"
            icon="i-lucide-external-link"
            trailing
            class="shrink-0">
            nodevault.cloud
          </UButton>
        </section>
      </div>
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'NodeVault — Nick Champion',
  description: 'NodeVault is a privacy information portal built by Nick Champion — covering GrapheneOS phones, UmbrelOS self-hosting, and home network protection.',
})

const areas = [
  {
    title: 'De-Google Your Phone',
    icon: 'i-lucide-smartphone',
    description: 'Why GrapheneOS eliminates tracking at the OS level, how it compares to stock Android and iOS, which hardware it runs on, and what apps replace Google\'s.',
  },
  {
    title: 'Own Your Cloud',
    icon: 'i-lucide-server',
    description: 'How to replace Dropbox, Google Photos, and iCloud with a self-hosted UmbrelOS server — what it costs, what hardware to buy, and what you can run on it.',
  },
  {
    title: 'Secure Your Network',
    icon: 'i-lucide-box',
    description: 'What IoT devices actually phone home with, and how DNS-level blocking, WireGuard VPN, and VLAN isolation protect every device on your home network.',
  },
]

const stack = [
  {
    label: 'Frontend',
    icon: 'i-lucide-monitor',
    tech: ['Nuxt 4', 'Vue.js', 'Nuxt UI', 'Tailwind CSS', 'TypeScript', 'Cloudflare Workers'],
  },
  {
    label: 'API',
    icon: 'i-lucide-server',
    tech: ['Node.js', 'Koa', 'OpenAPI', 'TypeScript', 'Fly.io'],
  },
  {
    label: 'Data & Storage',
    icon: 'i-lucide-database',
    tech: ['RavenDB', 'Cloudflare R2'],
  },
  {
    label: 'Infrastructure',
    icon: 'i-lucide-cloud',
    tech: ['Cloudflare', 'GitHub Actions', 'Docker'],
  },
]

const highlights = [
  'Designed and built the entire platform solo — frontend, API, infrastructure, and deployment pipeline.',
  'Nuxt 4 SSR frontend deployed to Cloudflare Workers at the edge for low-latency global delivery.',
  'OpenAPI-first REST API with strict schema validation, per-operation handlers, and automatic retry on concurrency conflicts.',
  'Monorepo architecture (NX) with shared components across the frontend and API — OpenAPI client generated from schemas.',
  'Full CI/CD via GitHub Actions with environment promotion and versioning',
  'Authentication via magic-link email (Resend) with JWT sessions — no passwords.',
]
</script>
