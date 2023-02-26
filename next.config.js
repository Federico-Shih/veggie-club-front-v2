const { i18n } = require("./next-i18next.config");

/** @type {{rewrites: (function(): [{destination: `${*}/category`, source: string}]), reactStrictMode: boolean, i18n: {defaultLocale: string, locales: [string]}}} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  rewrites: () => {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/veggieclub-ar.appspot.com/o/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=9999999999, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
