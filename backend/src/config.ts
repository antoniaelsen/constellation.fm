export default {
  express: {
    backendDomain: process.env.BACKEND_DOMAIN_NAME,
    frontendDomain: process.env.FRONTEND_DOMAIN_NAME,

    auth: {
      // cookieDomainName: process.env,
      authTokenSecret: process.env.AUTH_TOKEN,
      apple: {
        keyID: process.env.APPLE_KEY_ID,
        teamID: process.env.APPLE_TEAM_ID,
        privateKeyLocation: process.env.APPLE_PRIVATE_KEY,
      },
      auth0: {
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        domain: process.env.AUTH0_DOMAIN,
      },
      spotify: {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    }
  }
};