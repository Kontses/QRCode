import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.docqr.app',
  appName: 'QR Code',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    hostname: 'qr-code-i6w0eny5l-kontses-projects.vercel.app',
    allowNavigation: ['qr-code-i6w0eny5l-kontses-projects.vercel.app']
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
