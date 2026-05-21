<template>
  <UPage>
    <UPageHero
      title="Small Business Privacy Audit & Hardening"
      description="We audit your practice's digital footprint, identify your GDPR compliance gaps, and give you a written report with a clear remediation plan. You know exactly what needs fixing and in what order — without hiring a consultant on retainer."
      align="center">
      <template #links>
        <UButton
          to="/company/contact"
          size="xl"
          icon="i-lucide-search">
          Book an Audit
        </UButton>

        <UButton
          to="/gdpr"
          size="xl"
          icon="i-lucide-scroll-text"
          variant="outline"
          color="neutral">
          UK GDPR Guide
        </UButton>
      </template>
    </UPageHero>

    <UPageSection
      title="Who This Is For"
      description="Small professional practices that handle sensitive client data and have regulatory obligations — but don't have an IT department, a DPO, or a clue where to start."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="sector in sectors"
          :key="sector.title"
          :title="sector.title"
          :description="sector.description"
          :icon="sector.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      title="What We Audit"
      description="A NodeVault audit covers all eight UK GDPR obligations as they apply to your specific practice — not a generic checklist, but an assessment of your actual data flows, tools, and processes."
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div
          v-for="area in auditAreas"
          :key="area.title"
          class="flex items-start gap-4 p-4 rounded-xl border border-default bg-muted/20">
          <div class="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
            <UIcon
              :name="area.icon"
              class="size-4 text-primary" />
          </div>

          <div>
            <p class="font-semibold text-sm">
              {{ area.title }}
            </p>

            <p class="text-xs text-muted mt-0.5">
              {{ area.description }}
            </p>

            <p class="text-xs font-mono text-primary/70 mt-1">
              {{ area.article }}
            </p>
          </div>
        </div>
      </div>
    </UPageSection>

    <UPageSection
      title="What You Get"
      description="The audit produces a written report you can keep on file, share with your insurer, and use as evidence of compliance. Not a sales pitch for further consultancy — a document you own and act on yourself."
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <UCard
          v-for="deliverable in deliverables"
          :key="deliverable.title"
          class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
              <UIcon
                :name="deliverable.icon"
                class="size-5 text-primary" />
            </div>

            <h3 class="font-semibold text-sm leading-tight">
              {{ deliverable.title }}
            </h3>
          </div>

          <p class="text-sm text-muted flex-1">
            {{ deliverable.description }}
          </p>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="How It Works"
      align="center">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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

    <UPageSection
      id="pricing"
      title="Pricing"
      align="center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <UCard
          v-for="plan in pricing"
          :key="plan.name"
          class="flex flex-col gap-4">
          <div>
            <h3 class="font-semibold text-lg">
              {{ plan.name }}
            </h3>

            <p class="text-3xl font-bold mt-1">
              {{ plan.price }}
            </p>

            <p class="text-sm text-muted mt-1">
              {{ plan.description }}
            </p>
          </div>

          <ul class="space-y-2 flex-1">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-2 text-sm">
              <UIcon
                name="i-lucide-check-circle"
                class="size-4 text-primary shrink-0 mt-0.5" />

              <span>{{ feature }}</span>
            </li>
          </ul>

          <UButton
            to="/company/contact"
            variant="outline"
            color="neutral"
            icon="i-lucide-arrow-right"
            trailing
            block>
            Enquire About This
          </UButton>
        </UCard>
      </div>
    </UPageSection>

    <UPageSection
      title="Common Findings"
      description="These are the gaps we find in almost every small practice audit. None of them are the result of negligence — they're the result of nobody ever having mapped the data flows out."
      align="center">
      <UPageGrid>
        <UPageCard
          v-for="finding in commonFindings"
          :key="finding.title"
          :title="finding.title"
          :description="finding.description"
          :icon="finding.icon" />
      </UPageGrid>
    </UPageSection>

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto p-8 space-y-6">
        <div class="text-center space-y-3">
          <UIcon
            name="i-lucide-shield-check"
            class="size-10 text-primary mx-auto" />

          <h2 class="text-2xl font-bold">
            Ready to find out where you stand?
          </h2>

          <p class="text-muted">
            Get in touch with a brief description of your practice and what you know (or suspect) about your current compliance position. We'll confirm scope, timeline, and pricing.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <UButton
            to="/company/contact"
            size="xl"
            icon="i-lucide-arrow-right"
            trailing>
            Book an Audit
          </UButton>

          <UButton
            to="/gdpr"
            size="xl"
            variant="outline"
            color="neutral"
            icon="i-lucide-scroll-text">
            Read the GDPR Guide First
          </UButton>
        </div>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Business Privacy Audit & GDPR Hardening for Small Practices | NodeVault',
  description: 'Hands-on GDPR compliance audit for therapists, solicitors, accountants, and GPs. Written report, prioritised action plan, and optional implementation. UK-based.',
  ogTitle: 'Business Privacy Audit | NodeVault',
  ogDescription: 'We audit your practice\'s digital footprint, identify GDPR gaps, and give you a written remediation plan. From £500.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  keywords: 'GDPR audit small business UK, GDPR compliance therapist, solicitor data protection audit, accountant GDPR, UK GDPR small practice, ICO compliance',
})

const sectors = [
  {
    title: 'Therapists & Counsellors',
    description: 'Mental health records are Article 9 special category data — the highest protection tier under UK GDPR. BACP and UKCP registration does not automatically make you compliant. Most independent practitioners are using Gmail, Google Calendar, and Google Drive for client work without realising the exposure this creates.',
    icon: 'i-lucide-heart-handshake',
  },
  {
    title: 'Solicitors & Legal Practices',
    description: 'The SRA expects documented cybersecurity and data protection practices from all regulated firms, regardless of size. Client legal privilege depends on confidentiality — including digital confidentiality. Most 2–5 person practices have undocumented processing activities and no signed DPAs with their suppliers.',
    icon: 'i-lucide-scale',
  },
  {
    title: 'Accountants & Financial Advisors',
    description: 'Client financial records, tax returns, and bank statements are personal data with strict protection requirements under UK GDPR and ICAEW/ACCA professional standards. Sending financial documents over unencrypted email is one of the most common exposures we find.',
    icon: 'i-lucide-chart-bar',
  },
  {
    title: 'Private Healthcare Providers',
    description: 'Private GPs, occupational health providers, physiotherapists, and independent practitioners make their own IT decisions — unlike NHS counterparts who receive centrally managed infrastructure. All patient records are special category data under Article 9, carrying the highest compliance requirements and the most serious ICO enforcement risk.',
    icon: 'i-lucide-stethoscope',
  },
]

const auditAreas = [
  {
    title: 'ICO Registration',
    icon: 'i-lucide-badge-check',
    description: 'Verify your practice is registered, the fee tier is correct, and the registration reflects your current processing activities.',
    article: 'Data Protection Act 2018, s.62',
  },
  {
    title: 'Record of Processing Activities',
    icon: 'i-lucide-file-text',
    description: 'Map all personal data flows: what you hold, why you hold it, where it goes, and how long you keep it. The ROPA is the foundation of compliance.',
    article: 'UK GDPR Article 30',
  },
  {
    title: 'Lawful Basis & Special Category Conditions',
    icon: 'i-lucide-gavel',
    description: 'Identify and document a lawful basis for every processing activity. For special category data, an additional Article 9 condition is required.',
    article: 'UK GDPR Articles 6 & 9',
  },
  {
    title: 'Privacy Notices',
    icon: 'i-lucide-scroll-text',
    description: 'Review the privacy notices provided to clients at the point of data collection. A terms page buried in a website footer is not sufficient on its own.',
    article: 'UK GDPR Articles 13 & 14',
  },
  {
    title: 'Data Processing Agreements',
    icon: 'i-lucide-handshake',
    description: 'Verify signed DPAs are in place with every third-party processor — cloud providers, email services, practice management software, and payment processors.',
    article: 'UK GDPR Article 28',
  },
  {
    title: 'Subject Access Request Process',
    icon: 'i-lucide-user-search',
    description: 'Assess whether a documented SAR process exists and whether the practice can realistically respond within the one-month statutory deadline.',
    article: 'UK GDPR Article 15',
  },
  {
    title: 'Breach Detection & Notification',
    icon: 'i-lucide-siren',
    description: 'Review the breach detection and response process. Qualifying breaches must be reported to the ICO within 72 hours — most practices have no documented procedure.',
    article: 'UK GDPR Articles 33 & 34',
  },
  {
    title: 'Data Retention & Deletion',
    icon: 'i-lucide-clock',
    description: 'Check that documented retention periods exist for every data category and that a secure deletion process is in place when those periods expire.',
    article: 'UK GDPR Article 5(1)(e)',
  },
]

const deliverables = [
  {
    title: 'Written Compliance Report',
    icon: 'i-lucide-file-text',
    description: 'A plain English report covering every audit area, your current status against each GDPR obligation, and specific gaps identified. Suitable for your own records, your insurer, or a regulator if asked.',
  },
  {
    title: 'Prioritised Action Plan',
    icon: 'i-lucide-list-ordered',
    description: 'A ranked list of remediation steps — from urgent (criminal exposure or direct ICO risk) to recommended (best practice). Each step includes what to do and why it matters.',
  },
  {
    title: 'Data Flow Map',
    icon: 'i-lucide-git-branch',
    description: 'A diagram and written description of your practice\'s data flows: where client data enters, where it goes, what third parties touch it, and where it exits or is deleted.',
  },
]

const process = [
  {
    title: 'Initial Questionnaire',
    description: 'You complete a structured questionnaire about your practice: the data you hold, the tools you use, your current documentation, and how you handle client requests.',
  },
  {
    title: 'Audit Call',
    description: 'A 60–90 minute video call to go through your answers in detail, explore edge cases, and build a complete picture of your data processing activities.',
  },
  {
    title: 'Report Delivery',
    description: 'Within 5 business days, you receive the full written report, action plan, and data flow map. We walk through the findings together in a follow-up call.',
  },
  {
    title: 'Optional Implementation',
    description: 'You can implement the recommendations yourself or engage us to do it — either for specific items (DPA templates, privacy notice drafting) or as an ongoing quarterly retainer.',
  },
]

const pricing = [
  {
    name: 'Audit & Report',
    price: '£500',
    description: 'Full audit, written report, data flow map, and prioritised action plan.',
    features: [
      'Initial questionnaire',
      'Audit call (60–90 min)',
      'Written compliance report',
      'Prioritised action plan',
      'Data flow map',
      'Follow-up walkthrough call',
    ],
  },
  {
    name: 'Audit + Implementation',
    price: 'From £900',
    description: 'Audit plus hands-on help implementing the priority fixes.',
    features: [
      'Everything in Audit & Report',
      'DPA template for your key processors',
      'Privacy notice drafted for your practice type',
      'SAR response process documented',
      'Breach response procedure written',
      'Email support for 60 days',
    ],
  },
  {
    name: 'Quarterly Retainer',
    price: '£250/mo',
    description: 'Ongoing compliance support: reviews, updates, and incident response.',
    features: [
      'Everything in Audit + Implementation',
      'Quarterly compliance review call',
      'ROPA updates as your practice changes',
      'SAR and breach response support',
      'Priority email and call support',
      'Annual ICO registration renewal check',
    ],
  },
]

const commonFindings = [
  {
    title: 'No Signed DPAs',
    description: 'The vast majority of small practices are using cloud services (Google Workspace, Dropbox, Xero) with no signed Data Processing Agreement in place. Article 28 requires a written contract with every processor before processing begins.',
    icon: 'i-lucide-handshake',
  },
  {
    title: 'Gmail for Client Files',
    description: 'Sending and receiving documents containing personal data over standard Gmail is not GDPR compliant for special category data. A signed DPA and appropriate encryption are required at minimum.',
    icon: 'i-lucide-mail',
  },
  {
    title: 'No ROPA',
    description: 'Most practices have never documented their processing activities. Without a Record of Processing Activities you cannot demonstrate compliance, respond to an ICO investigation, or identify where a breach came from.',
    icon: 'i-lucide-file-x',
  },
  {
    title: 'Inadequate Privacy Notice',
    description: 'A one-line statement on a contact form does not meet Articles 13 and 14. A compliant privacy notice must cover your lawful basis, retention periods, data subject rights, and contact details for your DPO or representative.',
    icon: 'i-lucide-scroll-text',
  },
  {
    title: 'No Breach Procedure',
    description: 'Almost no small practices have a documented breach detection and response procedure. When a breach occurs — and eventually one will — the 72-hour notification window starts immediately.',
    icon: 'i-lucide-siren',
  },
  {
    title: 'US Cloud Exposure',
    description: 'AWS, Google Cloud, Microsoft Azure, and DigitalOcean are US companies subject to the CLOUD Act. Storing special category client data with these providers without appropriate safeguards creates compliance risk that is difficult to justify when EU alternatives exist.',
    icon: 'i-lucide-cloud',
  },
]
</script>
