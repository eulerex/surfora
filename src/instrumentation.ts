export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // Oracle Cloud's IPv6 outbound is broken. undici (Node's fetch) does
  // happy-eyeballs and hits IPv6 first, timing out. Force every dispatched
  // request to only connect over IPv4.
  //
  // undici@6 types demand a full TcpNetConnectOpts (with `port`) here even
  // though the runtime is happy to merge {family: 4} into the per-request
  // options. Cast to bypass.
  const {setGlobalDispatcher, Agent} = await import('undici');
  setGlobalDispatcher(
    new Agent({connect: {family: 4} as unknown as never})
  );

  console.log('[instrumentation] undici global dispatcher forced to family:4');
}
