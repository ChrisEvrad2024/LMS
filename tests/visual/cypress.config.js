import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1920,
    viewportHeight: 1080,
    setupNodeEvents(on, config) {
      require('cypress-image-diff-js/dist/plugin')(on, config)
    },
  },
  video: true,
  screenshotOnRunFailure: true,
})
