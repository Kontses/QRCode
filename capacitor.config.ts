import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docqr.app',
  appName: 'DocQR',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
    hostname: 'localhost'
  },
  android: {
    buildOptions: {
      keystorePath: 'docqr.keystore',
      keystoreAlias: 'docqr',
      keystorePassword: 'docqr123'
    }
  }
};

export default config;
