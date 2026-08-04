(() => {
  const script = document.currentScript;
  const base = script.src.replace(/\/branding\/bitcat\.js(?:\?.*)?$/, "");
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

  // Both upstream UIs render their navigation after the initial HTML has
  // loaded, and some releases use inline SVGs rather than an <img> logo.  A
  // dedicated mark therefore makes the graphical branding independent of
  // the particular store/admin release while the replacements below still
  // update recognizable upstream logos and labels.
  const brand = document.createElement("a");
  brand.id = "bitcat-brand";
  brand.href = `${base}/`;
  brand.setAttribute("aria-label", "BitCat");
  brand.innerHTML = `<img src="${logo}" alt="BitCat">`;
  const style = document.createElement("style");
  style.textContent = `
    #bitcat-brand {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      display: flex;
      width: 156px;
      height: 52px;
      padding: 6px 10px;
      box-sizing: border-box;
      border: 1px solid rgba(16, 35, 61, .18);
      border-radius: 12px;
      background: rgba(255, 255, 255, .96);
      box-shadow: 0 6px 24px rgba(7, 20, 38, .2);
    }
    #bitcat-brand img { width: 100%; height: 100%; object-fit: contain; }
    @media (max-width: 480px) {
      #bitcat-brand { right: 8px; bottom: 8px; width: 124px; height: 44px; }
    }
  `;
  document.head.append(style);
  document.body.append(brand);
  rename(document.body);
  new MutationObserver((records) => records.forEach((record) => rename(record.target)))
    .observe(document.body, { childList: true, subtree: true });
})();
