import { ChefHat } from "lucide-react";

import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-navy-950">
      <aside className="hidden w-[40%] flex-col items-center justify-center gap-4 bg-navy-900 p-12 md:flex">
        <ChefHat className="h-16 w-16 text-navy-100" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-navy-100">Recinote</h1>
        <p className="text-center text-sm text-navy-300">
          레시피를 기억하고, 나만의 요리 노트를 만들어요.
        </p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center bg-navy-800 px-6 py-12 md:px-16">
        <div className="mb-8 flex flex-col items-center gap-2 md:hidden">
          <ChefHat className="h-10 w-10 text-navy-100" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-navy-100">Recinote</h1>
        </div>

        <SignupForm />

        <p className="mt-10 text-xs text-navy-400">© 2024 Recinote. All rights reserved.</p>
      </main>
    </div>
  );
}
