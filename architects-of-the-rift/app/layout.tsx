import type { Metadata } from "next";
import "./globals.css";
import BackgroundMusic from "@/components/BackgroundMusic";
import SoundToggle from "@/components/ui/SoundToggle";
import { AudioProvider } from "@/components/audio/AudioContext";

export const metadata: Metadata = {
  title: "Architects of the Rift",
  description: "LCK team manager and draft simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <AudioProvider>
          <BackgroundMusic />
          <SoundToggle />

          <div className="min-h-screen">
            <div className="mx-auto min-h-screen w-[1120px]">
              {children}
            </div>
          </div>
        </AudioProvider>
      </body>
    </html>
  );
}