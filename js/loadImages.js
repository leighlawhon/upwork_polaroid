var imageJson = (function(){
  var addImages = function(url, container, callback){
    var xhr =  new XMLHttpRequest;
    xhr.open('GET', url)
    xhr.send();
    xhr.onload = function(){
      if(xhr.status !== 200){
        console.error('Error: ', xhr.status);
      }
      console.log(xhr.responseText);
      var json = JSON.parse(xhr.responseText);
      addFigures.apply(json.images, [container, callback])
    }
  }
  var addFigures = function(container, callback){
    var imageList = ''
    var ele = document.getElementById(container).querySelector( 'div' );
    for (var i = 0; i < this.length; i++) {
      var figure = '<figure data-tag=' + this[i].tag + ' class="' + this[i].tag  + '"> <a href=' + this[i].image_link + ' class="photostack-img"><img src=' + this[i].image_url + ' alt="img04"/></a> <figcaption> ' + this[i].caption + ' for tag: ' + this[i].tag + ' </figcaption> </figure>'
      imageList += figure;
    }
    ele.innerHTML = imageList;
    callback();
  }
  return {
    addImages: addImages
  }
})();
