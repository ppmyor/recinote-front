"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChefHat, Lock, Mail, User } from "lucide-react";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { InputGroup } from "@/components/common/InputGroup";
import { ApiError, checkPasswordMatch, signup } from "@/lib/api";

const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요."),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .pipe(z.email("올바른 이메일 형식이 아닙니다.")),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

type MatchState = "idle" | "checking" | "matched" | "mismatched";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const [matchState, setMatchState] = React.useState<MatchState>("idle");
  const [signupError, setSignupError] = React.useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = React.useState(false);

  const [confirmedPassword, setConfirmedPassword] = React.useState<string | null>(null);

  const [passwordValue, passwordConfirmValue] = useWatch({
    control,
    name: ["password", "passwordConfirm"],
  });
  const canCheckMatch =
    (passwordValue?.length ?? 0) >= 8 && (passwordConfirmValue?.length ?? 0) > 0;
  // 비밀번호를 확인 시점 이후에 바꾸면 잠금을 다시 해제한다 (effect 없이 렌더 중 파생).
  const isMatched = matchState === "matched" && confirmedPassword === passwordValue;

  const handleCheckPasswordMatch = async () => {
    const { password, passwordConfirm } = getValues();
    setMatchState("checking");
    try {
      const { match } = await checkPasswordMatch({ password, passwordConfirm });
      if (match) {
        setConfirmedPassword(password);
        setMatchState("matched");
        clearErrors("passwordConfirm");
      } else {
        setMatchState("mismatched");
        setError("passwordConfirm", { message: "비밀번호가 일치하지 않습니다." });
      }
    } catch (err) {
      setMatchState("idle");
      setError("passwordConfirm", {
        message: err instanceof ApiError ? err.message : "확인 중 오류가 발생했습니다.",
      });
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    setSignupError(null);
    try {
      await signup(values);
      setSignupSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("email", { message: "이미 사용 중인 이메일입니다." });
        return;
      }
      setSignupError(
        err instanceof ApiError ? err.message : "회원가입 중 오류가 발생했습니다.",
      );
    }
  };

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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-sm flex-col gap-5 md:max-w-md"
        >
          <div className="mb-2 flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-navy-100">회원가입</h2>
            <p className="text-sm text-navy-300">
              나만의 요리 노트를 시작해보세요.
            </p>
          </div>

          {signupSuccess && (
            <p className="rounded-lg border border-brand-blue-500 bg-navy-700 px-4 py-3 text-sm text-navy-100">
              회원가입이 완료되었습니다.
            </p>
          )}

          {signupError && (
            <p className="rounded-lg border border-error-500 bg-navy-700 px-4 py-3 text-sm text-error-400">
              {signupError}
            </p>
          )}

          <InputGroup label="이름" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              icon={User}
              placeholder="이름을 입력하세요"
              error={!!errors.name}
              disabled={signupSuccess}
              {...register("name")}
            />
          </InputGroup>

          <InputGroup label="이메일" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              icon={Mail}
              placeholder="이메일을 입력하세요"
              error={!!errors.email}
              disabled={signupSuccess}
              {...register("email")}
            />
          </InputGroup>

          <InputGroup label="비밀번호" htmlFor="password" error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              icon={Lock}
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              disabled={signupSuccess}
              {...register("password")}
            />
          </InputGroup>

          <InputGroup
            label="비밀번호 확인"
            htmlFor="passwordConfirm"
            error={errors.passwordConfirm?.message}
          >
            <div className="flex gap-2">
              <Input
                id="passwordConfirm"
                type="password"
                icon={Lock}
                placeholder="비밀번호를 다시 입력하세요"
                error={!!errors.passwordConfirm}
                className="flex-1"
                disabled={isMatched || signupSuccess}
                {...register("passwordConfirm")}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!canCheckMatch || matchState === "checking" || isMatched || signupSuccess}
                loading={matchState === "checking"}
                onClick={handleCheckPasswordMatch}
              >
                {isMatched ? "확인됨" : "확인"}
              </Button>
            </div>
          </InputGroup>

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={!isMatched || signupSuccess}
            className="mt-2"
          >
            가입하기
          </Button>
        </form>

        <p className="mt-10 text-xs text-navy-400">
          © 2024 Recinote. All rights reserved.
        </p>
      </main>
    </div>
  );
}
