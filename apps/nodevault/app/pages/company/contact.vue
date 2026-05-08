<template>
  <UPage>
    <UPageHero
      title="Get in Touch"
      description="Have a question about GrapheneOS phones, UmbrelOS home servers, or business solutions? We'd love to hear from you."
      align="center" />

    <UContainer class="pb-16 sm:pb-24 lg:pb-32">
      <div class="max-w-3xl mx-auto">
        <UCard v-if="submitted">
          <div class="flex flex-col items-center gap-4 py-8 text-center">
            <div class="flex items-center justify-center size-14 rounded-full bg-primary/10">
              <UIcon
                name="i-lucide-check"
                class="size-7 text-primary" />
            </div>

            <div>
              <h3 class="text-lg font-semibold">
                Message sent
              </h3>

              <p class="text-muted mt-1">
                Thanks {{ state.name }}, we'll be in touch shortly at {{ state.email }}.
              </p>
            </div>

            <UButton
              variant="outline"
              color="neutral"
              @click="reset">
              Send another message
            </UButton>
          </div>
        </UCard>

        <UForm
          v-else
          :validate="validateContactForm"
          :state="state"
          class="space-y-3"
          @submit="submit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UFormField
              label="Name"
              name="name"
              required>
              <UInput
                v-model="state.name"
                placeholder="Your full name"
                class="w-full" />
            </UFormField>

            <UFormField
              label="Email"
              name="email"
              required>
              <UInput
                v-model="state.email"
                type="email"
                placeholder="you@example.com"
                class="w-full" />
            </UFormField>
          </div>

          <UFormField
            label="Phone"
            name="phone"
            hint="Optional">
            <PhoneInput v-model="state.phone" />
          </UFormField>

          <UFormField
            label="I'm interested in"
            name="interests"
            required>
            <UCheckboxGroup
              v-model="state.interests"
              :items="interestOptions"
              orientation="horizontal"
              class="flex-wrap gap-x-6 gap-y-2" />
          </UFormField>

          <UFormField
            label="Message"
            name="message"
            required>
            <UTextarea
              v-model="state.message"
              placeholder="Tell us what you're looking for..."
              :rows="5"
              class="w-full" />
          </UFormField>

          <div class="flex justify-end pt-1">
            <UButton
              type="submit"
              :loading="pending"
              icon="i-lucide-send">
              Send message
            </UButton>
          </div>

          <UAlert
            v-if="error"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-x"
            title="Something went wrong"
            :description="error" />
        </UForm>
      </div>
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
import type { ContactRequestSchema } from '@nodevault/platform.components.api.schemas'
import { validateContactForm } from '../../utils/validation'

useSeoMeta({
  title: 'Contact | NodeVault',
  description: 'Get in touch with NodeVault about GrapheneOS phones, UmbrelOS home servers, or small business solutions.',
})

const config = useConfig()

const interestOptions = [
  { label: 'GrapheneOS Phone', value: 'grapheneos' },
  { label: 'UmbrelOS Home Server', value: 'umbrelos' },
  { label: 'Small Business', value: 'business' },
  { label: 'Something else', value: 'other' },
]

const defaultState = (): ContactRequestSchema => ({
  name: '',
  email: '',
  phone: undefined,
  interests: [],
  message: '',
})

const state = reactive(defaultState())
const pending = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)

const submit = async () => {
  pending.value = true
  error.value = null

  try {
    await $fetch(`${config.platform.api}/comms/contact`, {
      method: 'POST',
      body: state,
    })

    submitted.value = true
  } catch {
    error.value = 'Failed to send your message. Please try again or email us directly.'
  } finally {
    pending.value = false
  }
}

const reset = () => {
  submitted.value = false
  error.value = null
  Object.assign(state, defaultState())
}
</script>
