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
  // The invoice API response does not include a checkout URL.  Validate the
  // invoice through the API, then open the documented admin checkout route
  // using the canonical invoice id returned by the API.
  window.bitcart.showInvoice ||= async (invoiceId) => {
    const id = encodeURIComponent(invoiceId);
    const response = await fetch(`${base}/api/invoices/${id}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Unable to load invoice ${invoiceId}: HTTP ${response.status}`);
    }
    const invoice = await response.json();
    if (!invoice.id) {
      throw new Error(`Invoice ${invoiceId} response does not contain an id`);
    }
    window.location.assign(`${base}/admin/i/${encodeURIComponent(invoice.id)}`);
  };
})();
