"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type IntegrationProvider = {
  name: string;
  logo: string;
  description: string;
  isConnected: boolean;
};

export default function Integration() {
  const integrationProviders: IntegrationProvider[] = [
    {
      name: "paystack",
      logo: "/images/paystack-logo.svg",
      description: "Connect and collect payment from customers seamlessly.",
      isConnected: true,
    },
    {
      name: "flutterwave",
      logo: "/images/flutterwave-logo.svg",
      description: "Connect and collect payment from customers seamlessly.",
      isConnected: false,
    },
    {
      name: "monnify",
      logo: "/images/monnify-logo.svg",
      description: "Connect and collect payment from customers seamlessly.",
      isConnected: false,
    },
  ];

  return (
    <div className="space-y-4 pb-10">
      {integrationProviders.map((provider) => (
        <Card
          key={provider.name}
          className="p-4 flex justify-between items-center flex-row max-w-3xl mx-auto border rounded-md"
        >
          <div className="flex flex-col gap-2">
            <div className="h-6">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                width={140}
                height={32}
                className="object-contain h-full"
              />
            </div>
            <p className="text-sm text-gray-600">{provider.description}</p>
          </div>
          
          <div>
            {provider.isConnected ? (
              <Button>Connected</Button>
            ) : (
                <Button variant={'secondary'}>Not Connected</Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}