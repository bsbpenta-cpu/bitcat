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
  // Checkout paths differ between backend/store releases. Resolve the URL from
  // the invoice resource instead of guessing an /i/<id> route.
  window.bitcart.showInvoice ||= async (invoiceId) => {
    const id = encodeURIComponent(invoiceId);
    const response = await fetch(`${base}/api/invoices/${id}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Unable to load invoice ${invoiceId}: HTTP ${response.status}`);
    }
    const invoice = await response.json();
    const checkoutUrl = invoice.checkout_url || invoice.payment_url || invoice.url;
    if (!checkoutUrl) {
      throw new Error(`Invoice ${invoiceId} does not contain a checkout URL`);
    }
    window.location.assign(new URL(checkoutUrl, `${base}/`).href);
  };
})();
