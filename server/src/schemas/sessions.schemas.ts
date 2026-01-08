import { z } from "zod";

export const createSessionSchema = z.object({
  gameId: z.string().min(1),
  result: z.enum(["WIN", "TIE", "LOSS"]),
  playedAt: z
    .string()
    .optional()
    .refine(
        (val) => val === undefined || !Number.isNaN(Date.parse(val)),
        { message: "Invalid datetime format" }
    )
});
