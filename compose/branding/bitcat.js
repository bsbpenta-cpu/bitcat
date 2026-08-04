(() => {
  const base = document.currentScript.src.replace(/\/branding\/bitcat\.js(?:\?.*)?$/, "");
  const logo = `${base}/branding/bitcat-logo.svg`;
  const rename = (root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!/^(SCRIPT|STYLE)$/.test(node.parentElement?.tagName || "")) {
        node.nodeValue = node.nodeValue.replace(/Bitcart/g, "BitCat");
      }
    }
    root.querySelectorAll?.('img[alt*="Bitcart" i], img[src*="logo" i]').forEach((image) => {
      image.src = logo;
      image.alt = "BitCat";
    });
  };
  document.title = document.title.replace(/Bitcart/g, "BitCat");
  let icon = document.querySelector('link[rel~="icon"]');
  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.append(icon);
  }
  icon.href = logo;
  rename(document.body);
  new MutationObserver((records) => records.forEach((record) => rename(record.target)))
    .observe(document.body, { childList: true, subtree: true });
})();
