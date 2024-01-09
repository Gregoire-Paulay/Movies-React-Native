import { z } from "zod";

export const ReviewSchema = z.object({
  title: z.string(),
  opinion: z.string(),
  feeling: z.string(),
  movieId: z.number(),
});
