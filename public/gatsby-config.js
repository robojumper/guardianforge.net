const config = require("./build.config.js")

module.exports = {
  siteMetadata: {
    siteUrl: config.publicPath,
    title: "GuardianForge",
    siteDescription: "The best way to create and share Destiny 2 builds with your friends & audience."
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: `${config.wpUrl}/graphql`,
        auth: {
          htaccess: {
            username: config.wpUsername,
            password: config.wpPass
          }
        },
        html: {
          useGatsbyImage: false,
        },
        develop: {
          hardCacheMediaFiles: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        minify: true
      },
    },
    {
      resolve: "gatsby-plugin-layout",
      options: {
        component: require.resolve("./src/layouts/LayoutRouter.jsx")
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'images',
        path: `${__dirname}/src/content/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
        ],
      },
    },
  ],
};