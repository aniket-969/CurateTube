import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "CurateTube",
  version: "0.1.0",

  action: {
    default_popup: "index.html",
  },

  //   icons: {
  //     "16": "icons/icon16.png",
  //     "32": "icons/icon32.png",
  //     "48": "icons/icon48.png",
  //     "128": "icons/icon128.png",
  //   },

  permissions: ["identity", "storage"],

  host_permissions: ["https://www.googleapis.com/*"],

  
});
