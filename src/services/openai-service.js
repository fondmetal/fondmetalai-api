import OpenAI from "openai";
import { config, isOpenAiEnabled } from "../config.js";

let client = null;

export function getOpenAiClient() {
  if (!isOpenAiEnabled()) {
    return null;
  }

  if (!client) {
    client = new OpenAI({
      apiKey: config.openai.apiKey,
      timeout: config.openai.timeoutMs,
    });
  }

  return client;
}
