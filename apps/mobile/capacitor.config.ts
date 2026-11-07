import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alejandro.codequest',
  appName: 'CodeQuest',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      // Hidden manually by BootScreenComponent once the animated splash
      // takes over, so there's no gap or duplicate splash in between.
      launchAutoHide: false,
      backgroundColor: '#080a0c',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
