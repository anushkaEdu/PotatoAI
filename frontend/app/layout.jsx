import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Potato Disease Detector',
  description: 'AI-powered potato leaf disease detection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-inter bg-dark text-text min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
