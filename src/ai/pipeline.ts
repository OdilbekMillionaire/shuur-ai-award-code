import { assembleContext } from "./context.js";
import { generatedBatchSchema, type GeneratedBatch } from "./schemas.js";

export interface ModelClient {
  generateStructured(input: {
    context: string;
    instruction: string;
    validationFeedback?: string;
  }): Promise<unknown>;
}

export interface GenerationRequest {
  materials: readonly string[];
  instruction: string;
}

function validationMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "issues" in error) {
    return JSON.stringify((error as { issues: unknown }).issues);
  }
  return String(error);
}

export async function generateValidatedBatch(
  client: ModelClient,
  request: GenerationRequest,
): Promise<GeneratedBatch> {
  const context = assembleContext(request.materials);
  let feedback: string | undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await client.generateStructured({
      context,
      instruction: request.instruction,
      validationFeedback: feedback,
    });

    const parsed = generatedBatchSchema.safeParse(raw);
    if (parsed.success) return parsed.data;

    feedback = validationMessage(parsed.error);
  }

  throw new Error("model_output_failed_validation_after_retry");
}
