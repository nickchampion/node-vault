<template>
  <UPage>
    <section class="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b border-slate-200 py-12 sm:py-16">
      <UContainer>
        <div class="max-w-2xl">
          <p class="text-sky-600 font-semibold text-sm tracking-wide uppercase mb-3">
            Contact
          </p>

          <h1 class="text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Get in touch
          </h1>

          <p class="text-lg text-slate-500 leading-relaxed">
            Whether you have a project in mind, a question, or just want to connect — I'd love to hear from you.
          </p>
        </div>
      </UContainer>
    </section>

    <UContainer class="py-12">
      <div class="max-w-2xl">
        <UCard v-if="submitted">
          <div class="flex flex-col items-center gap-4 py-8 text-center">
            <div class="flex items-center justify-center size-14 rounded-full bg-sky-50">
              <UIcon
                name="i-lucide-check"
                class="size-7 text-sky-500" />
            </div>

            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Message sent
              </h3>

              <p class="text-slate-500 mt-1">
                Thanks {{ state.name }}, I'll be in touch shortly.
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
          class="space-y-4"
          @submit="submit">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            label="Message"
            name="message"
            required>
            <UTextarea
              v-model="state.message"
              placeholder="What would you like to talk about?"
              :rows="6"
              class="w-full" />
          </UFormField>

          <div class="flex justify-end pt-1">
            <UButton
              type="submit"
              :loading="pending"
              color="primary"
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
import type { ContactRequestSchema } from '@nodevault/platform.components.nodevault.openapi'
import { validateContactForm } from '../utils/validation/contact'

useSeoMeta({
  title: 'Contact — Nick Champion',
  description: 'Get in touch with Nick Champion.',
})

type FormState = Omit<ContactRequestSchema, 'interests'>

const defaultState = (): FormState => ({
  name: '',
  email: '',
  phone: undefined,
  message: '',
})

const api = useApiClient()
const state = reactive(defaultState())
const pending = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)

const submit = async () => {
  pending.value = true
  error.value = null

  const response = await api.comms.contact({ ...state, interests: ['other'] })

  if (response.success) {
    submitted.value = true
  } else {
    error.value = response.error?.message ?? 'Failed to send your message. Please try again.'
  }

  pending.value = false
}

const reset = () => {
  submitted.value = false
  error.value = null
  Object.assign(state, defaultState())
}
</script>
