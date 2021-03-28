import './sass/main.scss';
import footer from './html/footer.html';
import detailsPage from './html/main/detailsPage.html';
import ApiService from './js/2searchAndPlaginationHomePage';
import { data } from 'autoprefixer';
import detailPage from './templates/detailPage.hbs';
import renderHomePage from './js/1initialHomePage';
import libraryPage from './js/5libraryPage';

if (localStorage.getItem('page') === 'library') {
  libraryPage();
} else {
  renderHomePage();
}
