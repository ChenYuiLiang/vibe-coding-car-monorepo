if (typeof globalThis.TextEncoder === 'undefined') {
  // @ts-ignore
  const { TextEncoder } = require('util');
  Object.assign(globalThis, { TextEncoder });
}
