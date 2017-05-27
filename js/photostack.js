/**
 * photostack.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;( function( window ) {

	'use strict';

	// https://gist.github.com/edankwan/4389601
	Modernizr.addTest('csstransformspreserve3d', function () {
		var prop = Modernizr.prefixed('transformStyle');
		var val = 'preserve-3d';
		var computedStyle;
		if(!prop) return false;

		prop = prop.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

		Modernizr.testStyles('#modernizr{' + prop + ':' + val + ';}', function (el, rule) {
			computedStyle = window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : '';
		});

		return (computedStyle === val);
	});

	var support = {
			transitions : Modernizr.csstransitions,
			preserve3d : Modernizr.csstransformspreserve3d
		},
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}
	function transformer (item, transformation){
		item.style.WebkitTransform = transformation;
		item.style.msTransform = transformation;
		item.style.transform = transformation;
	}
	function shuffleMArray( marray ) {
		var arr = [], marrlen = marray.length, inArrLen = marray[0].length;
		for(var i = 0; i < marrlen; i++) {
			arr = arr.concat( marray[i] );
		}
		// shuffle 2 d array
		arr = shuffleArr( arr );
		// to 2d
		var newmarr = [], pos = 0;
		for( var j = 0; j < marrlen; j++ ) {
			var tmparr = [];
			for( var k = 0; k < inArrLen; k++ ) {
				tmparr.push( arr[ pos ] );
				pos++;
			}
			newmarr.push( tmparr );
		}
		return newmarr;
	}

	function shuffleArr( array ) {
		var m = array.length, t, i;
		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);
			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
		return array;
	}

	function Photostack( el, options ) {
		this.el = el;
		this.inner = this.el.querySelector( '#photos' );
		this.allItems = [].slice.call( this.inner.children );
		this.allItemsCount = this.allItems.length;
		if( !this.allItemsCount ) return;
		this.items = [].slice.call( this.inner.querySelectorAll( 'figure:not([data-dummy])' ) );
		this.itemsCount = this.items.length;
		// index of the current photo
		this.current = 0;
		this.openToDefault = true;
		this.started = false;
		this.grid = false;
		this.options = extend( {}, this.options );
		this.rotation = {
			max: 35,
			min: -35
		}
		extend( this.options, options );
		this.stacks = this.options.tags ? true : false;
		this.stackSelected = 0;
		this._init();
	}

	Photostack.prototype.options = {};

	Photostack.prototype._init = function() {
		var PS = this;
		PS.currentItem = this.items[ this.current ];
		PS._getSizes();
		if(!PS.stacks){
			PS._addNavigation();
		}
		PS._initEvents();
	}

	Photostack.prototype._addNavigation = function() {
		// add nav dots
		this.nav = document.createElement( 'nav' )
		var inner = '';
		for( var i = 0; i < this.itemsCount; ++i ) {
			inner += '<span></span>';
		}
		this.nav.innerHTML = inner;
		this.el.appendChild( this.nav );
		this.navDots = [].slice.call( this.nav.children );
		console.log(this.navDots);
	}

	Photostack.prototype._initEvents = function() {
		var PS = this,
			// starts with scattered and then goes to trasition;
			beforeStep = classie.hasClass( this.el, 'photostack-start' ),
			setTransition = function() {
				if( support.transitions ) {
					classie.addClass( PS.el, 'photostack-transition' );
				}
			},
			goToGallery = function() {
				// If it is the first view
				setTransition();
				PS.started = true;
				if(!PS.stacks){
					classie.removeClass( PS.el, 'photostack-start' );
					this.removeEventListener( 'click', goToGallery );
					PS._showPhoto( PS.current );
				}else{
					classie.removeClass( PS.el, 'photostack-start' );
					classie.addClass( PS.el, 'photostack-stacks' );
					PS._openToStacks()
				}
			};

		if( beforeStep) {
			if(!PS.stacks){
				// Shuffle and add overlay with listner
				PS._shuffle();
				PS.el.addEventListener( 'click', goToGallery );
			}else{
				// wait a few second after open and shuffle to stacks
				PS._shuffle();
				setTimeout(goToGallery, 500)
			}
		}
		else {
			PS.openToDefault = true;
			setTimeout( setTransition, 25 );
		}
		if(!PS.stacks){
			console.log(this);
			this.navDots.forEach( function( dot, idx ) {
				dot.addEventListener( 'click', function() {
					// rotate the photo if clicking on the current dot
					if( idx === PS.current ) {
						PS._rotateItem();
					}
					else {
						// if the photo is flipped then rotate it back before shuffling again
						var callback = function() { PS._showPhoto( idx ); }
						if( PS.flipped ) {
							PS._rotateItem( callback );
						}
						else {
							callback();
						}
					}
				} );
			} );
		}
		window.addEventListener( 'resize', function() { PS._resizeHandler(); } );
	}

	Photostack.prototype._resizeHandler = function() {
		var PS = this;
		function delayed() {
			PS._resize();
			PS._resizeTimeout = null;
		}
		if ( PS._resizeTimeout ) {
			clearTimeout( PS._resizeTimeout );
		}
		PS._resizeTimeout = setTimeout( delayed, 100 );
	}

	Photostack.prototype._resize = function() {
		var PS = this,
		callback = function() { PS._shuffle( true ); }
		PS._getSizes();
		if( PS.started && PS.flipped && !PS.stacks) {
			PS._rotateItem( callback );
		}
		else {
			callback();
		}
	}

	Photostack.prototype._showPhoto = function( pos ) {
		var PS = this;
		if( PS.isShuffling ) {
			return false;
		}
		PS.isShuffling = true;
		// if there is something behind..
		if( classie.hasClass( PS.currentItem, 'photostack-flip' ) ) {
			PS._removeItemPerspective();
			if(!PS.stacks){
				classie.removeClass( PS.navDots[ PS.current ], 'flippable' );
				classie.removeClass( PS.navDots[ PS.current ], 'current' );
			}
		}
		classie.removeClass( PS.currentItem, 'photostack-current' );

		// change current
		PS.current = pos;
		PS.currentItem = PS.items[ PS.current ];
			classie.addClass( PS.navDots[ PS.current ], 'current' );

		// if there is something behind..
		if( PS.currentItem.querySelector( '.photostack-back' ) ) {
			// nav dot gets class flippable
			classie.addClass( PS.navDots[ pos ], 'flippable' );
		}
		// shuffle a bit
		PS._shuffle();
	}
	Photostack.prototype._openToStacks = function( ) {
		console.log("open to stacks");
		var PS = this,
		galleryHeadDivs = document.getElementById('galleryHead').querySelectorAll('h1'),
		backButton = document.createElement('button'),
		clickableElem = document.querySelectorAll('figure:not(.hide)'),
		openStack = function(e){
			if(e.x < (PS.sizes.inner.width/2)){
				var tag = 0;
			}else{
				var tag = 1;
			};
			var ele = 'figure:not(.' + PS.options.tags[tag] + ')',
			elements = document.querySelectorAll(ele);
			PS.stackSelected = tag;
			// hide headers
			for (var i = 0; i < galleryHeadDivs.length; i++) {
				classie.addClass(galleryHeadDivs[i], 'hide')
			};
			// hide unselected tags
			for (var i = 0; i < elements.length; i++) {
				// console.log(elements[i]);
				classie.addClass( elements[i], 'hide' );
			}
			// show stack head
			classie.removeClass(galleryHeadDivs[tag + 1], 'hide');
			// add back button
			backButton.onclick = closeStack;
			backButton.innerHTML = "<";
			galleryHeadDivs[tag + 1].insertBefore(backButton, galleryHeadDivs[tag + 1].firstChild);

			PS.el.removeEventListener('click', openStack);
			PS.grid = true;
			PS.stack = false;
			PS._shuffle();
			if(PS.grid){
				for (var i = 0; i < clickableElem.length; i++) {
					classie.addClass(clickableElem[i], 'clickable')
				}
			}
		},
		closeStack = function(){
			PS.grid = false;
			PS.stack = true;
			// show unselected tags
			var elements =  PS.inner.children;
			// console.log(PS.inner.children);
			for (var i = 0; i < elements.length; i++) {
				classie.removeClass( elements[i], 'hide' );
				classie.removeClass( elements[i], 'clickable' );
			}
			PS._shuffle();
		};
		// if left click go to stack one, if right, go to stack 2
		PS.el.addEventListener('click', openStack);
		classie.removeClass(document.getElementById('galleryHead-0'), 'hide')
		if( PS.isShuffling ) {
			return false;
		}
		PS.isShuffling = true;
		// shuffle a bit
		PS._shuffle();
	}

	// display items (randomly)
	Photostack.prototype._shuffle = function( resize ) {
		var PS = this;
		var iter = resize ? 1 : this.currentItem.getAttribute( 'data-shuffle-iteration' ) || 1;
		if( iter <= 0 || !this.started || this.openToDefault ) { iter = 1; }
		// first item is open by default
		if( this.openToDefault ) {
			// change transform-origin
			classie.addClass( this.currentItem, 'photostack-flip' );
			this.openToDefault = false;
			this.isShuffling = false;
		}

		var
			// max and min rotation angles
			PS = this,
			// translate/rotate items
			moveItems = function() {
				--iter;
				// create a "grid" of possible positions
				var grid = PS._makeGrid(iter);;
				// shuffle
				// if not stacks make grid and shuffle
				if(!PS.grid){
					grid = shuffleMArray(grid);
				}
				var l = 0, c = 0, cntItemsAnim = 0;
				// Add Items to grid
				if(PS.stacks && PS.grid ){
					var tag = '.' + PS.options.tags[PS.stackSelected];
					var items = document.querySelectorAll(tag);
					console.log(items, tag);
				}else{
					var items = PS.allItems;
				}
				items.forEach( function( item, i ) {
					// pick a random item from the grid
					if( l === PS.gridSettings.lines - 1 ) {
						c = c === PS.gridSettings.columns - 1 ? 0 : c + 1;
						l = 1;
					}
					else {
						++l
					}

					var
						gridVal = grid[c][l-1],
						translation = { x : gridVal.x, y : gridVal.y },
						onEndTransitionFn = function() {
							++cntItemsAnim;
							if( support.transitions ) {
								this.removeEventListener( transEndEventName, onEndTransitionFn );
							}
							if( cntItemsAnim === PS.allItemsCount ) {
								if( iter > 0 ) {
									moveItems.call();
								}
								else {
									// change transform-origin
									classie.addClass( PS.currentItem, 'photostack-flip' );
									// all done..
									PS.isShuffling = false;
									if( typeof PS.options.callback === 'function' ) {
										PS.options.callback( PS.currentItem );
									}
								}
							}
						};
					// if its the current item and not stacks, move it to the center;
					if(PS.items.indexOf(item) === PS.current && PS.started && iter === 0 && !PS.stacks) {
						var transformation = 'translate(' + PS.centerItem.x + 'px,' + PS.centerItem.y + 'px) rotate(0deg)';
						transformer(PS.currentItem, transformation);
						// if there is something behind..
						if( PS.currentItem.querySelector( '.photostack-back' ) ) {
							PS._addItemPerspective();
						}
						classie.addClass( PS.currentItem, 'photostack-current' );
					}
					else {
						var posX1 = (PS.sizes.inner.width/8),
						posX2 = PS.sizes.inner.width < 1500? posX1 * 4 : posX1 * 5,
						posY = (PS.sizes.inner.height/5),
						rotate =  ' rotate(' + Math.floor( Math.random() * (PS.rotation.max - PS.rotation.min + 1) + PS.rotation.min ) + 'deg)';
						if(PS.stacks && PS.started){
							if (!PS.grid) {
								// moveit to stacks
								console.log("moving to stacks");
								PS.el.addEventListener('click', PS._openStack);
								if(item.dataset.tag === PS.options.tags[0]){
									var transformation = 'translate(' + posX1 + 'px,' +  posY + 'px)' + rotate;
								}else{
									var transformation = 'translate(' + posX2 + 'px,' + posY + 'px)' + rotate;
								}
							}else{
								// move to grid
								var transformation = 'translate(' + translation.x + 'px,' + translation.y + 'px)';
								transformer(item, translation)
							}
							transformer(item, transformation)
						}else{
							// moveit randomely
							var translation = 'translate(' + translation.x + 'px,' + translation.y + 'px)' + rotate;
							transformer(item, translation)
						}
					}

					if( PS.started ) {
						if( support.transitions ) {
							item.addEventListener( transEndEventName, onEndTransitionFn );
						}
						else {
							onEndTransitionFn();
						}
					}
				} );
			};

		moveItems.call();
	}

	Photostack.prototype._getSizes = function() {
		// console.log(this.inner.offsetWidth)
		this.sizes = {
			inner : { width : this.inner.offsetWidth, height : this.inner.offsetHeight },
			item : { width : this.currentItem.offsetWidth, height : this.currentItem.offsetHeight }
		};
		this.overlapFactor = 0.5;
		this.gridSettings = {
			lines : Math.ceil(this.sizes.inner.width / (this.sizes.item.width * this.overlapFactor) ),
			columns : Math.ceil(this.sizes.inner.height / (this.sizes.item.height * this.overlapFactor) )
		};
		this.gridMargin = (this.inner.offsetWidth - (this.gridSettings.lines * this.sizes.item.width))/2;
		// console.log(this.inner.offsetWidth, (this.gridSettings.lines * this.sizes.item.width), this.gridMargin, this.overlapFactor);
		this.extra ={
			X : (this.gridSettings.lines * this.sizes.item.width * this.overlapFactor + this.sizes.item.width/2 - this.sizes.inner.width) / 2,
			Y : (this.gridSettings.columns * this.sizes.item.height * this.overlapFactor + this.sizes.item.height/2 - this.sizes.inner.height) / 2,
		}
		// translation values to center an item
		this.centerItem = { x : this.sizes.inner.width / 2 - this.sizes.item.width / 2, y : this.sizes.inner.height / 2 - this.sizes.item.height / 2 };
	}

	Photostack.prototype._isOverlapping = function( itemVal ) {
		var dxArea = this.sizes.item.width + this.sizes.item.width / 3, // adding some extra avoids any rotated item to touch the central area
			dyArea = this.sizes.item.height + this.sizes.item.height / 3,
			areaVal = { x : this.sizes.inner.width / 2 - dxArea / 2, y : this.sizes.inner.height / 2 - dyArea / 2 },
			dxItem = this.sizes.item.width,
			dyItem = this.sizes.item.height;

		if( !(( itemVal.x + dxItem ) < areaVal.x ||
			itemVal.x > ( areaVal.x + dxArea ) ||
			( itemVal.y + dyItem ) < areaVal.y ||
			itemVal.y > ( areaVal.y + dyArea )) ) {
				// how much to move so it does not overlap?
				// move left / or move right
				var left = Math.random() < 0.5,
					randExtraX = Math.floor( Math.random() * (dxItem/4 + 1) ),
					randExtraY = Math.floor( Math.random() * (dyItem/4 + 1) ),
					noOverlapX = left ? (itemVal.x - areaVal.x + dxItem) * -1 - randExtraX : (areaVal.x + dxArea) - (itemVal.x + dxItem) + dxItem + randExtraX,
					noOverlapY = left ? (itemVal.y - areaVal.y + dyItem) * -1 - randExtraY : (areaVal.y + dyArea) - (itemVal.y + dyItem) + dyItem + randExtraY;

				return {
					overlapping : true,
					noOverlap : { x : noOverlapX, y : noOverlapY }
				}
		}
		return {
			overlapping : false
		}
	}
	Photostack.prototype._makeGrid = function (iter){
		var PS = this;
		var grid = [];
		if(PS.grid){
			PS.overlapFactor = 1.05;
			PS.extra.X = -20;
			PS.extra.Y = -20;
		}
		// populate the positions grid
		// console.log(PS.gridSettings.columns, PS.gridSettings.lines);
		for( var i = 0; i < PS.gridSettings.columns; ++i ) {
			var col = grid[ i ] = [];
			for( var j = 0; j < PS.gridSettings.lines; ++j ) {
				var xVal = j * (PS.sizes.item.width * PS.overlapFactor) - PS.extra.X,
					yVal = i * (PS.sizes.item.height * PS.overlapFactor) - PS.extra.Y,
					olx = 0, oly = 0;
				// prevent overlap in the center for the center item
				if( PS.started && iter === 0 && !PS.grid) {
					var ol = PS._isOverlapping( { x : xVal, y : yVal } );
					if( ol.overlapping ) {
						olx = ol.noOverlap.x;
						oly = ol.noOverlap.y;
						var r = Math.floor( Math.random() * 3 );
						switch(r) {
							case 0 : olx = 0; break;
							case 1 : oly = 0; break;
						}
					}
				}

				col[ j ] = { x : xVal + olx, y : yVal + oly };
			}
		}
		return grid
	}
	Photostack.prototype._addItemPerspective = function() {
		classie.addClass( this.el, 'photostack-perspective' );
	}

	Photostack.prototype._removeItemPerspective = function() {
		classie.removeClass( this.el, 'photostack-perspective' );
		classie.removeClass( this.currentItem, 'photostack-flip' );
	}

	Photostack.prototype._rotateItem = function( callback ) {
		var PS = this;
		if( classie.hasClass( PS.el, 'photostack-perspective' ) && !PS.isRotating && !PS.isShuffling ) {
			PS.isRotating = true;

			var
			onEndTransitionFn = function() {
					if( support.transitions && support.preserve3d ) {
						this.removeEventListener( transEndEventName, onEndTransitionFn );
					}
					PS.isRotating = false;
					if( typeof callback === 'function' ) {
						callback();
					}
				};

			if( this.flipped ) {
				classie.removeClass( this.navDots[ this.current ], 'flip' );
				if( support.preserve3d ) {
					this.currentItem.style.WebkitTransform = 'translate(' + this.centerItem.x + 'px,' + this.centerItem.y + 'px) rotateY(0deg)';
					this.currentItem.style.transform = 'translate(' + this.centerItem.x + 'px,' + this.centerItem.y + 'px) rotateY(0deg)';
				}
				else {
					classie.removeClass( this.currentItem, 'photostack-showback' );
				}
			}
			else {
				classie.addClass( this.navDots[ this.current ], 'flip' );
				if( support.preserve3d ) {
					this.currentItem.style.WebkitTransform = 'translate(' + this.centerItem.x + 'px,' + this.centerItem.y + 'px) translate(' + this.sizes.item.width + 'px) rotateY(-179.9deg)';
					this.currentItem.style.transform = 'translate(' + this.centerItem.x + 'px,' + this.centerItem.y + 'px) translate(' + this.sizes.item.width + 'px) rotateY(-179.9deg)';
				}
				else {
					classie.addClass( this.currentItem, 'photostack-showback' );
				}
			}

			this.flipped = !this.flipped;
			if( support.transitions && support.preserve3d ) {
				this.currentItem.addEventListener( transEndEventName, onEndTransitionFn );
			}
			else {
				onEndTransitionFn();
			}
		}
	}
	// Photostack.prototype._addHeader = function(elements) {
		var PS = this;

		// if (elements.length) {
		// 	for (var i = 0; i < elements.length; i++) {
		// 		header.appendChild(elements[i]);
		// 	}
		// }else{
		// 	header.appendChild(elements)
		// }
	// }
	// add to global namespace
	window.Photostack = Photostack;

})( window );
