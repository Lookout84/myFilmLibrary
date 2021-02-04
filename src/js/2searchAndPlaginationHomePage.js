'use strict';

import { adoptPPFetch } from './plagins';
import { screenSize, getPerPage } from './variables';
import jQuery from 'jquery';

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
        return fetch(url)
          .then(response => response.json())
          .then(data => {
            // this.page += 1;
            return data.results;
          });
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

        return fetch(url)
          .then(response => response.json())
          .then(data => {
            return data.results;
          });
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
      console.log(data);
      return this.fetchGenres()
        .then(genres => {
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
        })
        .catch(err => {
          // const er = 0;
          return data;
        });
    });
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
