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
  // The removed backend modal client used to provide showInvoice.  Falling
  // back to the hosted checkout keeps invoice creation functional without
  // duplicating the backend's payment UI in this compatibility script.
  window.bitcart.showInvoice ||= (invoiceId) => {
    const id = encodeURIComponent(invoiceId);
    window.location.assign(`${base}/api/i/${id}`);
  };
})();
