import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docqr.app',
  appName: 'QR Code',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    hostname: 'qr-code-ij9un2o2j-kontses-projects.vercel.app',
    allowNavigation: ['qr-code-ij9un2o2j-kontses-projects.vercel.app']
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
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
