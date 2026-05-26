<template>
  <UPage>
    <!-- Page header -->
    <section class="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b border-slate-200 py-12 sm:py-16">
      <UContainer>
        <div class="max-w-4xl">
          <p class="text-sky-600 font-semibold text-sm tracking-wide uppercase mb-3">
            CV
          </p>

          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Nick Champion
          </h1>

          <p class="text-xl text-slate-600 font-medium mb-6">
            Senior / Lead Engineer · 20+ Years in Software Engineering
          </p>

          <div class="flex flex-wrap gap-4 text-sm text-slate-500">
            <NuxtLink
              to="/contact"
              class="flex items-center gap-1.5 hover:text-sky-600 transition-colors">
              <UIcon
                name="i-lucide-mail"
                class="size-4" />
              Get in touch
            </NuxtLink>

            <span class="flex items-center gap-1.5">
              <UIcon
                name="i-lucide-map-pin"
                class="size-4" />
              London, UK
            </span>
          </div>
        </div>
      </UContainer>
    </section>

    <UContainer class="py-12">
      <div class="max-w-4xl space-y-14">
        <!-- Profile -->
        <section>
          <SectionHeading>Profile</SectionHeading>

          <p class="text-slate-600 leading-relaxed text-base">
            Hands-on engineer with 20+ years' experience building, scaling and leading software delivery teams.
            Pragmatic and delivery-focused with deep understanding of the software development lifecycle, from
            architecture and coding through to cloud infrastructure, observability, DevOps and operational maturity.
            Strong track record of modernising platforms, improving engineering workflows and leading distributed teams.
          </p>
        </section>

        <!-- Key Strengths -->
        <section>
          <SectionHeading>Key strengths</SectionHeading>

          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <li
              v-for="strength in keyStrengths"
              :key="strength"
              class="flex items-start gap-2.5 text-sm text-slate-600">
              <UIcon
                name="i-lucide-check-circle"
                class="size-4.5 text-sky-500 shrink-0 mt-0.5" />
              {{ strength }}
            </li>
          </ul>
        </section>

        <!-- Technical Expertise -->
        <section>
          <SectionHeading>Technical expertise</SectionHeading>

          <div class="space-y-4">
            <div
              v-for="category in expertise"
              :key="category.label"
              class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span class="text-sm font-semibold text-slate-500 w-36 shrink-0 pt-1">{{ category.label }}</span>

              <p class="text-sm text-slate-700">
                {{ category.skills.join(', ') }}
              </p>
            </div>
          </div>
        </section>

        <!-- Career History -->
        <section>
          <SectionHeading>Career history</SectionHeading>

          <div class="space-y-10">
            <div
              v-for="role in roles"
              :key="role.company + role.title"
              class="relative pl-5 border-l-2 border-sky-100">
              <div class="absolute -left-1.5 top-1.5 size-3 rounded-full bg-sky-400 ring-2 ring-white" />

              <div class="mb-3">
                <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-4">
                  <h3 class="font-bold text-slate-900 text-base">
                    {{ role.company }}
                  </h3>

                  <span class="text-sm text-slate-400 shrink-0">{{ role.dates }}</span>
                </div>

                <p class="text-sky-600 font-semibold text-sm">
                  {{ role.title }}
                </p>

                <p
                  v-if="role.context"
                  class="text-xs text-slate-400 italic mt-0.5">
                  {{ role.context }}
                </p>
              </div>

              <p
                v-if="role.summary"
                class="text-sm text-slate-600 leading-relaxed mb-3">
                {{ role.summary }}
              </p>

              <ul
                v-if="role.bullets"
                class="space-y-1.5">
                <li
                  v-for="bullet in role.bullets"
                  :key="bullet"
                  class="flex items-start gap-2 text-sm text-slate-600">
                  <UIcon
                    name="i-lucide-arrow-right"
                    class="size-3.5 text-sky-400 shrink-0 mt-1" />
                  {{ bullet }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'CV — Nick Champion',
  description: 'CV of Nick Champion — Senior / Lead Engineer with 20+ years building, scaling and leading software delivery teams.',
})

const keyStrengths = [
  'Greenfield development / systems design, platform modernisation and re-architecture',
  'High-traffic e-commerce / marketplace systems and scaling for peak events',
  'Cloud-native delivery and operations (AWS/Cloudflare, CI/CD, observability)',
  'DevOps and developer productivity (CI/CD, release visibility, workflow automation)',
  'Team leadership: hiring, onboarding, coaching, distributed team management',
  'Stakeholder communication and delivery planning in fast-changing environments',
]

const expertise = [
  { label: 'Languages', skills: ['TypeScript / JavaScript', 'C#', 'SQL'] },
  { label: 'Backend', skills: ['Node.js', 'Deno', '.NET', 'OpenAPI'] },
  { label: 'Frontend', skills: ['Vue.js', 'HTML', 'Tailwind CSS'] },
  { label: 'Cloud', skills: ['AWS (Cognito, Fargate, Lambda, S3, Redis, IAM)', 'Cloudflare (Workers, R2)', 'Docker'] },
  { label: 'Networking', skills: ['DNS', 'Cloudflare Tunnels', 'HTTP protocol'] },
  { label: 'Datastores', skills: ['SQL Server', 'PostgreSQL', 'RavenDB', 'MongoDB'] },
  { label: 'DevOps', skills: ['GitHub Actions', 'AWS CloudFormation', 'CloudWatch', 'SSM / Secrets Manager', 'ELK / OpenSearch', 'Release automation'] },
  { label: 'Search', skills: ['Elasticsearch', 'Lucene', 'Solr'] },
]

const roles = [
  {
    company: 'Hectare Agritech',
    title: 'VP of Engineering',
    dates: 'Feb 2022 – May 2026',
    context: 'Hectare builds technology for agricultural supply chains and commodity trading.',
    summary: 'Hired to transform the engineering function: modernise technology, optimise processes, improve communication and increase platform scale and maturity to drive adoption.',
    bullets: [
      'Single handedly rebuilt core backend systems in 3 months (Node.js, OpenAPI, AWS services, Cloudflare, RavenDB); led migration to the new platform and decommissioned legacy systems.',
      'Overhauled development workflow and CI/CD; built an internal Slack app (Deno) to orchestrate PRs and code reviews, manage deployments across apps/services, handle versioning, and provide release visibility across the stack.',
      'Grew the engineering team from 8 to 15 within 18 months (recruitment, onboarding, training); later led the team reduction process, including redundancy.',
    ],
  },
  {
    company: 'Reebonz / Reebonz Marketplace',
    title: 'Chief Engineer',
    dates: 'Jan 2015 – Feb 2022',
    context: 'Singapore-based luxury marketplace operating across 7 Asia-Pacific markets.',
    summary: 'Held end-to-end responsibility for launching Reebonz Marketplace on the CodeTrip platform across 7 Asia-Pacific markets.',
    bullets: [
      'Delivered marketplace launch within 6 months; integrated 250+ merchants and supported tens of millions in GMV.',
      'Scaled and operated backend systems handling ~20M+ requests/day, including significant spikes during flash sales; supported approximately SGD 250m annual revenue.',
      'Led the 2017 transition of the core Reebonz flash-sales business onto the Marketplace platform, including a full frontend rebuild and successful relaunch.',
      'Managed remote engineering teams in Indonesia and Vietnam.',
    ],
  },
  {
    company: 'CodeTrip',
    title: 'Founder',
    dates: 'Aug 2013 – Dec 2014',
    bullets: [
      'Co-founded CodeTrip based on experience building ASOS Marketplace; created a configurable marketplace platform with customisable frontends, flexible catalogue modelling, and multiple payment models (escrow, B2B, Stripe, etc.).',
      'Sold the platform to diverse clients (travel/adventure, luxury fashion, jewellery and pet supplies).',
      'Platform acquired by Reebonz Pte Ltd (Singapore) in 2015; business closed following sale.',
    ],
  },
  {
    company: 'ASOS',
    title: 'Solution Architect (Contract)',
    dates: 'Sep 2011 – Aug 2013',
    bullets: [
      'Solution Architect leading the team responsible for re-engineering ASOS product management process.',
      'Covered the end-to-end workflow required to publish products to ASOS.com (shoots, photography/video, copy, pricing, warehousing/stock).',
    ],
  },
  {
    company: 'ASOS Marketplace',
    title: 'Solutions Architect (Contract)',
    dates: 'May 2010 – Sep 2011',
    bullets: [
      'Owned platform architecture, recruitment, and management of a remote team in Romania; also contributed hands-on engineering.',
    ],
  },
  {
    company: 'River Island',
    title: 'Consultant (Contract)',
    dates: 'Dec 2009 – May 2010',
    bullets: [
      'Diagnosed and resolved performance issues and memory leaks under load (Conchango/EMC implementation).',
      'Work helped prevent project cancellation and supported a successful launch in Jul 2010.',
    ],
  },
  {
    company: 'Tesco Stores Ltd',
    title: 'Lead Engineer',
    dates: 'Feb 2008 – Dec 2009',
    bullets: [
      'Lead engineer on backend services for Tesco Entertainment (e-commerce platform for digital content).',
    ],
  },
  {
    company: 'Charteris Plc (GAME)',
    title: '.NET Contract Engineer',
    dates: 'Aug 2007 – Feb 2008',
    bullets: [
      'Worked on redevelopment of GAME\'s e-commerce platform; design and prototyping of a service-oriented architecture.',
    ],
  },
  {
    company: 'Blueprint Digital Ltd',
    title: 'Senior Engineer',
    dates: 'Oct 2006 – Jul 2007',
    bullets: [
      'Worked on digital content delivery & e-commerce platform; served end users via customers including Tesco, Best Buy and Sanity Digital (Australia).',
    ],
  },
  {
    company: 'Conchango',
    title: 'Contract Software Engineer',
    dates: 'Jun 2006 – Oct 2006',
    bullets: [
      'Developed a digital commerce platform (generic e-commerce for selling/delivering digital media) in collaboration with Blueprint.',
    ],
  },
  {
    company: 'Fuel IT Ltd',
    title: 'Junior to Senior Engineer',
    dates: 'Feb 2001 – Apr 2006',
    bullets: [
      'Built, maintained and deployed learning management systems for blue-chip clients\' internal training programs.',
    ],
  },
]
</script>
