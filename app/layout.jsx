import './globals.css'
export const metadata = { title: 'AI Sales Assistant' }
export default function RootLayout({ children }) {
  return (
    <html lang="lo">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wdth,wght@100,300..700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Noto Sans Lao', sans-serif" }} className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}