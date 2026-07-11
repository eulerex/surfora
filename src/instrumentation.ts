export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const dns = await import('node:dns');

  // dns.setDefaultResultOrder('ipv4first') isn't enough — undici still races
  // IPv6, and Oracle Cloud's IPv6 outbound is broken. Force family:4 on every
  // dns.lookup call so undici only ever sees IPv4 addresses.
  const originalLookup = dns.lookup;
  // @ts-expect-error - overloaded signature; we re-dispatch to the original
  dns.lookup = function patchedLookup(
    hostname: string,
    options: unknown,
    callback: unknown
  ) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    const merged =
      typeof options === 'number'
        ? {family: 4}
        : {...(options as Record<string, unknown>), family: 4};
    return originalLookup(hostname, merged as never, callback as never);
  };

  console.log('[instrumentation] dns.lookup forced to family:4');
}
