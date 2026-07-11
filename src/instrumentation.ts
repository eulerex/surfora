export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // Oracle Cloud's IPv6 outbound is broken. undici (Node's fetch) does
  // happy-eyeballs and hits IPv6 first, timing out. Force every dispatched
  // request to only connect over IPv4.
  const {setGlobalDispatcher, Agent} = await import('undici');
  setGlobalDispatcher(new Agent({connect: {family: 4}}));

  console.log('[instrumentation] undici global dispatcher forced to family:4');
}
