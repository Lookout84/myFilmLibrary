// import imageCard from "../templates/imagecard.hbs";

// const KEY = 'da596067165f304bd61b992449ff5b38';
// const BASE = 'https://api.themoviedb.org/3';

export default {
  query: "",
  page: 1,
  // perPage: 12,
  baseUrl: `https://api.themoviedb.org/3`,

  get queryValue() {
    return this.query;
  },
  set queryValue(value) {
    return (this.query = value);
  },

  async getFetch(value = this.query) {
    let key = `da596067165f304bd61b992449ff5b38`;
    this.queryValue = value;

    let params = `/trending/all/day?&page=${this.page}&api_key=${key}`;

    let url = this.baseUrl + params;

    const response = await fetch(url);
    const result = await response.json();
    return result;
  },

  setPage() {
    this.page += 1;
    return this.page;
  },

  resetPage() {
    this.page = 1;
    return this.page;
  },
};
