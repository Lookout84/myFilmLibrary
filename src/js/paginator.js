import $ from 'jquery';
import './simplePagination';
import { getDisplayedPages, getPaginatorEdges } from './variables';

export function addPaginator({ elementRef, totalResults, perPage, loadPage }) {
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
