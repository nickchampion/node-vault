<template>
  <UPage>
    <UPageHero
      title="Create your account"
      align="center"
      :ui="{ container: 'py-12 sm:py-16' }" />

    <UContainer class="pb-16 sm:pb-24">
      <div class="max-w-lg mx-auto">
        <UCard>
          <div class="space-y-6 py-2">
            <div>
              <p class="font-semibold text-lg">
                Get started
              </p>

              <p class="text-sm text-muted mt-1">
                Create your NodeVault account to manage your devices and services.
              </p>
            </div>

            <UForm
              :validate="validateRegisterForm"
              :state="state"
              class="space-y-4"
              @submit="submit">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormField
                  label="First name"
                  name="firstName"
                  required>
                  <UInput
                    v-model="state.firstName"
                    placeholder="Jane"
                    class="w-full" />
                </UFormField>

                <UFormField
                  label="Last name"
                  name="lastName"
                  required>
                  <UInput
                    v-model="state.lastName"
                    placeholder="Smith"
                    class="w-full" />
                </UFormField>
              </div>

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

              <UFormField
                label="Phone"
                name="phone"
                hint="Optional">
                <PhoneInput v-model="phoneModel" />
              </UFormField>

              <UButton
                type="submit"
                :loading="pending"
                class="w-full justify-center">
                Create account
              </UButton>
            </UForm>

            <p class="text-sm text-center text-muted">
              Already have an account?
              <ULink
                to="/auth/login"
                class="text-primary font-medium hover:underline">
                Sign in
              </ULink>
            </p>
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
import type { RegisterRequestSchema } from '@nodevault/platform.components.nodevault.openapi'
import { useAuthStore } from '../../stores/auth-store.js'
import { validateRegisterForm } from '../../utils/validation/index.js'

useSeoMeta({ title: 'Create Account | NodeVault' })

const router = useRouter()
const authStore = useAuthStore()

const defaultState = (): RegisterRequestSchema => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: undefined,
})

const state = reactive(defaultState())
const pending = ref(false)
const error = ref<string | null>(null)

const phoneModel = computed({
  get: () => state.phone ?? undefined,
  set: (v) => { state.phone = v ?? null },
})

const submit = async () => {
  pending.value = true
  error.value = null

  const response = await useApiClient().auth.register(state)

  if (response.success) {
    authStore.setAuthTokens(response)
    await router.replace('/account')
  } else {
    error.value = response.status === 'conflict'
      ? 'An account with this email already exists. Try signing in instead.'
      : 'Something went wrong. Please try again.'
  }

  pending.value = false
  router.push('/account')
}
</script>
