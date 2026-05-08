<script setup lang="ts">
const year = new Date().getFullYear()

useHead({
  bodyAttrs: {
    style: 'margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;',
  },
})
</script>

<template>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#09090b;width:100%;min-height:100vh;">
    <tr>
      <td
        align="center"
        style="padding:40px 16px;">
        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#18181b;border-radius:12px 12px 0 0;padding:20px 28px;border-bottom:1px solid #27272a;">
              <a
                href="https://www.nodevault.cloud"
                style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  style="display:block;flex-shrink:0;">
                  <path
                    d="M12 2L4 5.5V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V5.5L12 2Z"
                    fill="#6366f1"
                    stroke="#6366f1"
                    stroke-width="0"
                    stroke-linecap="round"
                    stroke-linejoin="round" />

                  <path
                    d="M9 12L11 14L15 10"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>

                <span style="font-size:16px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;line-height:1;">NodeVault</span>
              </a>
            </td>
          </tr>

          <!-- Page content -->
          <tr>
            <td style="background-color:#18181b;padding:32px 28px;">
              <slot />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#18181b;border-radius:0 0 12px 12px;padding:20px 28px;border-top:1px solid #27272a;">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-size:12px;color:#71717a;line-height:1.5;">
                      © {{ year }} NodeVault. All rights reserved.
                    </p>
                  </td>

                  <td
                    align="right"
                    style="vertical-align:middle;white-space:nowrap;">
                    <a
                      href="https://www.nodevault.cloud/company/about"
                      style="font-size:12px;color:#71717a;text-decoration:none;margin-left:16px;">About</a>

                    <a
                      href="https://www.nodevault.cloud/company/contact"
                      style="font-size:12px;color:#71717a;text-decoration:none;margin-left:16px;">Contact</a>

                    <a
                      href="https://www.nodevault.cloud/company/privacy"
                      style="font-size:12px;color:#71717a;text-decoration:none;margin-left:16px;">Privacy Policy</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>
