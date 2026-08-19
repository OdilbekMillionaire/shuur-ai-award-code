import { z } from "zod";

const text = z.string().trim().min(1).max(2000);

export const mcqSchema = z.object({
  type: z.literal("mcq"),
  question: text,
  options: z.tuple([text, text, text, text]),
  correctIndex: z.number().int().min(0).max(3),
  explanation: text,
});

export const trueFalseSchema = z.object({
  type: z.literal("tf"),
  statement: text,
  answer: z.boolean(),
  explanation: text,
});

export const generatedItemSchema = z.discriminatedUnion("type", [mcqSchema, trueFalseSchema]);

export const generatedBatchSchema = z.object({
  items: z.array(generatedItemSchema).min(1).max(60),
});

export type GeneratedBatch = z.infer<typeof generatedBatchSchema>;

export function validateGeneratedBatch(input: unknown) {
  return generatedBatchSchema.safeParse(input);
}
