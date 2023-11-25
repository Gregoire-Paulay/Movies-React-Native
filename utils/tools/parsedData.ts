import { ZodError, z } from "zod";

export function ParsedData<T>(
  data: T,
  ZodSchema: any,
  zodError: z.ZodError<any> | null,
  setZodError: React.Dispatch<React.SetStateAction<z.ZodError<any> | null>>
) {
  try {
    return ZodSchema.parse(data);
  } catch (error: any) {
    setZodError && setZodError(error);
  }
}
