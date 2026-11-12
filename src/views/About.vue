<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="headline">
            {{ $t('page_titles.about') }}
          </v-card-title>
          <v-card-text>
            <p>{{ $t('about.description') }}</p>
            <v-divider class="my-4" />
            <h3 class="subtitle-1">{{ $t('about.features') }}</h3>
            <v-list>
              <v-list-item v-for="(feature, index) in features" :key="index">
                <v-list-item-icon>
                  <v-icon color="primary">fa-check-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ feature }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider class="my-4" />
            <p class="body-2">{{ $t('about.version') }}: {{ version }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'About',
  data() {
    return {
      version: process.env.VUE_APP_VERSION || '1.0.0'
    }
  },
  computed: {
    features() {
      return [
        this.$t('about.feature_products'),
        this.$t('about.feature_shopping'),
        this.$t('about.feature_categories'),
        this.$t('about.feature_history'),
        this.$t('about.feature_analysis')
      ]
    }
  }
}
</script>
