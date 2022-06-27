const path = require('path');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.DOMAIN || 'https://quansight.com',
  generateRobotsTxt: true, // (optional)
  // https://github.com/iamvishnusankar/next-sitemap#index-sitemaps-optional
  // No need to generate an index sitemap unless sitemap.xml is over 50MB.
  generateIndexSitemap: false,
  sourceDir: path.resolve(__dirname, '../../dist/apps/consulting/.next'),
  outDir: path.resolve(__dirname, '../../dist/apps/consulting/public'),
};
