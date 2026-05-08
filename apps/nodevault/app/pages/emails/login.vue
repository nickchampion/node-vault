<script setup lang="ts">
import { computed } from 'vue'

const config = useConfig()

definePageMeta({ layout: 'email' })

useHead({ title: 'Your NodeVault sign-in link' })

const route = useRoute()
const name = computed(() => String(route.query.name ?? ''))
const code = computed(() => String(route.query.code ?? ''))
const loginUrl = computed(() => `${config.platform.app}/auth/verify?code=${code.value}`)
</script>

<template>
  <!-- Preview text: hidden in email body, shown in inbox snippet -->
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">
    Use this link to sign in to your NodeVault account.&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#ffffff;line-height:1.5;">
    Hello, {{ name }}
  </p>

  <p style="margin:0 0 28px;font-size:14px;color:#a1a1aa;line-height:1.6;">
    Use the button below to login to NodeVault. This link expires in 10 minutes.
  </p>

  <table
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="margin:0 0 28px;">
    <tr>
      <td style="border-radius:8px;background-color:#6366f1;">
        <a
          :href="loginUrl"
          style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;border-radius:8px;">
          Sign in to NodeVault
        </a>
      </td>
    </tr>
  </table>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="margin:0 0 24px;">
    <tr>
      <td style="border-top:1px solid #27272a;" />
    </tr>
  </table>

  <p style="margin:28px 0 0;font-size:12px;color:#52525b;line-height:1.6;">
    If you didn't request this, you can safely ignore this email. Someone may have entered your email address by mistake.
  </p>
</template>
