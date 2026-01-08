import { z } from "zod";

export const updateMeSchema = z.object({
  username: z.string().min(1).max(50).optional(),
  funFact: z.string().min(1).max(500).optional()
});
