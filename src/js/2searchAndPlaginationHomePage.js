'use strict';

import { adoptPPFetch } from './plugins';
import { screenSize, getPerPage } from './variables';
import img from '../images/img-error.png';

const KEY = 'da596067165f304bd61b992449ff5b38';
const BASE = 'https://api.themoviedb.org/3';

export default class ApiService {
  constructor() {
    this.searchQ = '';
    this.page = 1;
    this.id = null;
  }

  fetchPopularFilmsCount() {
    const url = `${BASE}/trending/movie/day?&page=${1}&api_key=${KEY}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => data.total_results);
  }

  fetchPopularFilms() {
    return adoptPPFetch({
      page: this.page,
      perPage: getPerPage(),
      doFetch: page => {
        const url = `${BASE}/trending/movie/day?&page=${page}&api_key=${KEY}`;
        return fetch(url).then(response => response.json());
      },
    });
  }

  fetchFilmsCount() {
    const url = `${BASE}/search/movie?&page=${1}&api_key=${KEY}&query=${
      this.searchQ
    }`;
    return fetch(url)
      .then(response => response.json())
      .then(data => data.total_results);
  }

  fetchFilms() {
    return adoptPPFetch({
      page: this.page,
      perPage: getPerPage(),
      doFetch: page => {
        const url = `${BASE}/search/movie?&page=${page}&api_key=${KEY}&query=${this.searchQ}`;

        return fetch(url).then(response => response.json());
      },
    });
  }

  fetchDetailFilm() {
    const url = `${BASE}/movie/${this.id}?api_key=${KEY}`;

    return fetch(url).then(response => response.json());
  }

  fetchGenres() {
    const url = `${BASE}/genre/movie/list?api_key=${KEY}`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        return data.genres;
      });
  }

  fetchDetailFilmWithNameGerges() {
    return this.fetchDetailFilm().then(data => {
      return {
        ...data,

        release_date: data.release_date.split('-')[0],
        genresName: data.genres.map(id => (id.name = ' ' + id.name)),
      };
    });
  }

  insertGenres() {
    return this.fetchPopularFilms().then(data => {
      return this.fetchGenres().then(genres => {
        return data.map(film => ({
          ...film,
          release_date: film.release_date.split('-')[0],
          genres: film.genre_ids
            .map(id =>
              genres
                .filter(elem => elem.id === id)
                .map(id => (id.name = ' ' + id.name)),
            )
            .flat(),
        }));
      });
    });
  }

  insertSearhGenres() {
    return this.fetchFilms().then(data => {
      return this.fetchGenres()
        .then(genres => {
          return data.map(film => ({
            ...film,
            release_date: film.release_date
              ? film.release_date.split('-')[0]
              : 'No release date',
            genres: film.genre_ids
              .map(id =>
                genres
                  .filter(elem => elem.id === id)
                  .map(id => (id.name = ' ' + id.name)),
              )
              .flat(),
          }));
        })
        .catch(err => {
          // const er = 0;
          return data;
        });
    });
  }

  updateImgError(data) {
    const baseUrl = `https://image.tmdb.org/t/p/w500`;
    const imgError = `${img}`;

    return data.map(elem => {
      let baseUrlImg = elem.backdrop_path;
      let bigUrlImg = elem.poster_path;
      let date = elem.release_date;
      let genres = elem.genres;
      if (genres.length == 0) {
        elem.genres.push('No genres');
      }

      if (typeof date === 'undefined') {
        elem.release_date = 'No release date';
      }
      if (typeof elem.backdrop_path != 'string') {
        elem.backdrop_path = `${imgError}`;
      } else {
        elem.backdrop_path = `${baseUrl}${baseUrlImg}`;
      }
      if (typeof elem.poster_path != 'string') {
        elem.poster_path = `${imgError}`;
      } else {
        elem.poster_path = `${baseUrl}${bigUrlImg}`;
      }
      return elem;
    });
  }

  imgErrorDetailFilm(film) {
    const baseUrl = 'https://image.tmdb.org/t/p/original';
    const posterPath = film.poster_path;
    const imgError = `${img}`;
    if (typeof film.poster_path !== 'string') {
      film.poster_path = imgError;
    } else {
      if (posterPath.includes(baseUrl)) {
        film.poster_path = posterPath;
        return film;
      }
      if (posterPath.includes(imgError)) {
        film.poster_path = posterPath;
        return film;
      }
      film.poster_path = `${baseUrl}${film.poster_path}`;
    }
    return film;
  }

  get query() {
    return this.searchQ;
  }
  set query(newQuery) {
    this.searchQ = newQuery;
  }
  resetPage() {
    this.page = 1;
  }
}
