<template>
  <div class="flex grow min-w-0">
    <div
      v-if="ifNav"
      class="hidden lg:block w-app-nav shrink-0 bg-white border-r border-primary">
      <div
        class="sticky top-(--app-header-height-safe) h-app-remaining flex flex-col justify-between p-4">
        <div class="flex flex-col gap-4">
          <UiButton
            v-if="is('buyer')"
            to="/wanted/manage"
            color="primary"
            text="Post a wanted"
            :prefix="faPaperPlane"
            :block="true" />

          <UiButton
            v-if="is('seller')"
            to="/listings/manage"
            :color="is('buyer-seller') ? 'secondary' : 'primary'"
            text="Post a listing"
            :prefix="faPaperPlane"
            :block="true" />

          <nav>
            <ul>
              <li
                v-for="(item, i) in navigation.menu"
                :key="`navigation-menu-${i}`">
                <NuxtLink
                  :to="item.to"
                  class="flex items-center justify-between gap-4 h-11 md:h-[38px] p-3 rounded-md transition-colors duration-300"
                  :class="[
                    {
                      'text-secondary hover:bg-brand-extra-light':
                        item.active === false,
                      'text-brand bg-brand-extra-light': item.active === true,
                    },
                    item.class,
                  ]">
                  <div class="grow flex items-center gap-4">
                    <UiIcon :icon="item.icon" />

                    <span>{{ item.text }}</span>
                  </div>

                  <UiChip
                    v-if="item.new"
                    text="New"
                    color="orange"
                    :rounded="false" />

                  <UiCount
                    v-if="item.count"
                    :count="item.count"
                    color="brand"
                    :ping="true" />
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>

        <div
          class="flex flex-col p-4 gap-4 bg-surface-light rounded-md">
          <UiText
            :prefix="faQuestionCircle"
            text="Need help?"
            class="text-headline-4 flex items-center gap-2" />

          <nav>
            <ul class="flex flex-col gap-2">
              <li
                v-for="(item, i) in navigation.help"
                :key="`navigation-help-${i}`">
                <UiLink
                  v-bind="item"
                  class="flex items-center gap-2"
                  color="brand" />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <main class="min-w-0 grow pb-(--app-bottom-nav-height-safe)">
      <slot />
    </main>

    <nav
      v-if="ifBottom"
      class="fixed bottom-0 left-0 w-full z-10 h-app-bottom-nav bg-white border-t border-primary">
      <ul class="flex items-center max-w-md mx-auto">
        <li
          v-for="(item, i) in navigation.menu"
          :key="`navigation-menu-${i}`"
          class="flex-1">
          <NuxtLink
            :to="item.to"
            class="flex flex-col items-center justify-center gap-1 px-1 py-3"
            :class="{
              'text-secondary': item.active === false,
              'text-brand': item.active === true,
            }">
            <UiIcon
              :icon="item.icon"
              class="text-lg" />

            <span class="text-xs text-center text-nowrap">{{ item.text }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {
  faLifeRing,
  faQuestionCircle,
  faHouse,
  faChartLine,
  faHandshake,
  faCog,
  faWheat,
  faPaperPlane,
  faComment,
} from '@fortawesome/pro-regular-svg-icons'
import {
  faPaperPlane as faPaperPlaneSolid,
  faHouse as faHouseSolid,
  faChartLine as faChartLineSolid,
  faHandshake as faHandshakeSolid,
  faCog as faCogSolid,
  faWheat as faWheatSolid,
  faTruckContainer,
} from '@fortawesome/pro-solid-svg-icons'

const route = useRoute()

const { is } = useHectare()
const userStore = useUserStore()
const { hasPermission } = userStore
const isHaulierUser = computed(() => hasPermission('logistics.haulier.read') || hasPermission('logistics.haulier.write'))

const navigation = computed(() => {
  const menu = [
    {
      if: hasPermission('trading.bids.write'),
      icon: route.path === '/wanted/manage' ? faPaperPlaneSolid : faPaperPlane,
      text: 'Post wanted',
      to: '/wanted/manage',
      class: 'md:hidden',
      active: route.path === '/wanted/manage',
    },
    {
      if: hasPermission('trading.listings.write'),
      icon: route.path === '/listings/manage' ? faPaperPlaneSolid : faPaperPlane,
      text: 'Post listing',
      to: '/listings/manage',
      class: 'md:hidden',
      active: route.path === '/listings/manage',
    },
    {
      if: !is('advisor') && !hasPermission('logistics.haulier.read'),
      icon: route.path === '/' ? faHouseSolid : faHouse,
      text: 'Home',
      to: '/',
      active: route.path === '/' || route.path === '/setup',
    },
    {
      if: hasPermission('trading.listings.write'),
      icon: route.path.startsWith('/crops') ? faWheatSolid : faWheat,
      text: 'Crops',
      to: '/crops',
      // new until march 2026
      new: new Date() < new Date('2026-03-01T00:00:00Z'),
      active: route.path.startsWith('/crops'),
    },
    {
      if: hasPermission('trading.listings.write') || hasPermission('trading.bids.write'),
      icon: isTradingRoute() ? faHandshakeSolid : faHandshake,
      text: 'Trading',
      to: hasPermission('trading.bids.write') ? '/listings/search' : '/listings',
      count: 0,
      active: isTradingRoute(),
    },
    {
      if: hasPermission('trading.market.read'),
      icon: route.path.startsWith('/insights') ? faChartLineSolid : faChartLine,
      text: 'Insights',
      to: '/insights',
      active: route.path.startsWith('/insights'),
    },
    {
      if: hasPermission('logistics.merchant.read') || hasPermission('logistics.haulier.read'),
      icon: faTruckContainer,
      text: 'Movements',
      to: '/movements',
      active: route.path.startsWith('/movements'),
    },

    {
      if: false,
      icon: route.path.startsWith('/businesses') ? faCogSolid : faCog,
      text: 'Businesses',
      to: '/businesses',
      active: route.path.startsWith('/businesses'),
    },
    {
      if: true,
      icon: route.path.startsWith('/settings') ? faCogSolid : faCog,
      text: 'Settings',
      to: '/settings',
      active: route.path.startsWith('/settings'),
    },
  ].filter(i => i.if === true)

  const help = [
    {
      if: !isHaulierUser.value,
      type: 'link',
      prefix: utilIcon('phone'),
      to: utilMiscSupportPhone('tel:'),
      text: utilMiscSupportPhone(),
    },
    {
      if: !isHaulierUser.value,
      type: 'link',
      prefix: utilIcon('email'),
      to: utilMiscSupportEmail('mailto:'),
      text: 'Email us',
    },
    {
      if: !isHaulierUser.value,
      prefix: faLifeRing,
      text: 'Help centre',
      to: { query: { layer: 'help' } },
    },
    {
      if: isHaulierUser.value,
      prefix: faComment,
      text: 'Send Feedback',
      to: 'https://form.jotform.com/260784430421048',
      target: '_blank',
    },
  ].filter(i => i?.if === true)

  return { menu, help }
})

const ifNav = computed(() => {
  return true
})

const ifBottom = computed(() => {
  return is('setup')
})

function isTradingRoute() {
  return route.path.startsWith('/listings')
    || route.path.startsWith('/bids')
    || route.path.startsWith('/contracts')
    || route.path.startsWith('/marketing-plans')
    || route.path.startsWith('/wanted')
}
</script>
