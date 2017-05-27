var imageJson = (function(){
  var loadFile = function(url, container, callback){
    var xhr =  new XMLHttpRequest;
    xhr.open('GET', url)
    xhr.send();
    xhr.onload = function(){
      if(xhr.status !== 200){
        console.error('Error: ', xhr.status);
      }
      // console.log(xhr.responseText);
      var json = JSON.parse(xhr.responseText),
      containerDiv = document.getElementById(container);
      addFigures.apply(json, [containerDiv, callback])

    }
  },
  addFigures = function(containerDiv, callback){
    console.log(containerDiv);
    var imageList = '',
    ele = containerDiv.querySelector( '#photos' ),
    images = this.images,
    info = this.gallery_info;
    for (var i = 0; i < images.length; i++) {
      var figure = '<figure data-tag=' + images[i].tag + ' class="' + images[i].tag  + '"> <a href=' + images[i].image_link + ' class="photostack-img"><img src=' + images[i].image_url + ' alt="img04"/></a> <figcaption> ' + images[i].caption + ' for tag: ' + images[i].tag + ' </figcaption> </figure>'
      imageList += figure;
    }
    ele.innerHTML = imageList;
		addHeaders(info, containerDiv);
    callback();
  },
  addHeaders = function(info, containerDiv){
    console.log(info);
    var headers = info,
    headDiv = containerDiv.querySelector('#galleryHead');
    for (var i = 0; i < headers.length; i++) {
      var head = document.createElement('h1');
      head.id = 'galleryHead-' + i;
      head.setAttribute('class', 'hide');
      head.innerHTML = headers[i].name;
      headDiv.appendChild(head);
    }

  }
  return {
    loadFile: loadFile
  }

})();
