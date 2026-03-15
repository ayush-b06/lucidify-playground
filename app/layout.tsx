import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.scss";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import { ThemeProvider } from "@/context/themeContext";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Lucidify | Web Development to Boost Your Business",
  description: "Affordable, custom websites designed to boost your business. Expert web solutions tailored to your needs. Located in Charlotte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {





  return (
    <html lang="en">
      <head>
        {/* Blocking script: sets data-theme before first paint — eliminates flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('lucidify-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');})();` }} />
      </head>
      <body className={poppins.className}>
          <ThemeProvider>
              <CustomCursor />
              <FloatingThemeToggle />
              {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
