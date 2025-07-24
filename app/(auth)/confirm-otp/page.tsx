import React, { Suspense } from "react";
import { ConfirmOTPForm } from "./_components/ConfirmOTPForm";

function ConfirmOTPPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmOTPForm />
      </Suspense>
    </div>
  );
}

export default ConfirmOTPPage;