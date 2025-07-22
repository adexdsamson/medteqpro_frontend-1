import React, { Suspense } from "react";
import { SetPasswordForm } from "./_components/SetPasswordForm";

function SetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full ">
      <Suspense fallback={<div>Loading...</div>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}

export default SetPasswordPage;