import * as lib from 'https://esm.sh/@imgly/background-removal@1.7.0';

function makeCfg(d) {
  return {
    publicPath: d.publicPath,
    model: d.model,
    progress: (key, current, total) => self.postMessage({ type: 'progress', key, current, total })
  };
}

self.onmessage = async (e) => {
  const d = e.data;
  try {
    if (d.type === 'preload') {
      if (typeof lib.preload === 'function') await lib.preload(makeCfg(d));
      self.postMessage({ type: 'preloaded' });
    } else if (d.type === 'remove') {
      const out = await lib.removeBackground(d.blob, makeCfg(d));
      self.postMessage({ type: 'done', blob: out });
    }
  } catch (err) {
    self.postMessage({ type: 'error', message: String((err && err.message) || err) });
  }
};
