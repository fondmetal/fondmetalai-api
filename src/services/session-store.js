import crypto from "crypto";

export class SessionStore {
  constructor({ ttlMs, maxEntries, historyMaxItems }) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.historyMaxItems = historyMaxItems;
    this.sessions = new Map();
  }

  createSession() {
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, this.buildSession());
    this.prune();
    return sessionId;
  }

  get(sessionId) {
    if (!sessionId) {
      return null;
    }

    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    session.expiresAt = Date.now() + this.ttlMs;
    return session;
  }

  ensure(sessionId) {
    const existing = this.get(sessionId);
    if (existing) {
      return { sessionId, session: existing, isNew: false };
    }

    const nextSessionId = sessionId || this.createSession();
    if (!this.sessions.has(nextSessionId)) {
      this.sessions.set(nextSessionId, this.buildSession());
    }

    return {
      sessionId: nextSessionId,
      session: this.sessions.get(nextSessionId),
      isNew: true,
    };
  }

  updateContext(sessionId, context) {
    const record = this.ensure(sessionId);
    record.session.context = context;
    record.session.expiresAt = Date.now() + this.ttlMs;
    return record;
  }

  appendHistory(sessionId, item) {
    const record = this.ensure(sessionId);
    record.session.history = [...record.session.history, item].slice(
      -this.historyMaxItems
    );
    record.session.expiresAt = Date.now() + this.ttlMs;
    return record;
  }

  buildSession() {
    return {
      context: {},
      history: [],
      expiresAt: Date.now() + this.ttlMs,
    };
  }

  prune() {
    const now = Date.now();

    for (const [key, value] of this.sessions.entries()) {
      if (value.expiresAt <= now) {
        this.sessions.delete(key);
      }
    }

    while (this.sessions.size > this.maxEntries) {
      const oldestKey = this.sessions.keys().next().value;
      this.sessions.delete(oldestKey);
    }
  }
}
