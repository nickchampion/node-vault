<template>
  <Page
    :greeting="true"
    :show-business="false">
    <template #seller>
      <Grid>
        <GridCell size="lg">
          <Harvest />

          <ListingsSearch
            :query="{ sortBy: 'listingStatusPrioritySeller_asc,createdAtUTC_desc', limit: 5 }">
            <template #empty>
              <UiFeedback
                v-bind="utilListingsFeedbackPromoBindFormat()" />
            </template>

            <template #default="{ data }">
              <UiCard
                :title-prefix="utilIcon('trading')"
                title="Trading">
                <template #header-right>
                  <UiLink
                    to="/listings"
                    color="primary"
                    :prefix="utilIcon('listing')"
                    text="My listings" />
                </template>

                <template #body>
                  <div class="flex flex-col divide-y divide-primary">
                    <!-- cards with container class -->
                    <ListingCard
                      v-for="listing in data"
                      :key="listing.id"
                      :rounded="false"
                      :padding="false"
                      :bordered="false"
                      :shadowed="false"
                      :statusBorder="false"
                      class="py-4"
                      :listing="listing" />
                  </div>
                </template>
              </UiCard>
            </template>
          </ListingsSearch>
        </GridCell>

        <GridCell size="sm">
          <UiCard
            :title-prefix="utilIcon('insights')"
            title="Daily spot prices"
            description="View Insights to see other UK regions and more pricing insights"
            :title-suffix="utilInsightsSpotPriceRegionFormat(spotPriceRegion)"
            titleWrapping>
            <template #header-right>
              <UiLink
                color="primary"
                to="/insights"
                :prefix="utilIcon('insights')"
                text="Insights" />
            </template>

            <template #body>
              <InsightsGet
                type="daily-spot-prices"
                :spot-price-region="spotPriceRegion">
                <template #default="{ data }">
                  <InsightsWidget :daily-spot-prices="data" />
                </template>
              </InsightsGet>

              <!-- shameless hack -->
              <InsightsGet
                type="regional-prices"
                :spot-price-region="spotPriceRegion" />
            </template>
          </UiCard>

          <UiCard
            :title-prefix="utilIcon('weather')"
            title="Weather near you">
            <template #body>
              <LocationWeather class="w-full h-full min-h-64 rounded-md" />
            </template>
          </UiCard>
        </GridCell>
      </Grid>
    </template>

    <template #buyer>
      <Grid>
        <GridCell size="lg">
          <UiGuard :guarded="is('unvetted')">
            <template #guard>
              <UiFeedback
                type="promo"
                :icon-shield="{ icon: utilIcon('hand-wave') }"
                title="Almost there!"
                description="Your account manager will be in contact soon to help get your account verified and set up for trading. In the meantime:"
                :list="[
                  { prefix: utilIcon('check-circle'), text: 'Check out our Insights including spot prices and live trades' },
                  { prefix: utilIcon('check-circle'), text: 'Set up notification preferences on your Settings page' },
                  { prefix: utilIcon('check-circle'), text: 'Read our latest grain marketing articles' },
                ]" />
            </template>

            <template #default>
              <UiCard
                title="Trading statistics">
                <template #title-prepend>
                  <LogoIcon />
                </template>

                <template #header-right>
                  <UiLink
                    color="primary"
                    to="/contracts"
                    :prefix="utilIcon('trading')"
                    text="My trades" />
                </template>

                <template #body>
                  <BidsStats />
                </template>
              </UiCard>

              <UiCard
                :title-prefix="utilIcon('trading')"
                title="Trading">
                <template #header-right>
                  <UiLink
                    color="primary"
                    to="/listings/search"
                    :prefix="utilIcon('listing')"
                    text="Crops available" />
                </template>

                <template #body>
                  <ListingsSearch
                    :query="{ sortBy: 'listingStatusPriorityBuyer_asc,startDateUTC_asc', limit: 5 }">
                    <template #default="{ data }">
                      <div class="flex flex-col gap-4 divide-y divide-primary">
                        <div
                          v-for="listing in data"
                          :key="listing.id"
                          class="flex flex-wrap sm:flex-nowrap items-center gap-4 pb-4 last:pb-0">
                          <ListingSummary
                            :listing="listing"
                            class="grow" />

                          <UiButton
                            v-if="is('seller') || (is('buyer') && listing.status === 'active')"
                            :to="utilRouteFormat(is('seller') ? '/listings/:listingId' : '/listings/:listingId/offers', { params: { listingId: listing.id } })"
                            color="secondary"
                            class="w-full sm:w-auto"
                            text="View listing" />
                        </div>
                      </div>
                    </template>
                  </ListingsSearch>
                </template>
              </UiCard>
            </template>
          </UiGuard>
        </GridCell>

        <GridCell size="sm">
          <UiCard
            :title-prefix="utilIcon('insights')"
            title="Daily spot prices"
            description="View Insights to see other UK regions and more pricing insights"
            :title-suffix="utilInsightsSpotPriceRegionFormat(spotPriceRegion)"
            titleWrapping>
            <template #header-right>
              <UiLink
                color="primary"
                to="/insights"
                :prefix="utilIcon('insights')"
                text="Insights" />
            </template>

            <template #body>
              <InsightsGet
                type="daily-spot-prices"
                :spot-price-region="spotPriceRegion">
                <template #default="{ data }">
                  <InsightsWidget :daily-spot-prices="data" />
                </template>
              </InsightsGet>

              <!-- shameless hack -->
              <InsightsGet
                type="regional-prices"
                :spot-price-region="spotPriceRegion" />
            </template>
          </UiCard>
        </GridCell>
      </Grid>
    </template>
  </Page>
</template>

<script setup lang="ts">
const { spotPriceRegion } = useInsights()
const { is } = useHectare()
</script>
