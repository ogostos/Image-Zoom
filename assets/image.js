const input = document.querySelector('#image_uploads');
const gallery = document.querySelector('.gallery');
const keepZoom = document.querySelector('#keepZoom');
// last dragged point and center of image
let lastX, lastY, centerX, centerY;
// transparent ghost image
const g = new Image();
g.src = './ghost.png';

input.addEventListener('change', updateImageDisplay);
// clear all images
function clearGallery () {
  while(gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}
// upload images
function updateImageDisplay () {
  const curFiles = input.files;
  if (curFiles.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No files currently selected for upload';
    gallery.appendChild(p);
  } else {
    for (let i = 0; i < curFiles.length; i++) {
      const galleryItem = document.createElement('div');
      if (validFileType(curFiles[i])) {
        const image = document.createElement('img');
        image.src = window.URL.createObjectURL(curFiles[i]);
        image.id = `image${i+1}`;
        image.draggable="true";
        image.addEventListener('dragstart', handleDragStart);
        image.addEventListener('dragover', handleDragOver);
        image.addEventListener('dragleave', handleDragLeave);
        galleryItem.appendChild(image);
      } else {
        const p = document.createElement('p')
        p.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
        galleryItem.appendChild(p);
      }
      gallery.appendChild(galleryItem);
    }
  }
}
// acceptable types of images
const fileTypes = ['image/jpeg', 'image/png']

function validFileType (file) {
  for(var i = 0; i < fileTypes.length; i++) {
    if(file.type === fileTypes[i]) {
      return true;
    }
  }
  return false;
}
// handlers for drag event
function handleDragStart (event) {
  event.dataTransfer.setDragImage(g, 0, 0);
  let rect = this.getBoundingClientRect();
  centerX = Math.floor(rect.width / 2) + rect.left;
  centerY = Math.floor(rect.height / 2) + rect.top;
  lastX = event.clientX, lastY = event.clientY;
  event.dataTransfer.effectAllowed = 'none';
}
function handleDragOver (event) {
  event.dataTransfer.dropEffect = 'none';
  zooming.call(this, event, lastX > centerX, lastY > centerY);
}
// check direction and zoom accordingly
function zooming (e, expX, expY) {
  const curX = e.clientX, curY = e.clientY;
  if (signOpposite(curX, centerX, expX) || signOpposite(curY, centerY, expY)) {
    return;
  }
  if (signOpposite(curX, lastX, expX) && signOpposite(curY, lastY, expY)) {
    this.classList.add('zoom-in');
  } else if (signSame(curX, lastX, expX) && signSame(curY, lastY, expY)) {
    this.classList.remove('zoom-in');
  }
  lastX = curX;
  lastY = curY;
}

function signOpposite (a, b, value) {
  return value ? a < b : a > b;
}

function signSame (a, b, value) {
  return value ? a > b : a < b;
}
function handleDragLeave () {
  if (keepZoom.checked) {
    return;
  }
  this.classList.remove('zoom-in');
}