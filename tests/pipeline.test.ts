import { describe, expect, it } from "vitest";
import { generateValidatedBatch, type ModelClient } from "../src/ai/pipeline.js";

const validBatch = {
  items: [
    {
      type: "mcq" as const,
      question: "Which statement is supported by the material?",
      options: ["A", "B", "C", "D"],
      correctIndex: 1,
      explanation: "The material supports option B.",
    },
  ],
};

describe("generateValidatedBatch", () => {
  it("accepts valid structured model output", async () => {
    const client: ModelClient = {
      async generateStructured() {
        return validBatch;
      },
    };

    const result = await generateValidatedBatch(client, {
      materials: ["Example learning material"],
      instruction: "Generate one question",
    });

    expect(result.items).toHaveLength(1);
  });

  it("retries once after invalid model output", async () => {
    let calls = 0;
    const client: ModelClient = {
      async generateStructured(input) {
        calls += 1;
        if (calls === 1) {
          expect(input.validationFeedback).toBeUndefined();
          return { items: [{ type: "mcq", question: "broken" }] };
        }
        expect(input.validationFeedback).toBeTruthy();
        return validBatch;
      },
    };

    const result = await generateValidatedBatch(client, {
      materials: ["Example learning material"],
      instruction: "Generate one question",
    });

    expect(calls).toBe(2);
    expect(result.items[0].type).toBe("mcq");
  });

  it("fails closed after two invalid outputs", async () => {
    const client: ModelClient = {
      async generateStructured() {
        return { items: [] };
      },
    };

    await expect(
      generateValidatedBatch(client, {
        materials: ["Example learning material"],
        instruction: "Generate one question",
      }),
    ).rejects.toThrow("model_output_failed_validation_after_retry");
  });
});
