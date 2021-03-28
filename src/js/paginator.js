import $ from 'jquery';
import './simplePagination';
import {
  getDisplayedPages,
  getPaginatorEdges,
  getPaginatorPlaceholder,
} from './variables';

export function addPaginator({ elementRef, totalResults, perPage, loadPage }) {
  if (!elementRef) {
    elementRef = getPaginatorPlaceholder();
  }

  $(elementRef).pagination('destroy');

  $(elementRef).pagination({
    items: totalResults,
    itemsOnPage: perPage,
    cssStyle: 'light-theme',
    prevText: '_',
    nextText: '_',
    displayedPages: getDisplayedPages(),
    edges: getPaginatorEdges(),
    onPageClick: function (page, event) {
      loadPage(page);
    },
  });
}
