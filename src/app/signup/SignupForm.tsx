"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { InputGroup } from "@/components/common/InputGroup";
import { ApiError, checkPasswordMatch, getApiErrorMessage, signup } from "@/lib/api";
import { emailSchema } from "@/lib/validation";

const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요."),
    email: emailSchema,
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

type MatchState = "idle" | "checking" | "matched" | "mismatched";

export function SignupForm() {
  const router = useRouter();
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
        message: getApiErrorMessage(err, "확인 중 오류가 발생했습니다."),
      });
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    clearErrors("root");
    try {
      await signup(values);
      router.push("/login?signup=success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError("email", { message: "이미 사용 중인 이메일입니다." });
        return;
      }
      setError("root", {
        message: getApiErrorMessage(err, "회원가입 중 오류가 발생했습니다."),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-sm flex-col gap-5 md:max-w-md"
    >
      <div className="mb-2 flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-navy-100">회원가입</h2>
        <p className="text-sm text-navy-300">나만의 요리 노트를 시작해보세요.</p>
      </div>

      {errors.root?.message && <Alert>{errors.root.message}</Alert>}

      <InputGroup label="이름" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          icon={User}
          placeholder="이름을 입력하세요"
          error={!!errors.name}
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
            disabled={isMatched}
            {...register("passwordConfirm")}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!canCheckMatch || matchState === "checking" || isMatched}
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
        disabled={!isMatched}
        className="mt-2"
      >
        가입하기
      </Button>
    </form>
  );
}
