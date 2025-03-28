import React from 'react'
import { WelcomeSection } from './_components/WelcomeSection'
import { LoginForm } from './_components/LoginForm'

function SignInPage() {
  return (
    <div className="overflow-hidden bg-purple-600 max-md:pr-5">
    <div className="flex gap-5 max-md:flex-col bg-green-700">
      <div className="w-[70%] max-md:ml-0 max-md:w-full">
        <WelcomeSection />
      </div>

      <div className="ml-5 w-[40%] max-md:ml-0 max-md:w-full">
        <div className="flex flex-col self-stretch my-auto w-full max-md:mt-10">
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
  )
}

export default SignInPage