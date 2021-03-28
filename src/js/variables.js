export const screenSize = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
};

export function getPerPage() {
  const { innerWidth } = window;
  if (innerWidth > screenSize.desktop) {
    return 9;
  }
  if (innerWidth > screenSize.tablet) {
    return 8;
  }
  return 4;
}

export function getPaginatorEdges() {
  const { innerWidth } = window;
  if (innerWidth > screenSize.desktop) {
    return 1;
  }
  if (innerWidth > screenSize.tablet) {
    return 1;
  }
  return 0;
}

export function getDisplayedPages() {
  const { innerWidth } = window;
  if (innerWidth > screenSize.desktop) {
    return 5;
  }
  if (innerWidth > screenSize.tablet) {
    return 5;
  }
  return 3;
}

export function getPaginatorPlaceholder() {
  const ref = document.querySelector('#paginator-placeholder');
  if (!ref) {
    console.warn('Paginator placeholder is not found');
  }
  return ref;
}
