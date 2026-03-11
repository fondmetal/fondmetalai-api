import { RateLimitError } from "../utils/errors.js";

export class MemoryRateLimiter {
  constructor({ windowMs, maxRequests }) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.buckets = new Map();
  }

  consume(key) {
    const now = Date.now();
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      this.prune(now);
      return;
    }

    if (bucket.count >= this.maxRequests) {
      throw new RateLimitError();
    }

    bucket.count += 1;
  }

  prune(now = Date.now()) {
    for (const [key, value] of this.buckets.entries()) {
      if (value.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}
