(() => {
  // src/index.js
  var FEATURE_RESIZE_OBSERVER = 1;
  var FEATURE_CLOSEST_SELECTOR = 2;
  var FEATURE_OBJECT_FIT = 4;
  var targetNode = document.body;
  var config = { attributes: false, childList: true, subtree: true };
  var callback = (mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (node.nodeName === "IMG" && node.loading === "lazy" && node.srcset && (!node.sizes || node.dataset.autoSizes !== void 0)) {
          if (1 & FEATURE_CLOSEST_SELECTOR) {
            observeNode(node, node.dataset.autoSizes);
          } else {
            observeNode(node);
          }
        }
      }
    }
  };
  var observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  var resizeObserver;
  function observeNode(node, closestSelector) {
    let nodeToObserve = node;
    if (1 & FEATURE_CLOSEST_SELECTOR && closestSelector) {
      if (closestSelector === "parent") {
        nodeToObserve = node.parentNode;
      } else {
        nodeToObserve = node.closest(closestSelector);
      }
      1 & FEATURE_RESIZE_OBSERVER && 1 & FEATURE_CLOSEST_SELECTOR && storeReference(nodeToObserve, node);
    }
    if (1 & FEATURE_RESIZE_OBSERVER) {
      if (!resizeObserver) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { target } = entry;
            const imageNodes = getImageNodes(target);
            for (const imageNode of imageNodes) {
              setSizesAttribute(imageNode, target);
            }
          }
        });
      }
      resizeObserver.observe(nodeToObserve);
    }
    setSizesAttribute(node, nodeToObserve);
  }
  var references;
  function storeReference(observedNode, imageNode) {
    if (!references) {
      references = /* @__PURE__ */ new WeakMap();
    }
    const imageNodes = references.get(observedNode) || [];
    imageNodes.push(imageNode);
    references.set(observedNode, imageNodes);
  }
  function getImageNodes(target) {
    return (references == null ? void 0 : references.get(target)) || [target];
  }
  function setSizesAttribute(image, observedNode) {
    let width;
    if (1 & FEATURE_OBJECT_FIT) {
      const css = getComputedStyle(image);
      if (css.objectFit === "cover" || css.objectFit === "contain") {
        const { offsetWidth, offsetHeight } = observedNode;
        const imgWidth = +image.getAttribute("width");
        const imgHeight = +image.getAttribute("height");
        const imgAspect = imgWidth / imgHeight;
        const offsetAspect = offsetWidth / offsetHeight;
        if (css.objectFit === "cover" && imgAspect > offsetAspect) {
          width = Math.round(offsetHeight * imgAspect);
        } else if (css.objectFit === "contain" && imgAspect < offsetAspect) {
          width = Math.round(offsetHeight * imgAspect);
        } else {
          width = offsetWidth;
        }
      }
    }
    width = width || image.offsetWidth;
    image.setAttribute("sizes", `${width}px`);
  }
})();
