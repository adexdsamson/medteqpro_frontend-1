"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Printer, Share2, User, Copy } from "lucide-react";
import { usePatientQrCode } from "@/features/services/patientService";

interface PatientShareDialogProps {
  patientId: string | number;
  patientUserId?: string | number;
  fullName?: string;
  trigger?: React.ReactNode;
}

function splitName(name?: string): { first: string; last: string } {
  if (!name) return { first: "", last: "" };
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ") || "";
  return { first, last };
}

const PatientShareDialog: React.FC<PatientShareDialogProps> = ({
  patientId,
  patientUserId,
  fullName,
  trigger,
}) => {
  const { data } = usePatientQrCode(String(patientId));
  const qrData = data?.data?.data?.qr_code_image || "";

  const { first, last } = splitName(fullName);
  const displayId = String(patientUserId ?? patientId);

  const shareText = `MedteqPro - Patient ${first} ${last} (ID: ${displayId})`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    "Patient QR"
  )}&body=${encodeURIComponent(shareText)}`;

  const handlePrint = () => {
    const w = window.open("", "print", "width=420,height=720");
    if (!w) return;
    const html = `<!doctype html><html><head><title>Patient QR</title></head><body style=\"font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;\">\n      <div style=\"width:340px;margin:16px auto;padding:16px;border:1px solid #e5e7eb;border-radius:12px;text-align:center;\">\n        <h2 style=\"margin:0 0 12px;\">Medteq Pro</h2>\n        <hr/>\n        <div style=\"margin:12px 0;text-align:left;\">\n          <div style=\"display:flex;justify-content:space-between;margin:6px 0;\"><span>First Name</span><strong>${
      first || ""
    }</strong></div>\n          <div style=\"display:flex;justify-content:space-between;margin:6px 0;\"><span>Last Name</span><strong>${
      last || ""
    }</strong></div>\n          <div style=\"display:flex;justify-content:space-between;margin:6px 0;\"><span>Patient ID</span><strong>${displayId}</strong></div>\n        </div>\n        <div style=\"margin:12px 0;\">\n          ${
      qrData
        ? `<img src=\"${qrData}\" alt=\"Patient QR\" style=\"width:240px;height:240px;object-fit:contain;\"/>`
        : "Generating QR..."
    }\n        </div>\n      </div>\n      <script>window.print(); setTimeout(()=>window.close(), 500);<\/script>\n    </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M20.52 3.48A11.7 11.7 0 0012 0C5.373 0 0 5.373 0 12c0 2.113.558 4.175 1.616 6L0 24l6.316-1.632A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12 0-3.126-1.207-6.069-3.48-8.52zM12 22.08c-1.927 0-3.81-.5-5.46-1.444l-.394-.23-3.756.968 1.004-3.66-.251-.402A10.08 10.08 0 011.92 12C1.92 6.152 6.152 1.92 12 1.92c2.706 0 5.242 1.054 7.152 2.948A10.06 10.06 0 0122.08 12c0 5.848-4.232 10.08-10.08 10.08zm5.74-7.56c-.313-.156-1.842-.907-2.128-1.008-.288-.103-.498-.156-.707.156-.207.313-.81.999-.994 1.206-.182.205-.375.234-.688.078-.313-.156-1.318-.487-2.513-1.552-.93-.83-1.559-1.856-1.741-2.169-.182-.313-.02-.482.137-.638.142-.141.313-.367.47-.55.16-.184.205-.313.313-.521.104-.205.052-.39-.026-.548-.078-.156-.706-1.7-.967-2.324-.255-.613-.514-.53-.707-.54-.182-.01-.39-.012-.6-.012-.208 0-.547.078-.834.39-.288.313-1.098 1.073-1.098 2.614s1.125 3.031 1.282 3.243c.156.205 2.22 3.387 5.382 4.744.752.324 1.339.518 1.796.663.754.24 1.44.206 1.982.125.604-.094 1.842-.752 2.102-1.482.26-.73.26-1.355.182-1.482-.078-.127-.287-.205-.6-.361z" />
    </svg>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            aria-label="Share patient card"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px] p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <Image
              src="/Medteqpro.svg"
              alt="Medteq Pro"
              width={137}
              height={43}
              className="h-6 mx-auto w-auto"
              priority
            />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Share Patient Card
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Avatar className="h-14 w-14 rounded-md bg-muted">
            <AvatarFallback className="rounded-md">
              <User className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        </div>

        <Separator className="my-3" />

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">First Name</span>
            <span className="font-medium">{first || ""}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Last Name</span>
            <span className="font-medium">{last || ""}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Patient ID</span>
            <div className="flex items-center gap-1">
              <span className="font-medium block truncate">{displayId}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                aria-label="Copy Patient ID"
                title="Copy Patient ID"
                onClick={() => navigator.clipboard?.writeText(displayId)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="mt-2 mb-2 flex justify-center">
          <div className="rounded-md bg-muted p-4">
            {qrData ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrData}
                alt="Patient QR"
                className="w-[240px] h-[240px] object-contain bg-white"
              />
            ) : (
              <div className="w-[240px] h-[240px] bg-white" />
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-2">
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm" className="gap-1">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </Button>
          </a>
          <a href={mailHref} target="_blank" rel="noreferrer">
            <Button variant="ghost" size="sm" className="gap-1">
              <Mail className="h-4 w-4" /> Mail
            </Button>
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientShareDialog;
