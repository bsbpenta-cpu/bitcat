(() => {
  const script = document.currentScript;
  const base = script.src.replace(/\/branding\/bitcart-modal\.js(?:\?.*)?$/, "");
  const current = window.bitcart;

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
  window.bitcart.onModalReceiveMessage ||= forwardMessage;
  // The checkout UI belongs to the store in current releases.  Do not append
  // /api here: that prefix targets the backend, where /i/<id> does not exist.
  window.bitcart.showInvoice ||= (invoiceId) => {
    const id = encodeURIComponent(invoiceId);
    window.location.assign(`${base}/i/${id}`);
  };
})();
