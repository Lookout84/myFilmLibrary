'use strict';
import * as lightbox from 'basiclightbox';
const spinMarkup = `<div class="loader">
<div class="loader-inner">
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
  <div class="loader-line-wrap">
    <div class="loader-line"></div>
  </div>
</div>
</div>`;
const spinner = lightbox.create(spinMarkup);
export default { spinner };
