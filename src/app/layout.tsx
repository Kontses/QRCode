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
    <html lang="en" className="dark bg-gray-900">
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
