import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from "next";
import { Providers } from '@/utils/providers';

import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";


export const metadata: Metadata = {
  title: "Alyra Voting",
  description: "Alyra Voting is a platform for voting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col flex-grow">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
