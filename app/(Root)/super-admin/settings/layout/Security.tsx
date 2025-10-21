"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { TextSwitch } from "@/components/FormInputs/TextSwitch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangePasswordForm } from "@/features/pages/profile/_components/ChangePasswordForm";

export default function Security() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card className="p-6 border rounded-md max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-60 mb-4 md:mb-0">
            <h2 className="text/base font-semibold">Password</h2>
          </div>

          <div className="flex-1 space-y-6">
            <p className="text-sm text-gray-600">
              Set password to protect your account
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="flex items-center justify-between">
                <div className="flex-1 relative">
                  <input
                    type="password"
                    value="••••••••••••••••••••"
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                {/* Change Password Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="ml-4 px-6">
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center text-lg font-medium text-gray-900">
                        Update Password
                      </DialogTitle>
                    </DialogHeader>
                    <ChangePasswordForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2-Step Verification */}
      <Card className="p-6 border rounded-md max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-60 mb-4 md:mb-0">
            <h2 className="text-base font-semibold">2-Step Verification</h2>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-sm text-gray-600">
              We recommend requiring a verification code in addition to your
              password
            </p>

            <TextSwitch
              label="Apply"
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
        </div>
      </Card>

      {/* Browser and Devices (commented out as requested) */}
      {/**
      <div className="space-y-4 max-w-3xl mx-auto">
        <div>
          <h2 className="text-base font-semibold">Browser and Devices</h2>
          <p className="text-sm text-gray-600">
            These browsers and devices have your sign details. You can remove any unauthorized device
          </p>
        </div>

        {browserSessions.map((session, index) => (
          <Card key={index} className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10">
                  <Image src={session.icon} alt={`${session.browser} icon`} width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium text-sm">{session.browser} on {session.os}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">{session.location}</span>
                <span className="text-sm text-gray-600">{session.status}</span>
                <Button variant="outline" className="text-red-500 hover:bg-red-500">Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      **/}
    </div>
  );
}
