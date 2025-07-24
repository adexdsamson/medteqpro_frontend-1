import React, { Suspense } from "react";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

export default ResetPasswordPage;