'use strict';
import getRef from './refs';
import libraryPageHtml from '../html/main/myFilmLibraryPage.html';
import footer from '../html/footer.html';
import ApiService from './2searchAndPlaginationHomePage';
import libFilms from '../templates/libraryFilms.hbs';
import openModal from './4filmDetailsPage';
import renderHomePage from './1initialHomePage';
import loader from './spinner';

const apiService = new ApiService();

export default function libraryPage() {
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
  toDrowWatched();
  homelink.addEventListener('click', renderHomePage);
  logolink.addEventListener('click', renderHomePage);

  //при нажатии на watched и queue перерисуем страницу
  watchedPageBtnRef.addEventListener('click', toDrowWatched);
  queuePageBtnRef.addEventListener('click', toDrowQueue);

  ulRef.addEventListener('click', event => {
    loader.spinner.show();
    if (event.target.nodeName === 'IMG') {
      loader.spinner.close();
      const id = event.target.getAttribute('data-id');
      refs.bodyRef.insertAdjacentHTML(
        'beforeend',
        `<div class="backdrop is-hidden"></div>`,
      );
      openModal(id);
    }
  });

  function toDrowWatched() {
    loader.spinner.show();
    ulRef.innerHTML = '';
    queuePageBtnRef.classList.remove('current');
    watchedPageBtnRef.classList.add('current');
    const watch = JSON.parse(localStorage.getItem('watched'));
    console.log(watch);
    if (watch === null) {
      loader.spinner.close();
      ulRef.insertAdjacentHTML(
        'beforeend',
        `<li><div class="notification"><h2>You do not have to watched movies. Add them.</h2></div></li>`,
      );
    } else {
      loader.spinner.close();
      ulRef.insertAdjacentHTML('beforeend', libFilms(watch));
    }
  }
  function toDrowQueue() {
    loader.spinner.show();
    ulRef.innerHTML = '';

    queuePageBtnRef.classList.add('current');
    watchedPageBtnRef.classList.remove('current');

    const queue = JSON.parse(localStorage.getItem('queue'));
    console.log(queue);
    if (queue === null) {
      loader.spinner.close();
      ulRef.insertAdjacentHTML(
        'beforeend',
        `<li><div class="notification"><h2>You do not have to queue movies to watch. Add them.</h2></div></li>`,
      );
    } else {
      loader.spinner.close();
      ulRef.insertAdjacentHTML('beforeend', libFilms(queue));
    }
  }
}
