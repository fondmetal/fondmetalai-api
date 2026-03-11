import test from "node:test";
import assert from "node:assert/strict";
import {
  parseDiameter,
  parseYear,
  wheelNamesEqual,
} from "../src/utils/strings.js";

test("parseYear extracts valid years", () => {
  assert.equal(parseYear("Audi A3 2022"), 2022);
  assert.equal(parseYear("anno 1899"), null);
});

test("parseDiameter extracts wheel diameter", () => {
  assert.equal(parseDiameter('STC-10 19"'), 19);
  assert.equal(parseDiameter("misura 8"), null);
});

test("wheelNamesEqual compares normalized names", () => {
  assert.equal(wheelNamesEqual("STC-10", "stc-10"), true);
  assert.equal(wheelNamesEqual("STC-10", "9RR"), false);
});
