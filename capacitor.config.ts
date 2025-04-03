import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docqr.app',
  appName: 'QR Code',
  webDir: 'out',
  server: {
    url: 'https://ep-falling-river-a2xs1r75-pooler.eu-central-1.aws.neon.tech',
    cleartext: false
  },
  android: {
    buildOptions: {
      keystorePath: 'android.keystore',
      keystorePassword: 'android',
      keystoreAlias: 'androiddebugkey',
      keystoreAliasPassword: 'android'
    }
  }
};

export default config;
