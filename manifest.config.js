import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "CurateTube",
  version: "0.1.0",

  action: {
    default_popup: "index.html",
  },
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw+opltpR3PVqg7ygqhMAohG6h5XZUSRT2mitFOJnd39AiW0AIqELaicehgjmVFX1WO6OutLaCsHT5G+LGX5iPBs2QP4af8xkN6wRAVep4J1Fs+oFVnQklVHAmCWZqibomWRxQ8Hjkm4uq4DB119j/jQs3rv/qoXu5jU2Z9M2CD/XAWAXx5Huz4tLp031AVaIbjuPPv1E/f+XeaEL3sqeWbCqjRJL6kXBkpTqyqoRDMuABF2FviT8dpOKQ2SQrUPYSK/khee0c6+K5csQ1gbB6OsrSKfsb6PHyN3hh3PPebZJzIN3Aspj/jLRRCe9HXW8gutYvYQ92DMBpmiJ+xbF5wIDAQAB",
  icons: {
    16: "icons/icon16.png",
    32: "icons/icon32.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png",
  },

  permissions: ["identity", "storage"],

  host_permissions: ["https://www.googleapis.com/*"],
});
