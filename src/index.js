const FEATURE_RESIZE_OBSERVER = 1
const FEATURE_CLOSEST_SELECTOR = 2
const FEATURE_OBJECT_FIT = 4

const targetNode = document.body
const config = { attributes: false, childList: true, subtree: true }

const callback = (mutationList) => {
  for (const mutation of mutationList) {
    for (const node of mutation.addedNodes) {
      if (
        node.nodeName === 'IMG' &&
        node.loading === 'lazy' &&
        node.srcset &&
        (!node.sizes || node.dataset.autoSizes !== undefined)
      ) {
        if (FEATURES & FEATURE_CLOSEST_SELECTOR) {
          observeNode(node, node.dataset.autoSizes)
        } else {
          observeNode(node)
        }
      }
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback)

// Start observing the target node for configured mutations
observer.observe(targetNode, config)

let resizeObserver

function observeNode (node, closestSelector) {
  let nodeToObserve = node
  if ((FEATURES & FEATURE_CLOSEST_SELECTOR) && closestSelector) {
    if (closestSelector === 'parent') {
      nodeToObserve = node.parentNode
    } else {
      nodeToObserve = node.closest(closestSelector)
    }
    FEATURES & FEATURE_RESIZE_OBSERVER &&
      FEATURES & FEATURE_CLOSEST_SELECTOR &&
      storeReference(nodeToObserve, node)
  }
  if (FEATURES & FEATURE_RESIZE_OBSERVER) {
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { target } = entry
          const imageNodes = getImageNodes(target)
          for (const imageNode of imageNodes) {
            setSizesAttribute(imageNode, target)
          }
        }
      })
    }
    resizeObserver.observe(nodeToObserve)
  }
  setSizesAttribute(node, nodeToObserve)
}
let references
function storeReference (observedNode, imageNode) {
  if (!references) {
    references = new WeakMap()
  }
  const imageNodes = references.get(observedNode) || []
  imageNodes.push(imageNode)
  references.set(observedNode, imageNodes)
}
function getImageNodes (target) {
  return references?.get(target) || [target]
}
function setSizesAttribute (image, observedNode) {
  let width
  if (FEATURES & FEATURE_OBJECT_FIT) {
    const css = getComputedStyle(image)
    if (css.objectFit === 'cover' || css.objectFit === 'contain') {
      const { offsetWidth, offsetHeight } = observedNode
      const imgWidth = +image.getAttribute('width')
      const imgHeight = +image.getAttribute('height')

      const imgAspect = imgWidth / imgHeight
      const offsetAspect = offsetWidth / offsetHeight

      if (css.objectFit === 'cover' && imgAspect > offsetAspect) {
        width = Math.round(offsetHeight * imgAspect)
      } else if (css.objectFit === 'contain' && imgAspect < offsetAspect) {
        width = Math.round(offsetHeight * imgAspect)
      } else {
        width = offsetWidth
      }
    }
  }
  width = width || image.offsetWidth
  image.setAttribute('sizes', `${width}px`)
}
