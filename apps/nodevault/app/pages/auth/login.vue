<template>
  <UPage>
    <UPageHero
      title="Sign in to NodeVault"
      align="center"
      :ui="{ container: 'py-12 sm:py-16' }" />

    <UContainer class="pb-16 sm:pb-24">
      <div class="max-w-sm mx-auto">
        <UCard v-if="verifying">
          <div class="flex flex-col items-center gap-3 py-6 text-center">
            <UIcon
              name="i-lucide-loader-circle"
              class="size-8 text-primary animate-spin" />

            <p class="text-sm text-muted">
              Verifying your login…
            </p>
          </div>
        </UCard>

        <UCard v-else-if="sent">
          <div class="flex flex-col items-center gap-4 py-6 text-center">
            <div class="flex items-center justify-center size-12 rounded-full bg-primary/10">
              <UIcon
                name="i-lucide-mail"
                class="size-6 text-primary" />
            </div>

            <div>
              <p class="font-semibold">
                Check your email
              </p>

              <p class="text-sm text-muted mt-1">
                We've sent a login link to <strong>{{ state.email }}</strong>.
              </p>
            </div>

            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              @click="sent = false">
              Use a different email
            </UButton>
          </div>
        </UCard>

        <UCard v-else>
          <div class="space-y-4">
            <div>
              <p class="font-semibold">
                Welcome back
              </p>

              <p class="text-sm text-muted mt-0.5">
                Enter your email and we'll send you a sign-in link.
              </p>
            </div>

            <UForm
              :validate="zodValidate(schema)"
              :state="state"
              class="space-y-3"
              @submit="submit">
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

              <UButton
                type="submit"
                :loading="pending"
                class="w-full justify-center">
                Continue
              </UButton>
            </UForm>
          </div>
        </UCard>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-x"
          class="mt-3"
          :title="error" />
      </div>
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useAuthStore } from '../../stores/auth-store.js'
import { zodValidate } from '../../utils/validation/index.js'

useSeoMeta({ title: 'Sign In | NodeVault' })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const state = reactive({ email: '' })
const pending = ref(false)
const sent = ref(false)
const verifying = ref(false)
const error = ref<string | null>(null)

const schema = z.object({
  email: z.email('Enter a valid email address'),
})

const submit = async () => {
  pending.value = true
  error.value = null

  const response = await useApiClient().auth.login(state.email)

  if (response.success) {
    sent.value = true
    pending.value = false
  } else {
    error.value = 'Something went wrong. Please try again.'
  }
}

const verify = async (code: string) => {
  verifying.value = true
  error.value = null

  const response = await useApiClient().auth.verify(code)

  if (response.success) {
    authStore.setAuthTokens(response)
    await router.replace('/account')
  } else {
    error.value = 'Invalid or expired link. Please request a new one.'
    verifying.value = false
  }
}

onMounted(() => {
  const code = route.query.code as string | undefined

  if (code) verify(code)
})
</script>
