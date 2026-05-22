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
          NodeVault is a resource for anyone who wants to take back control of their digital life. We cover three practical paths to better privacy: de-Googling your phone with GrapheneOS, replacing cloud subscriptions with a self-hosted UmbrelOS home server and protecting your home network from IoT surveillance. The tools are free and open source. This site explains how they work and how to get started.
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
          NodeVault is that resource. It's a place to understand the tools, learn what they do, and figure out where to start — without needing a computer science degree or a threat model written by a security researcher.
        </p>

        <h2>What You'll Find Here</h2>

        <ul>
          <li>
            <strong>De-Google your phone.</strong> A guide to GrapheneOS — what it is, why it matters, how it compares to stock Android and iOS, which hardware it runs on, and what apps to use instead of Google's.
          </li>

          <li>
            <strong>Own your cloud.</strong> Everything you need to know about self-hosting with UmbrelOS — what you can replace, what hardware you need, and how much it actually costs compared to the subscriptions it replaces.
          </li>

          <li>
            <strong>Secure your home network.</strong> How IoT devices behave on a typical home network, why that's a problem, and how DNS-level blocking, WireGuard VPN, and VLAN isolation address it — using open source software on a small piece of hardware.
          </li>
        </ul>

        <h2>What we believe</h2>

        <ul>
          <li><strong>Privacy is a right, not a luxury.</strong> The tools exist. Making them accessible to ordinary people — not just security engineers — is the point.</li>

          <li><strong>Honest about trade-offs.</strong> None of these solutions are perfect or frictionless. We'll tell you what doesn't work, what's hard, and where the rough edges are.</li>

          <li><strong>Open source matters.</strong> GrapheneOS, UmbrelOS, Pi-hole, WireGuard — all of it is open source. You can verify what the software does. So can the global security community.</li>

          <li><strong>You don't need to go all-in.</strong> Any one of these three paths is meaningful on its own. Start where it makes sense for you.</li>
        </ul>

        <h2>Need a hand?</h2>

        <p>
          If you're trying to figure out where to start, which hardware to buy, or how something works — feel free to get in touch. No sales pitch, no obligation.
        </p>

        <p>
          <NuxtLink to="/company/contact">Send a message</NuxtLink> and I'll do my best to help.
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About NodeVault',
  description: 'NodeVault is a resource covering three paths to better privacy: GrapheneOS phones, self-hosted home servers with UmbrelOS, and home network protection with DNS blocking and VLANs.',
  ogTitle: 'About NodeVault',
  ogDescription: 'A resource for taking back control of your digital life — GrapheneOS, UmbrelOS self-hosting, and home network privacy.',
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
