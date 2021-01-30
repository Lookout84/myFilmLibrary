import css from "./css/styles.css";
//import PhotoApiService from "./js/apiService.js";
import asyncFetch from "./js/apiService.js";
import refs from "./js/refs.js";
//import debounce from "lodash.debounce";
import "@pnotify/core/dist/PNotify.css";
import { error } from "@pnotify/core";
import loadBigImg from "./js/lightbox.js";
import LoadMoreBtn from "./js/button.js";
import imageCard from "./templates/imagecard.hbs";

//const photoApiService = new PhotoApiService();

const { input, ulGallery, searchForm } = refs;
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

searchForm.addEventListener("submit", onSearch);
loadMoreBtn.refs.button.addEventListener("click", onLoadMore);
ulGallery.addEventListener("click", loadBigImg);

function onSearch(event) {
  event.preventDefault();
  clearGallery();
  asyncFetch.resetPage();
  asyncFetch.query = event.currentTarget.elements.query.value;

  if (asyncFetch.query === "") {
    loadMoreBtn.hide();
    error({
      text: "Please enter a more specific query!",
    });
  } else {
    loadMoreBtn.show();
    hitsFetch();
    input.value = "";
  }
}

function onLoadMore() {
  asyncFetch.setPage();
  hitsFetch();
}

function hitsFetch() {
  loadMoreBtn.disable();
  asyncFetch
    .getFetch()
    .then((data) => data.hits)
    .then((hits) => {
      let hitsLength = Object.keys(hits).length;
      appendHitsMarkup(hits);
      if (hitsLength >= 12) {
        loadMoreBtn.show();
        loadMoreBtn.enable();
      } else if (hitsLength < 12) {
        loadMoreBtn.hide();
      }
    });
}

function appendHitsMarkup(hits) {
  ulGallery.insertAdjacentHTML("beforeend", imageCard(hits));
  window.scrollTo({
    top: ulGallery.scrollHeight,
    behavior: "smooth",
  });
}

function clearGallery() {
  ulGallery.innerHTML = "";
}
