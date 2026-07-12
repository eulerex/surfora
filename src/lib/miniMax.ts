const DEFAULT_BASE = 'https://api.minimaxi.com';
const DEFAULT_MODEL = 'MiniMax-M3';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {content?: string | null};
  }>;
};

export type ChatOptions = {
  system?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
};

/**
 * MiniMax-M3 responses can include <think>...</think> reasoning blocks
 * before the actual answer. Strip them out.
 */
function stripThinking(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
}

export async function chat(opts: ChatOptions): Promise<string | null> {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) {
    console.error('[miniMax] MINIMAX_API_KEY not set');
    return null;
  }

  const base = process.env.MINIMAX_BASE_URL ?? DEFAULT_BASE;
  const model = process.env.MINIMAX_MODEL ?? DEFAULT_MODEL;

  const messages: ChatMessage[] = opts.system
    ? [{role: 'system', content: opts.system}, ...opts.messages]
    : opts.messages;

  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: opts.maxTokens ?? 200,
        temperature: opts.temperature ?? 0.7
      })
    });

    if (!res.ok) {
      const bodyPreview = (await res.text()).slice(0, 200);
      console.error(
        `[miniMax] non-ok status=${res.status} body=${bodyPreview}`
      );
      return null;
    }

    const data: ChatCompletionResponse = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      console.error('[miniMax] empty message content');
      return null;
    }
    return stripThinking(raw);
  } catch (e) {
    console.error(
      '[miniMax] fetch failed:',
      e instanceof Error ? e.message : e
    );
    return null;
  }
}
