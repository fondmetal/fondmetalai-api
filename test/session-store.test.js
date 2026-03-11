import test from "node:test";
import assert from "node:assert/strict";
import { SessionStore } from "../src/services/session-store.js";

test("SessionStore creates and updates sessions", () => {
  const store = new SessionStore({
    ttlMs: 1000,
    maxEntries: 10,
    historyMaxItems: 3,
  });

  const { sessionId, session } = store.ensure(null);
  assert.ok(sessionId);
  assert.deepEqual(session.context, {});

  store.updateContext(sessionId, { brand: "Audi" });
  store.appendHistory(sessionId, { user: "A3" });
  store.appendHistory(sessionId, { user: "2022" });
  store.appendHistory(sessionId, { user: "18" });
  store.appendHistory(sessionId, { user: "STC-10" });

  const saved = store.get(sessionId);
  assert.equal(saved.context.brand, "Audi");
  assert.equal(saved.history.length, 3);
});
