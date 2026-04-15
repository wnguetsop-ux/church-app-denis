const withNextIntl = require('next-intl/plugin')('./src/i18n.ts')
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [
    { protocol: 'https', hostname: 'img.youtube.com' },
    { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
  ]},
}
module.exports = withNextIntl(withPWA(nextConfig))
