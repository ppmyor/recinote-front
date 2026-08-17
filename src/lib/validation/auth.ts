import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "이메일을 입력해주세요.")
  .pipe(z.email("올바른 이메일 형식이 아닙니다."));
