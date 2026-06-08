import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petcare.app',
  appName: 'Paws & Care',
  webDir: 'out',
  server: {
    url: 'https://pet-care-app-sigma.vercel.app',
    cleartext: true
  }
};

export default config;
