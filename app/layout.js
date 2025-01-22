import 'flowbite';
import './globals.css';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Meal Master',
  description: 'Generate meals based on ingredients you have!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}