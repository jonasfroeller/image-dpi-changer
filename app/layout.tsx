import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: 'DPI Changer',
  description: 'View and change your image DPI',
  keywords: 'dpi changer, image dpi, pixels per inch, EXIF data, image metadata',
  icons: {
    icon: 'https://avatars.githubusercontent.com/u/121523551?v=4',
  },
}

const Header = () => {
  return (
    <header className="sticky top-0 z-10 p-4 text-white bg-gray-800">
      <div className="flex justify-between items-center mx-auto max-w-6xl">
        <div className="text-xl">DPI Changer</div>
        <a
          href="https://github.com/jonasfroeller/image-dpi-changer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-300 hover:text-white"
        >
          <Icon icon="mdi:github" width="30" height="30" />
        </a>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="p-4 text-sm text-center text-gray-700 bg-gray-200">
      <div className="flex flex-col justify-between items-center mx-auto space-y-2 max-w-6xl sm:flex-row sm:space-y-0">
        <div className="flex items-center space-x-2">
          <img src="https://avatars.githubusercontent.com/u/121523551?v=4" alt="Jonas Fröller" className="w-6 h-6 rounded-full" />
          <span>
            Made by <a href="https://jonasfroeller.is-a.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Jonas Fröller</a>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="https://merginit.com/favicon.png" alt="Imprint" className="w-6 h-6" />
          <a href="https://merginit.com/legal/imprint" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Imprint
          </a>
        </div>
      </div>
    </footer>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
