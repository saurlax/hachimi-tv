import { PreferenceControls } from "@/components/preference-controls"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="absolute top-3 right-4 md:right-6"><PreferenceControls /></div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
