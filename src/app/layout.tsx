import './globals.css';

export const metadata = {
  title: 'DocQR',
  description: 'Document QR Code Scanner and Generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
