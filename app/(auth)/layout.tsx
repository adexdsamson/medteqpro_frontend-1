import Image from "next/image";
import { WelcomeSection } from "./sign-in/_components/WelcomeSection";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen overflow-hidden bg-[#F1F4F8]">
      <div className="w-[50%] max-md:ml-0 max-md:w-full relative">
        <WelcomeSection />
        <div className="absolute z-10 w-full h-full bg-gradient-to-b from-[#0D277F] to-[#3F4E7F] opacity-50" />
        <Image src='/Medteqpro-auth.png' width={717} height={900} alt='welcome image' />
      </div>
      <div className="w-[50%] h-full max-md:ml-0 max-md:w-full flex items-center">
        {children}
      </div>
    </main>
  );
}
