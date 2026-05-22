<template>
  <UPage>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-slate-50 py-20 sm:py-28">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,233,0.08),_transparent_60%)]" />

      <UContainer class="relative">
        <div class="max-w-3xl">
          <p class="text-sky-600 font-semibold text-sm tracking-wide uppercase mb-4">
            Engineering Leadership
          </p>

          <h1 class="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Nick Champion
          </h1>

          <p class="text-xl sm:text-2xl text-slate-600 font-medium mb-4">
            VP of Engineering · 20+ Years Building Software
          </p>

          <p class="text-lg text-slate-500 leading-relaxed max-w-2xl mb-10">
            Hands-on engineer and team leader with a track record of building and modernising platforms,
            scaling high-traffic systems, and growing the teams that ship them.
            Based in London.
          </p>

          <div class="flex flex-wrap gap-3">
            <UButton
              to="/cv"
              size="lg"
              color="primary"
              icon="i-lucide-file-text"
              trailing>
              View my CV
            </UButton>

            <UButton
              to="/contact"
              size="lg"
              variant="outline"
              color="neutral"
              icon="i-lucide-mail"
              trailing>
              Get in touch
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Profile -->
    <UPageSection>
      <UContainer>
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-slate-900 mb-4">
            What I do
          </h2>

          <p class="text-slate-600 text-lg leading-relaxed">
            Pragmatic and delivery-focused with deep understanding of the software development lifecycle —
            from architecture and coding through to cloud infrastructure, observability, DevOps and
            operational maturity. Strong track record of modernising platforms, improving engineering
            workflows and leading distributed teams across multiple time zones.
          </p>
        </div>
      </UContainer>
    </UPageSection>

    <!-- Key Strengths -->
    <UPageSection
      class="bg-slate-50">
      <UContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">
            Key strengths
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="strength in strengths"
            :key="strength.title"
            class="bg-white rounded-xl p-6 border border-slate-200 flex gap-4">
            <div class="flex items-center justify-center size-10 rounded-lg bg-sky-50 shrink-0">
              <UIcon
                :name="strength.icon"
                class="size-5 text-sky-600" />
            </div>

            <div>
              <h3 class="font-semibold text-slate-900 text-sm mb-1">
                {{ strength.title }}
              </h3>

              <p class="text-sm text-slate-500 leading-snug">
                {{ strength.description }}
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <!-- Technical Expertise -->
    <UPageSection>
      <UContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">
            Technical expertise
          </h2>
        </div>

        <div class="max-w-3xl mx-auto space-y-5">
          <div
            v-for="category in expertise"
            :key="category.label"
            class="flex flex-col sm:flex-row sm:items-start gap-3">
            <span class="text-sm font-semibold text-slate-500 w-36 shrink-0 pt-1">{{ category.label }}</span>

            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in category.skills"
                :key="skill"
                variant="subtle"
                color="primary"
                size="md">
                {{ skill }}
              </UBadge>
            </div>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <!-- Projects -->
    <UPageSection class="bg-slate-50">
      <UContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">
            What I'm building
          </h2>
        </div>

        <div class="max-w-3xl mx-auto">
          <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div class="p-6 sm:p-8">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-slate-900 text-lg">
                      NodeVault
                    </h3>

                    <UBadge
                      color="success"
                      variant="subtle"
                      size="sm"
                      icon="i-lucide-circle">
                      Live
                    </UBadge>
                  </div>

                  <p class="text-sky-600 font-semibold text-sm">
                    Take back control of your digital life
                  </p>
                </div>
              </div>

              <p class="text-slate-600 text-sm leading-relaxed mb-5">
                A privacy information portal — covering GrapheneOS phones,
                UmbrelOS self-hosting, and home network protection. Full-stack: Nuxt 4 on Cloudflare
                Workers, Node.js/OpenAPI API on Fly.io, RavenDB, NX monorepo.
              </p>

              <div class="flex flex-wrap gap-1.5 mb-6">
                <UBadge
                  v-for="tech in ['Nuxt 4', 'Vue.js', 'Node.js', 'OpenAPI', 'Cloudflare Workers', 'RavenDB', 'TypeScript']"
                  :key="tech"
                  variant="subtle"
                  color="neutral"
                  size="sm">
                  {{ tech }}
                </UBadge>
              </div>

              <div class="flex flex-wrap gap-3">
                <UButton
                  to="/nodevault"
                  variant="outline"
                  color="primary"
                  size="sm"
                  icon="i-lucide-arrow-right"
                  trailing>
                  Project details
                </UButton>

                <UButton
                  href="https://www.nodevault.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  icon="i-lucide-external-link"
                  trailing>
                  nodevault.cloud
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </UPageSection>

    <!-- Career Highlights -->
    <UPageSection>
      <UContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">
            Recent roles
          </h2>
        </div>

        <div class="max-w-3xl mx-auto space-y-4">
          <div
            v-for="role in recentRoles"
            :key="role.company"
            class="bg-white rounded-xl p-6 border border-slate-200">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
              <div>
                <h3 class="font-bold text-slate-900">
                  {{ role.company }}
                </h3>

                <p class="text-sky-600 font-semibold text-sm">
                  {{ role.title }}
                </p>
              </div>

              <span class="text-sm text-slate-400 shrink-0">{{ role.dates }}</span>
            </div>

            <p class="text-sm text-slate-600 leading-relaxed">
              {{ role.summary }}
            </p>
          </div>
        </div>

        <div class="text-center mt-8">
          <UButton
            to="/cv"
            variant="outline"
            color="primary"
            icon="i-lucide-arrow-right"
            trailing>
            See full career history
          </UButton>
        </div>
      </UContainer>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Nick Champion — Engineering Leadership',
  description: 'Hands-on engineer and VP of Engineering with 25 years\' experience building, scaling and leading software delivery teams.',
})

const strengths = [
  {
    title: 'Platform Architecture',
    description: 'Greenfield development, systems design, and platform modernisation and re-architecture.',
    icon: 'i-lucide-layers',
  },
  {
    title: 'High-Traffic Systems',
    description: 'E-commerce and marketplace systems handling tens of millions of requests per day.',
    icon: 'i-lucide-zap',
  },
  {
    title: 'Cloud-Native Delivery',
    description: 'AWS and Cloudflare infrastructure, CI/CD pipelines, and operational observability.',
    icon: 'i-lucide-cloud',
  },
  {
    title: 'DevOps & Developer Productivity',
    description: 'CI/CD, release visibility, workflow automation, and engineering tooling.',
    icon: 'i-lucide-terminal',
  },
  {
    title: 'Team Leadership',
    description: 'Hiring, onboarding, coaching, and managing distributed engineering teams.',
    icon: 'i-lucide-users',
  },
  {
    title: 'Stakeholder Communication',
    description: 'Delivery planning, technical roadmaps, and communication in fast-changing environments.',
    icon: 'i-lucide-message-square',
  },
]

const expertise = [
  { label: 'Languages', skills: ['TypeScript', 'JavaScript', 'C#', 'SQL'] },
  { label: 'Backend', skills: ['Node.js', 'Deno', '.NET', 'OpenAPI', 'Koa'] },
  { label: 'Frontend', skills: ['Vue.js', 'Nuxt', 'HTML', 'Tailwind CSS'] },
  { label: 'Cloud', skills: ['AWS', 'Cloudflare Workers', 'Docker', 'Cloudflare R2', 'Lambda', 'Fargate'] },
  { label: 'Datastores', skills: ['SQL Server', 'PostgreSQL', 'RavenDB', 'MongoDB', 'Redis'] },
  { label: 'DevOps', skills: ['GitHub Actions', 'CloudFormation', 'CloudWatch', 'ELK / OpenSearch'] },
  { label: 'Search', skills: ['Elasticsearch', 'Lucene', 'Solr'] },
]

const recentRoles = [
  {
    company: 'Hectare Agritech',
    title: 'VP of Engineering',
    dates: 'Feb 2022 – May 2026',
    summary: 'Hired to transform the engineering function: rebuilt core backend systems from scratch in 3 months, overhauled CI/CD and development workflow, grew the team from 8 to 15 engineers, and drove platform modernisation across AWS, Cloudflare, and RavenDB.',
  },
  {
    company: 'Reebonz / Reebonz Marketplace (Singapore)',
    title: 'Chief Engineer',
    dates: 'Jan 2015 – Feb 2022',
    summary: 'End-to-end responsibility for launching and operating a marketplace platform across 7 Asia-Pacific markets. Scaled backend systems to ~20M+ requests/day, supported ~SGD 250m annual revenue, and managed remote engineering teams in Indonesia and Vietnam.',
  },
  {
    company: 'CodeTrip',
    title: 'Founder',
    dates: 'Aug 2013 – Dec 2014',
    summary: 'Co-founded a configurable marketplace platform serving travel, luxury fashion, jewellery, and pet supplies clients. Platform acquired by Reebonz Pte Ltd in 2015.',
  },
]
</script>
