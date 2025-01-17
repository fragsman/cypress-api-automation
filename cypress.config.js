const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: "https://conduit.bondaracademy.com",
    apiUrl: "https://conduit-api.bondaracademy.com/api",
    specPattern: "cypress/e2e/**/*.spec.{js,jsx,ts,tsx}",

    env: { //for this to work you must first register this user in the web above
      username: "anemail@domain.com",
      password: "ronnie1234"
    },

    retries: 1,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
    configFile: 'reporter-config.json',
  },
  },
});
