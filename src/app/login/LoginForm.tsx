"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert } from "@/components/common/Alert";
import { Button, buttonClassName } from "@/components/common/Button";
import { Checkbox } from "@/components/common/Checkbox";
import { Input } from "@/components/common/Input";
import { InputGroup } from "@/components/common/InputGroup";
import { ApiError, getApiErrorMessage, login } from "@/lib/api";
import { emailSchema } from "@/lib/validation";

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  signupSuccess?: boolean;
}

export function LoginForm({ signupSuccess = false }: LoginFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors("root");
    try {
      await login(values);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("root", { message: "이메일 또는 비밀번호가 올바르지 않습니다." });
        return;
      }
      setError("root", {
        message: getApiErrorMessage(err, "로그인 중 오류가 발생했습니다."),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex w-full max-w-sm flex-col gap-4"
    >
      {signupSuccess && (
        <Alert variant="success">회원가입이 완료되었습니다. 로그인해주세요.</Alert>
      )}

      {errors.root?.message && <Alert>{errors.root.message}</Alert>}

      <InputGroup htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          icon={Mail}
          placeholder="이메일을 입력하세요"
          error={!!errors.email}
          {...register("email")}
        />
      </InputGroup>

      <InputGroup htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          icon={Lock}
          placeholder="비밀번호를 입력하세요"
          error={!!errors.password}
          {...register("password")}
        />
      </InputGroup>

      <div className="flex items-center justify-between">
        <Checkbox id="rememberMe" label="로그인 상태 유지" />
        <span className="text-xs text-navy-300">비밀번호 찾기</span>
      </div>

      <Button type="submit" fullWidth loading={isSubmitting}>
        로그인
      </Button>

      <p className="text-center text-xs text-navy-400">또는</p>

      <Link href="/signup" className={buttonClassName({ variant: "outline", fullWidth: true })}>
        회원가입
      </Link>
    </form>
  );
}
