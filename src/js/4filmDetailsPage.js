'use strict';
import ApiService from './2searchAndPlaginationHomePage';
import detailPage from '../html/main/detailsPage.html';
import detailPageTemplate from '../templates/detailPage.hbs';
import libraryPage from './5libraryPage';

import renderHomePage from './1initialHomePage';
let lsWatched = [];
let lsQueue = [];

export default function openModal(id) {
  const apiService = new ApiService();
  const modal = document.querySelector('.backdrop');
  modal.innerHTML = '';
  modal.insertAdjacentHTML('beforeend', detailPage);
  const refs = {
    btnQu: document.querySelector('.film-name'),
    modalContent: document.querySelector('[data-modal]'),
    homelink: document.querySelector('[data-home]'),
    liblink: document.querySelector('[data-lib]'),
    logolink: document.querySelector('[data-logo]'),
  };

  function monitorButtonStatusText() {
    refs.watchBtnRef = document.querySelector('.watched-button');
    refs.queueBtnRef = document.querySelector('.queue-btn');
    const watchedValue = localStorage.getItem('watched');
    const queueValue = localStorage.getItem('queue');
    const infoBoxRef = document.querySelector('.info');
    refs.detailInfo = function LibInfo() {
      this.id = infoBoxRef.dataset.id;
      this.genres = infoBoxRef.dataset.genres;
      this.image = infoBoxRef.dataset.image;
      this.title = infoBoxRef.dataset.title;
      this.vote = infoBoxRef.dataset.vote;
      this.reliaseDate = infoBoxRef.dataset.release;
    };

    let libInfo = new refs.detailInfo();
    if (queueValue && queueValue.includes(JSON.stringify(libInfo))) {
      refs.queueBtnRef.classList.add('text-button');
      refs.queueBtnRef.innerText = 'DELETE FROM QUEUE';
      refs.watchBtnRef.innerText = 'ADD TO WATHCED';

      // аналог с локал для просмтренных фильмов
    } else if (watchedValue && watchedValue.includes(JSON.stringify(libInfo))) {
      refs.watchBtnRef.classList.add('text-button');
      refs.watchBtnRef.innerText = 'DELETE FROM WATHCED';
      refs.queueBtnRef.innerText = 'ADD TO QUEUE';
    }
  }

  apiService.id = id;
  apiService.fetchDetailFilmWithNameGerges().then(data => {
    apiService.imgErrorDetailFilm(data);
    modal.classList.remove('is-hidden');
    refs.modalContent.insertAdjacentHTML('beforeend', detailPageTemplate(data));
    monitorButtonStatusText();
    refs.watchBtnRef.addEventListener('click', addToWatched);
    refs.queueBtnRef.addEventListener('click', addToQueue);

    //  ------------------------------------------------------------

    function addToWatched() {
      const watchedValue = localStorage.getItem('watched');
      const queueValue = localStorage.getItem('queue');
      let libInfo = new refs.detailInfo();
      if (queueValue && queueValue.includes(JSON.stringify(libInfo))) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('queue'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('queue', JSON.stringify(arr));
        refs.queueBtnRef.innerText = 'ADD TO QUEUE';
        lsQueue = JSON.parse(localStorage.getItem('queue'));
        refs.queueBtnRef.classList.remove('text-button');
      } else if (
        watchedValue &&
        watchedValue.includes(JSON.stringify(libInfo))
      ) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('watched'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('watched', JSON.stringify(arr));
        refs.watchBtnRef.innerText = 'ADD TO WATHCED';
        lsWatched = JSON.parse(localStorage.getItem('watched'));
        refs.watchBtnRef.classList.remove('text-button');
        return;
      }
      lsWatched.push(libInfo);
      localStorage.setItem('watched', JSON.stringify(lsWatched));
      refs.watchBtnRef.classList.add('text-button');
      refs.watchBtnRef.innerText = 'DELETE FROM WATHCED';
    }
    // --------------------------------------------------------------------
    function addToQueue() {
      const queueValue = localStorage.getItem('queue');
      const watchedValue = localStorage.getItem('watched');
      let libInfo = new refs.detailInfo();
      if (watchedValue && watchedValue.includes(JSON.stringify(libInfo))) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('watched'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('watched', JSON.stringify(arr));
        refs.watchBtnRef.innerText = 'ADD TO WATHCED';
        lsWatched = JSON.parse(localStorage.getItem('watched'));
        refs.watchBtnRef.classList.remove('text-button');
      } else if (queueValue && queueValue.includes(JSON.stringify(libInfo))) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('queue'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('queue', JSON.stringify(arr));
        refs.queueBtnRef.innerText = 'ADD TO QUEUE';
        lsQueue = JSON.parse(localStorage.getItem('queue'));
        refs.queueBtnRef.classList.remove('text-button');
        return;
      }
      lsQueue.push(libInfo);
      localStorage.setItem('queue', JSON.stringify(lsQueue));
      refs.queueBtnRef.classList.add('text-button');
      refs.queueBtnRef.innerText = 'DELETE FROM QUEUE';
    }
    window.addEventListener('keydown', Esc);
  });
  refs.logolink.addEventListener('click', renderHomePage);
  refs.homelink.addEventListener('click', renderHomePage);
  refs.liblink.addEventListener('click', libraryPage);
  modal.addEventListener('click', closeclick);

  function closeclick(event) {
    if (event.target === event.currentTarget) {
      toggleModal();
    }
  }
  function toggleModal() {
    modal.classList.add('is-hidden');

    window.removeEventListener('keydown', Esc);
    modal.remove();
  }

  function Esc(event) {
    if (event.code === 'Escape') {
      toggleModal();
    }
  }
}
