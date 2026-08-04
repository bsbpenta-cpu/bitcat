(() => {
  const current = window.bitcart;
  if (current?.onModalReceiveMessage) return;

  // Some store releases register this callback even when the backend does not
  // ship the optional modal client.  Keep a stable listener which delegates to
  // a real client if one is installed later.
  const forwardMessage = (event) => {
    const handler = window.bitcart?.onModalReceiveMessage;
    if (handler && handler !== forwardMessage) {
      return handler.call(window.bitcart, event);
    }
  };

  window.bitcart = current || {};
  window.bitcart.onModalReceiveMessage = forwardMessage;
})();
