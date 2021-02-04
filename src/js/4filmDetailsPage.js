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
    modalContent: document.querySelector('[data-modal]'),
    homelink: document.querySelector('[data-home]'),
    liblink: document.querySelector('[data-lib]'),
    logolink: document.querySelector('[data-logo]'),
  };
  function monitorButtonStatusText() {
    //получаем ссылки
    const watchBtnRef = document.querySelector('.watched-button');
    const queueBtnRef = document.querySelector('.queue-btn');
    const watchedValue = localStorage.getItem('watched');
    const queueValue = localStorage.getItem('queue');
    const infoBoxRef = document.querySelector('.info');
    //получаем обьект с значениями и ключами детальной страници
    const libInfo = {};
    libInfo.id = infoBoxRef.dataset.id;
    libInfo.genres = infoBoxRef.dataset.genres;
    libInfo.image = infoBoxRef.dataset.image;
    libInfo.title = infoBoxRef.dataset.title;
    libInfo.vote = infoBoxRef.dataset.vote;
    libInfo.reliaseDate = infoBoxRef.dataset.release;
    //Если локал очереди просмотров не пустой и содержит обьект
    // присвоить значение текста кнопок
    if (queueValue && queueValue.includes(JSON.stringify(libInfo))) {
      queueBtnRef.innerText = 'DELETE FROM QUEUE';
      watchBtnRef.innerText = 'ADD TO WATHCED';
      // аналог с локал для просмтренных фильмов
    } else if (watchedValue && watchedValue.includes(JSON.stringify(libInfo))) {
      watchBtnRef.innerText = 'DELETE FROM WATHCED';
      queueBtnRef.innerText = 'ADD TO QUEUE';
    }
  }

  apiService.id = id;
  apiService.fetchDetailFilmWithNameGerges().then(data => {
    modal.classList.remove('is-hidden');
    refs.modalContent.insertAdjacentHTML('beforeend', detailPageTemplate(data));
    monitorButtonStatusText();
    const watchBtnRef = document.querySelector('.watched-button');
    const queueBtnRef = document.querySelector('.queue-btn');
    const infoBoxRef = document.querySelector('.info');
    watchBtnRef.addEventListener('click', addToWatched);
    queueBtnRef.addEventListener('click', addToQueue);
    //  ------------------------------------------------------------
    function addToWatched() {
      const watchedValue = localStorage.getItem('watched');
      const queueValue = localStorage.getItem('queue');
      const libInfo = {};
      libInfo.id = infoBoxRef.dataset.id;
      libInfo.genres = infoBoxRef.dataset.genres;
      libInfo.image = infoBoxRef.dataset.image;
      libInfo.title = infoBoxRef.dataset.title;
      libInfo.vote = infoBoxRef.dataset.vote;
      libInfo.reliaseDate = infoBoxRef.dataset.release;
      //ескли К!=0 и К=обьекту
      //  если есть в очереди удаляю его оттуда.
      if (queueValue && queueValue.includes(JSON.stringify(libInfo))) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('queue'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('queue', JSON.stringify(arr));
        queueBtnRef.innerText = 'ADD TO QUEUE';
        lsQueue = JSON.parse(localStorage.getItem('queue'));
      } else if (
        watchedValue &&
        watchedValue.includes(JSON.stringify(libInfo))
      ) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('watched'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('watched', JSON.stringify(arr));
        watchBtnRef.innerText = 'ADD TO WATHCED';
        lsWatched = JSON.parse(localStorage.getItem('watched'));
        return;
      }
      lsWatched.push(libInfo);
      localStorage.setItem('watched', JSON.stringify(lsWatched));
      watchBtnRef.innerText = 'DELETE FROM WATHCED';
    }
    // --------------------------------------------------------------------
    function addToQueue() {
      const libInfo = {};
      const queueValue = localStorage.getItem('queue');
      const watchedValue = localStorage.getItem('watched');
      libInfo.id = infoBoxRef.dataset.id;
      libInfo.genres = infoBoxRef.dataset.genres;
      libInfo.image = infoBoxRef.dataset.image;
      libInfo.title = infoBoxRef.dataset.title;
      libInfo.vote = infoBoxRef.dataset.vote;
      libInfo.reliaseDate = infoBoxRef.dataset.release;
      //Если просмотр не пуст и просмотр содержит обьект удаляем обьект с просмотра
      if (watchedValue && watchedValue.includes(JSON.stringify(libInfo))) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('watched'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('watched', JSON.stringify(arr));
        watchBtnRef.innerText = 'ADD TO WATHCED';
        lsWatched = JSON.parse(localStorage.getItem('watched'));
      }
      //Если значение очереди не пустое и содержит объект удаляем обьект
      else if (queueValue && queueValue.includes(JSON.stringify(libInfo))) {
        let arr = [];
        arr = JSON.parse(localStorage.getItem('queue'));
        arr = arr.filter(n => n.id !== libInfo.id);
        localStorage.setItem('queue', JSON.stringify(arr));
        queueBtnRef.innerText = 'ADD TO QUEUE';
        lsQueue = JSON.parse(localStorage.getItem('queue'));
        return;
      }
      lsQueue.push(libInfo);
      localStorage.setItem('queue', JSON.stringify(lsQueue));
      queueBtnRef.innerText = 'DELETE FROM QUEUE';
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
