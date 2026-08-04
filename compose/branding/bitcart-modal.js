(() => {
  const script = document.currentScript;
  const base = script.src.replace(/\/branding\/bitcart-modal\.js(?:\?.*)?$/, "");
  const current = window.bitcart;
  let modal;
  let frame;

  const closeModal = () => {
    if (modal) {
      modal.hidden = true;
    }
    if (frame) {
      frame.removeAttribute("src");
    }
    document.documentElement.style.removeProperty("overflow");
  };

  const ensureModal = () => {
    if (modal) {
      return modal;
    }
    modal = document.createElement("div");
    modal.id = "bitcart-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483647",
      "background:rgba(0,0,0,.55)",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "padding:16px",
    ].join(";");

    const panel = document.createElement("div");
    panel.style.cssText = [
      "position:relative",
      "width:min(100%,520px)",
      "height:min(100%,760px)",
      "background:#fff",
      "border-radius:12px",
      "box-shadow:0 24px 80px rgba(0,0,0,.35)",
      "overflow:hidden",
    ].join(";");

    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Close payment modal");
    close.textContent = "×";
    close.style.cssText = [
      "position:absolute",
      "top:8px",
      "right:12px",
      "z-index:1",
      "border:0",
      "background:rgba(0,0,0,.6)",
      "color:#fff",
      "border-radius:999px",
      "width:32px",
      "height:32px",
      "font:24px/30px sans-serif",
      "cursor:pointer",
    ].join(";");
    close.addEventListener("click", closeModal);

    frame = document.createElement("iframe");
    frame.title = "Bitcart invoice checkout";
    frame.allow = "clipboard-read; clipboard-write; payment";
    frame.style.cssText = "width:100%;height:100%;border:0;display:block";

    panel.append(close, frame);
    modal.append(panel);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
    document.body.append(modal);
    return modal;
  };

  // Some store releases register this callback even when the backend does not
  // ship the optional modal client.  Keep a stable listener which delegates to
  // a real client if one is installed later and closes the fallback modal when
  // the checkout frame asks to be closed.
  const forwardMessage = (event) => {
    const handler = window.bitcart?.onModalReceiveMessage;
    if (handler && handler !== forwardMessage) {
      return handler.call(window.bitcart, event);
    }
    const message = event.data;
    const action = typeof message === "string" ? message : message?.action || message?.type;
    if (["close", "closeModal", "invoice_paid", "payment_complete"].includes(action)) {
      closeModal();
    }
  };

  const showInvoice = async (invoiceId) => {
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
    ensureModal();
    frame.src = new URL(checkoutUrl, `${base}/`).href;
    modal.hidden = false;
    document.documentElement.style.overflow = "hidden";
  };

  window.bitcart = current || {};
  window.bitcart.onModalReceiveMessage ||= forwardMessage;
  window.bitcart.showInvoice = showInvoice;
})();
