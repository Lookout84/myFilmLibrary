import './sass/main.scss';
import footer from './html/footer.html';
import detailsPage from './html/main/detailsPage.html';
import ApiService from './js/2searchAndPlaginationHomePage';
import { data } from 'autoprefixer';
import detailPage from './templates/detailPage.hbs';
import renderHomePage from './js/1initialHomePage';

const bodyRef = document.querySelector('body');
const apiService = new ApiService();

renderHomePage();
