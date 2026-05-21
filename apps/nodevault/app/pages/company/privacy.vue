<template>
  <UPage>
    <UPageHero
      title="Privacy Policy"
      description="Last updated: May 2026"
      align="center" />

    <UPageSection>
      <div class="content max-w-3xl mx-auto">
        <p>
          NodeVault ("we", "us", "our") is committed to protecting your personal data. This policy explains what data we collect, why we collect it, and how we handle it. We operate under UK GDPR and the Data Protection Act 2018.
        </p>

        <h2>1. Who We Are</h2>

        <p>
          NodeVault is a company registered in the United Kingdom. If you have any questions about this policy or how we handle your data, contact us at <a href="mailto:hello@nodevault.cloud">hello@nodevault.cloud</a>.
        </p>

        <h2>2. Data We Collect</h2>

        <h3>Information you provide directly</h3>

        <ul>
          <li><strong>Contact enquiries</strong> — name, email address, phone number (optional), and the message you send us via the contact form.</li>

          <li><strong>Orders</strong> — name, delivery address, email address, and phone number required to fulfil a purchase.</li>
        </ul>

        <h3>Information collected automatically</h3>

        <ul>
          <li><strong>Server logs</strong> — IP address, browser type, pages visited, and timestamps. These are retained for up to 30 days for security and debugging purposes.</li>

          <li><strong>Cookies</strong> — We use only essential session cookies required for the website to function. We do not use advertising, analytics, or tracking cookies.</li>
        </ul>

        <h2>3. How We Use Your Data</h2>

        <p>We use the data we collect to:</p>

        <ul>
          <li>Respond to contact enquiries</li>

          <li>Process and fulfil orders</li>

          <li>Provide post-sale support</li>

          <li>Meet our legal obligations (e.g. tax records)</li>

          <li>Protect our systems and users from security threats</li>
        </ul>

        <p>
          We do not sell, rent, or share your personal data with third parties for marketing purposes. Ever.
        </p>

        <h2>4. Legal Basis for Processing</h2>

        <p>Under UK GDPR, we process your data on the following bases:</p>

        <ul>
          <li><strong>Contract</strong> — processing necessary to fulfil an order you have placed.</li>

          <li><strong>Legitimate interests</strong> — responding to enquiries and maintaining system security.</li>

          <li><strong>Legal obligation</strong> — retaining financial records as required by law.</li>
        </ul>

        <h2>5. Data Retention</h2>

        <ul>
          <li><strong>Contact enquiries</strong> — retained for 12 months from the date of enquiry, unless a commercial relationship follows.</li>

          <li><strong>Order records</strong> — retained for 7 years to comply with HMRC requirements.</li>

          <li><strong>Server logs</strong> — retained for 30 days then automatically deleted.</li>
        </ul>

        <h2>6. Third-Party Services</h2>

        <p>We use a small number of third-party services to operate the website and fulfil orders:</p>

        <ul>
          <li><strong>Fly.io</strong> — our API server is hosted on Fly.io infrastructure in the UK/EU.</li>

          <li><strong>Cloudflare</strong> — our frontend is served via Cloudflare's edge network. Cloudflare may process request metadata (IP addresses) in accordance with their own privacy policy.</li>

          <li><strong>Payment processors</strong> — payment card data is handled entirely by our payment provider and is never stored by NodeVault.</li>
        </ul>

        <p>
          We do not use Google Analytics, Meta Pixel, or any other advertising or behavioural tracking technology.
        </p>

        <h2>7. Your Rights</h2>

        <p>Under UK GDPR you have the right to:</p>

        <ul>
          <li><strong>Access</strong> the personal data we hold about you.</li>

          <li><strong>Rectify</strong> inaccurate or incomplete data.</li>

          <li><strong>Erase</strong> your data where there is no legal basis for continued retention.</li>

          <li><strong>Restrict</strong> processing in certain circumstances.</li>

          <li><strong>Object</strong> to processing based on legitimate interests.</li>

          <li><strong>Data portability</strong> — receive your data in a structured, machine-readable format.</li>
        </ul>

        <p>
          To exercise any of these rights, email us at <a href="mailto:hello@nodevault.cloud">hello@nodevault.cloud</a>. We will respond within 30 days.
        </p>

        <p>
          If you are unsatisfied with our response, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener">ico.org.uk</a>.
        </p>

        <h2>8. Security</h2>

        <p>
          We take appropriate technical and organisational measures to protect your data against unauthorised access, loss, or disclosure. Our API is served over HTTPS. Data at rest is stored on encrypted infrastructure. Access to personal data is restricted to personnel who need it to perform their role.
        </p>

        <h2>9. Changes to This Policy</h2>

        <p>
          We may update this policy from time to time. When we do, we will update the "last updated" date at the top of this page. Material changes will be communicated directly to customers where we hold a contact email address.
        </p>

        <h2>10. Contact</h2>

        <p>
          For any privacy-related questions or to exercise your rights, contact us at <a href="mailto:hello@nodevault.cloud">hello@nodevault.cloud</a>

          or use our <NuxtLink to="/company/contact">contact form</NuxtLink>.
        </p>
      </div>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy | NodeVault',
  description: 'NodeVault privacy policy. We collect only what we need, never sell your data, and operate under UK GDPR.',
})
</script>

<style scoped>
.content p {
  line-height: 1.75;
  margin-bottom: 1rem;
  color: var(--ui-text-muted);
}

.content h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
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
