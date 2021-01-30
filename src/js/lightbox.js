import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

function loadBigImg(event) {
  event.preventDefault();
  const img = event.target;
  const bigImg = img.attributes.data.nodeValue;
  const instance = basicLightbox.create(
    `<img src= ${bigImg} width="1200" height="800">`,
  );
  instance.show();
  console.dir(img);
}

export default loadBigImg;
