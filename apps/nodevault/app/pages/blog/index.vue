<template>
  <UPage>
    <UPageHero
      title="The NodeVault Blog"
      description="Practical privacy guides, how-tos, and plain-English explanations of the tools and techniques that make a real difference."
      align="center" />

    <UPageSection align="center">
      <UCard class="max-w-2xl mx-auto text-center p-12 space-y-6">
        <div class="flex items-center justify-center size-16 rounded-2xl bg-primary/10 mx-auto">
          <UIcon
            name="i-lucide-pen-line"
            class="size-8 text-primary" />
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold">
            Coming Soon
          </h2>

          <p class="text-muted max-w-sm mx-auto">
            We're working on practical guides covering GrapheneOS, UmbrelOS, privacy routers, and everyday privacy habits. Check back soon.
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <UButton
            to="/phones"
            variant="outline"
            color="neutral"
            icon="i-lucide-smartphone">
            Privacy Phones
          </UButton>

          <UButton
            to="/umbrelos"
            variant="outline"
            color="neutral"
            icon="i-lucide-server">
            Home Server
          </UButton>

          <UButton
            to="/privacy-router"
            variant="outline"
            color="neutral"
            icon="i-lucide-box">
            Privacy Router
          </UButton>
        </div>
      </UCard>
    </UPageSection>
  </UPage>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Blog | NodeVault',
  description: 'Practical privacy guides, how-tos, and plain-English explanations of GrapheneOS, UmbrelOS, privacy routers, and everyday privacy tools. Coming soon.',
  ogTitle: 'The NodeVault Blog',
  ogDescription: 'Practical privacy guides and how-tos. Coming soon.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
