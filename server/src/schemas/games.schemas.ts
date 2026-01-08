import { z } from "zod";

export const createGameSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["BRADSPEL", "KORTSPEL", "ANNAT"])
});
