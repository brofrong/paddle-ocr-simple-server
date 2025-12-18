import z from "zod";

const envSchema = z.object({
  BEARER_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
