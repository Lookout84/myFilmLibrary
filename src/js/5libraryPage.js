'use strict';
import getRef from './refs';
import libraryPageHtml from '../html/main/myFilmLibraryPage.html';
import footer from '../html/footer.html';
import ApiService from './2searchAndPlaginationHomePage';
import renderLibFilms from '../templates/libraryFilms.hbs';
import openModal from './4filmDetailsPage';
import renderHomePage from './1initialHomePage';
import loader from './spinner';
import { addPaginator } from './paginator';
import { getPerPage } from './variables';
import { queue } from 'jquery';

const apiService = new ApiService();

export default function libraryPage() {
  localStorage.setItem('page', 'library');
  const refs = getRef();
  refs.bodyRef.innerHTML = '';
  refs.bodyRef.insertAdjacentHTML('beforeend', libraryPageHtml);
  refs.bodyRef.insertAdjacentHTML('beforeend', footer);

  // let mainRef = document.querySelectorAll('.section')[0];

  //функции обновления страницы watched queue не законченые

  const ulRef = document.querySelector('.films-list');
  const logolink = document.querySelector('.link');
  const homelink = document.querySelector('[data-link]');
  const watchedPageBtnRef = document.querySelector('.watchedPageBtn');
  const queuePageBtnRef = document.querySelector('.queuePageBtn');
  // ulRef.insertAdjacentHTML('beforeend', libFilms(watch));
  // toDrowWatched();
  if (localStorage.getItem('library') === 'queuePage') {
    toDrowQueue();
  } else {
    toDrowWatched();
  }
  homelink.addEventListener('click', renderHomePage);
  logolink.addEventListener('click', renderHomePage);

  //при нажатии на watched и queue перерисуем страницу
  watchedPageBtnRef.addEventListener('click', toDrowWatched);
  queuePageBtnRef.addEventListener('click', toDrowQueue);

  ulRef.addEventListener('click', event => {
    if (event.target.nodeName === 'IMG') {
      loader.spinner.show();

      const id = event.target.getAttribute('data-id');
      refs.bodyRef.insertAdjacentHTML(
        'beforeend',
        `<div class="backdrop is-hidden"></div>`,
      );
      openModal(id);
      loader.spinner.close();
    }
  });

  function toDrowWatched() {
    localStorage.setItem('library', 'watchedPage');

    loader.spinner.show();

    ulRef.innerHTML = '';
    queuePageBtnRef.classList.remove('current');
    watchedPageBtnRef.classList.add('current');

    const watchCount = getWatchedFilmsCount();
    if (watchCount === 0) {
      loader.spinner.close();
      ulRef.insertAdjacentHTML(
        'beforeend',
        `<li><div class="notification"><h2>You do not have to watched movies. Add them.</h2></div></li>`,
      );
    } else {
      loader.spinner.close();
      ulRef.insertAdjacentHTML('beforeend', renderLibFilms(getWatchedFilms(1)));
      addPaginator({
        totalResults: watchCount,
        perPage: getPerPage(),
        loadPage: function (page) {
          ulRef.innerHTML = '';
          ulRef.insertAdjacentHTML(
            'beforeend',
            renderLibFilms(getWatchedFilms(page)),
          );
        },
      });
    }
  }

  function getWatchedFilmsCount() {
    const films = JSON.parse(localStorage.getItem('watched'));
    if (films) {
      return films.length;
    }
    return 0;
  }

  function getWatchedFilms(page = 1) {
    let watched = JSON.parse(localStorage.getItem('watched'));
    const perPage = getPerPage();
    const left = (page - 1) * perPage;
    const right = page * perPage;
    return watched.slice(left, right);
  }

  function getFilmsQueueCount() {
    const films = JSON.parse(localStorage.getItem('queue'));
    if (films) {
      return films.length;
    }
    return 0;
  }

  function getFilmsQueue(page = 1) {
    let filmsQueue = JSON.parse(localStorage.getItem('queue'));
    const perPage = getPerPage();
    const left = (page - 1) * perPage;
    const right = page * perPage;
    return filmsQueue.slice(left, right);
  }

  function toDrowQueue() {
    localStorage.setItem('library', 'queuePage');

    loader.spinner.show();

    ulRef.innerHTML = '';

    queuePageBtnRef.classList.add('current');
    watchedPageBtnRef.classList.remove('current');

    const queueCount = getFilmsQueueCount();
    if (queueCount === 0) {
      loader.spinner.close();
      ulRef.insertAdjacentHTML(
        'beforeend',
        `<li><div class="notification"><h2>You do not have to queue movies to watch. Add them.</h2></div></li>`,
      );
    } else {
      loader.spinner.close();
      ulRef.insertAdjacentHTML('beforeend', renderLibFilms(getFilmsQueue(1)));
      addPaginator({
        totalResults: queueCount,
        perPage: getPerPage(),
        loadPage: function (page) {
          ulRef.innerHTML = '';
          ulRef.insertAdjacentHTML(
            'beforeend',
            renderLibFilms(getFilmsQueue(page)),
          );
        },
      });
    }
  }
}

// if (localStorage.getItem('library') === 'queuePage') {
//   libraryPage.toDrowQueue;
// } else if (localStorage.getItem('library') === 'watchedPage') {
//   libraryPage.toDrowWatched;
// }
