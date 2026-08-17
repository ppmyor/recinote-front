import { ChefHat } from "lucide-react";

import { LoginForm } from "./LoginForm";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { signup } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <ChefHat className="h-16 w-16 text-navy-100" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-navy-100">Recinote</h1>
        <p className="text-center text-sm text-navy-300">
          레시피를 기억하고, 나만의 요리 노트를 만들어요.
        </p>
      </div>

      <LoginForm signupSuccess={signup === "success"} />

      <p className="mt-10 text-xs text-navy-400">© 2024 Recinote. All rights reserved.</p>
    </div>
  );
}
