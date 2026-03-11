import test from "node:test";
import assert from "node:assert/strict";
import { extractHomologations, formatFitmentRows } from "../src/services/fitment.js";

test("extractHomologations collects only non-empty values", () => {
  const items = extractHomologations({
    homologation_tuv: "123",
    homologation_kba: "",
    homologation_ece: "ECE-1",
    homologation_jwl: null,
    homologation_ita: "ITA-9",
  });

  assert.deepEqual(items, [
    { type: "TUV", code: "123" },
    { type: "ECE", code: "ECE-1" },
    { type: "NAD/ITA", code: "ITA-9" },
  ]);
});

test("formatFitmentRows normalizes exact fitment rows", () => {
  const items = formatFitmentRows([
    {
      diameter: 19,
      width: "8.50",
      et: "45.00",
      pcd_label: "5x112",
      plug_play: 1,
      fitment_type: "PP",
      fitment_advice: "OK",
      limitation_IT: "",
      homologation_tuv: "TUV-1",
      homologation_kba: "",
      homologation_ece: "",
      homologation_jwl: "",
      homologation_ita: "",
    },
  ]);

  assert.equal(items.length, 1);
  assert.equal(items[0].plugPlay, true);
  assert.equal(items[0].homologations.length, 1);
});
