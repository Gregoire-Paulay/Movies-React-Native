import { z } from "zod";

export const ReviewSchema = z.object({
  title: z.string(),
  opinion: z.string(),
  feeling: z.union([z.literal("Good"), z.literal("Neutral"), z.literal("Bad")]),
  movieId: z.number(),
});

export const GetReviewSchema = z.array(
  z.object({
    feeling: z.union([
      z.literal("Good"),
      z.literal("Neutral"),
      z.literal("Bad"),
    ]),
    title: z.string(),
    opinion: z.string(),
    _id: z.string(),
    date: z.string(),
    movieId: z.number(),
    user: z.object({
      _id: z.string(),
      account: z.object({ username: z.string() }),
    }),
  })
);
