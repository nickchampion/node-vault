<template>
  <UDashboardPanel>
    <UDashboardNavbar title="Dashboard">
      <template #right>
        <UButton
          icon="i-lucide-plus"
          label="New Secret"
          size="sm"
          color="primary" />
      </template>
    </UDashboardNavbar>

    <div class="p-6 space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <UCard
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted">{{ stat.label }}</span>

            <UIcon
              :name="stat.icon"
              class="text-muted size-4" />
          </div>

          <p class="text-3xl font-bold tracking-tight">
            {{ stat.value }}
          </p>

          <p class="text-xs text-muted">
            {{ stat.trend }}
          </p>
        </UCard>
      </div>

      <!-- Recent Activity -->
      <UCard title="Recent Activity">
        <UTable
          :data="recentActivity"
          :columns="columns" />
      </UCard>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const stats = [
  {
    label: 'Total Secrets',
    value: '128',
    icon: 'i-lucide-key-round',
    trend: '+12 this week',
  },
  {
    label: 'Active Users',
    value: '24',
    icon: 'i-lucide-users',
    trend: '+3 this month',
  },
  {
    label: 'API Calls Today',
    value: '4,291',
    icon: 'i-lucide-activity',
    trend: '↑ 18% vs yesterday',
  },
  {
    label: 'Audit Events',
    value: '1,047',
    icon: 'i-lucide-scroll-text',
    trend: 'Last 30 days',
  },
]

const columns = [
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'secret', header: 'Secret' },
  { accessorKey: 'time', header: 'Time' },
]

const recentActivity = [
  {
    user: 'alice@example.com', action: 'Read secret', secret: 'STRIPE_KEY', time: '2m ago',
  },
  {
    user: 'bob@example.com', action: 'Created secret', secret: 'OPENAI_API', time: '15m ago',
  },
  {
    user: 'carol@example.com', action: 'Deleted secret', secret: 'OLD_TOKEN', time: '1h ago',
  },
  {
    user: 'dave@example.com', action: 'Updated secret', secret: 'DB_PASSWORD', time: '2h ago',
  },
  {
    user: 'eve@example.com', action: 'Read secret', secret: 'WEBHOOK_SECRET', time: '3h ago',
  },
]
</script>
