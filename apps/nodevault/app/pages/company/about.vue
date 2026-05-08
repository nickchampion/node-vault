<template>
  <UPage>
    <UPageHero
      title="About NodeVault"
      description="We believe privacy is a right, not a luxury. NodeVault exists to make that right practical for everyone."
      align="center" />

    <UPageSection>
      <div class="content max-w-3xl mx-auto">
        <h2>Who We Are</h2>
        <p>
          NodeVault is a UK-based privacy technology company founded on a simple premise: the tools to protect your digital life should be accessible to ordinary people, not just security engineers. We sell pre-configured GrapheneOS smartphones and design self-hosted home network systems built on UmbrelOS — everything set up, hardened, and ready to use from day one.
        </p>

        <h2>Why We Exist</h2>
        <p>
          The dominant model of the modern internet is surveillance. Every mainstream smartphone, cloud service, and social platform is designed to harvest as much data about you as possible and monetise it. This isn't a side effect — it's the business model.
        </p>
        <p>
          For most people, opting out has felt impossible. The privacy-preserving alternatives either required deep technical knowledge, looked and felt like hobby projects, or came with so many compromises they weren't worth the effort. We think that's the wrong trade-off.
        </p>
        <p>
          GrapheneOS is genuinely the most secure consumer Android build in existence. UmbrelOS makes self-hosting approachable enough that anyone can run their own cloud at home. The technology is ready. What was missing was someone to make it turnkey — sourcing the right hardware, handling the configuration, and being there when questions come up.
        </p>
        <p>
          That's what NodeVault does.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li>
            <strong>GrapheneOS Phones</strong> — Google Pixel devices with GrapheneOS installed and hardened, shipped ready to use. No Google account required. No setup complexity.
          </li>
          <li>
            <strong>UmbrelOS Home Servers</strong> — Purpose-built home server hardware pre-loaded with UmbrelOS, configured for your network. Replace Dropbox, Google Photos, Spotify and more with apps you own and control.
          </li>
          <li>
            <strong>Consulting for Businesses</strong> — Privacy-first infrastructure for small businesses: GrapheneOS phone fleets, self-hosted productivity tools, and network architecture that keeps your data off third-party servers.
          </li>
        </ul>

        <h2>Our Principles</h2>
        <ul>
          <li><strong>No compromise on privacy.</strong> We only recommend and sell products we'd use ourselves. We don't partner with vendors who track users.</li>
          <li><strong>Honest advice.</strong> If a tool has a limitation, we'll tell you. We'd rather lose a sale than set a customer up with something that doesn't fit their needs.</li>
          <li><strong>Open source where possible.</strong> GrapheneOS, UmbrelOS, and most of the apps we recommend are open source. You can verify what the software does. So can the global security community.</li>
          <li><strong>Long-term support.</strong> We don't disappear after the sale. NodeVault customers have access to support, guidance, and updates as the tools and threat landscape evolve.</li>
        </ul>

        <h2>Get in Touch</h2>
        <p>
          If you have questions about any of our products, want advice on which solution is right for you, or are interested in what a business deployment might look like — we'd love to hear from you.
        </p>
        <p>
          <NuxtLink to="/company/contact">Send us a message</NuxtLink> and we'll get back to you shortly.
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About Us | NodeVault',
  description: 'NodeVault is a UK-based privacy technology company. We sell GrapheneOS phones and UmbrelOS home servers — privacy tools that are actually practical.',
  ogTitle: 'About NodeVault',
  ogDescription: 'We believe privacy is a right, not a luxury. NodeVault makes practical privacy tools accessible to everyone.',
})
</script>

<style scoped>
.content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.content p {
  line-height: 1.75;
  margin-bottom: 1rem;
  color: var(--ui-text-muted);
}

.content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.content li {
  line-height: 1.75;
  color: var(--ui-text-muted);
}

.content a {
  color: var(--ui-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
