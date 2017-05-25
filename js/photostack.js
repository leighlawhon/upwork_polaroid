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
		this.inner = this.el.querySelector( 'div' );

		this.allItems = [].slice.call( this.inner.children );
		this.allItemsCount = this.allItems.length;
		if( !this.allItemsCount ) return;
		this.items = [].slice.call( this.inner.querySelectorAll( 'figure:not([data-dummy])' ) );
		this.itemsCount = this.items.length;
		// index of the current photo
		this.current = 0;
		this.options = extend( {}, this.options );
  		extend( this.options, options );
  		this._init();
			if(this.options.tags){
				var set = {0:[],1:[], selected:0};
				for (var i = 0; i < this.allItems.length; i++) {
					console.log(this.allItems[i].dataset.tag);
					this.allItems[i].dataset.tag === this.options.tags[0] ? set[0].push(this.allItems[i]) : set[1].push(this.allItems[i])
				}
				this.stacks = set
			}
	}

	Photostack.prototype.options = {};

	Photostack.prototype._init = function() {
		this.currentItem = this.items[ this.current ];
		this._getSizes();
		this._initEvents();
	}

	Photostack.prototype._addHeader = function() {
		// add nav dots
		console.log();
		var backButton = document.createElement('button'),
		galleryHead = document.createElement('h1');
		galleryHead.innerHTML = 'Gallery ' + (this.stacks? this.stacks.selected + 1: '')
		backButton.innerHTML = 'Back';
		var self=this;
		backButton.onclick = function(){
			console.log('button', this);
			// self._init();
			// self._shuffle();
			// self._initEvents();
		};
// Prepend it
		console.log(this);
		// this.el.insertBefore(backButton, this.el.firstChild);
		// this.el.insertBefore(galleryHead, this.el.firstChild);
	}

	var clickOverlay = function(e){
		e.target.removeEventListener('click', clickOverlay);
		e.x > (screen.width/2) ? window.Photostack.prototype._openStack(0) : window.Photostack.prototype._openStack(1);
	}
	Photostack.prototype._openStack = function(tag){
		console.log("open");
		this._addHeader();
		// var elements = document.querySelectorAll('.' + this.options.tags[tag]);
		// tag? this.stacks.selected = 0: this.stacks.selected = 1;
		// for (var i = 0; i < elements.length; i++) {
		// 	classie.addClass( elements[i], 'hide' );
		// }
		// this._grid();
	}
	Photostack.prototype._initEvents = function() {
		this.el.addEventListener('click', clickOverlay)
		var self = this,
			beforeStep = classie.hasClass( this.el, 'photostack-start' ),
			openRandom = function() {
				var setTransition = function() {
					if( support.transitions ) {
						classie.addClass( self.el, 'photostack-transition' );
					}
				}
				if( beforeStep ) {
					classie.removeClass( self.el, 'photostack-start' );
					setTransition();
				}
				else {
					self.openDefault = true;
					setTimeout( setTransition, 25 );
				}
				self.started = true;
				self._showPhoto( self.current );
			};

		if( beforeStep ) {
			this._shuffle();
			var container = this.el
			var screen =  this.sizes.inner;
			var tags = this.options.tags
			setTimeout(function(){ addOverlay(container, screen, tags) }, 500);
			function addOverlay(container, screen, tags) {
				openRandom();
				console.log(self);
			}
			//

		}
		else {
			console.log('after');
			openRandom();
		}
		window.addEventListener( 'resize', function() {
			if(!classie.hasClass(self.el, 'photostack-grid')){
				self._resizeHandler();
			}
		});
	}

	Photostack.prototype._resizeHandler = function() {
		var self = this;
		function delayed() {
			self._resize();
			self._resizeTimeout = null;
		}
		if ( this._resizeTimeout ) {
			clearTimeout( this._resizeTimeout );
		}
		this._resizeTimeout = setTimeout( delayed, 100 );
	}

	Photostack.prototype._resize = function() {
		var self = this, callback = function() { self._shuffle( true ); }
		this._getSizes();
		if( this.started && this.flipped ) {
			this._rotateItem( callback );
		}
		else {
			callback();
		}
	}

	Photostack.prototype._showPhoto = function( pos ) {
		if( this.isShuffling ) {
			return false;
		}
		this.isShuffling = true;

		// if there is something behind..
		if( classie.hasClass( this.currentItem, 'photostack-flip' ) ) {
			this._removeItemPerspective();
		}

		classie.removeClass( this.currentItem, 'photostack-current' );

		// change current
		this.current = pos;
		this.currentItem = this.items[ this.current ];

		// shuffle a bit
		this._shuffle();
	}

	// display items (randomly)
	Photostack.prototype._shuffle = function( resize ) {
		var iter = resize ? 1 : this.currentItem.getAttribute( 'data-shuffle-iteration' ) || 1;
		if( iter <= 0 || !this.started || this.openDefault ) { iter = 1; }
		// first item is open by default
		if( this.openDefault ) {
			// change transform-origin
			classie.addClass( this.currentItem, 'photostack-flip' );
			this.openDefault = false;
			this.isShuffling = false;
		}
		var overlapFactor = .5,
			// lines & columns
			// the window width / an item widtha nd the over lap which is .5 lines = a % of the screen
			lines = Math.ceil(this.sizes.inner.width / (this.sizes.item.width * overlapFactor) ),
			// collumns = screen height/ height of the item * 0.5 = total items on screen
			columns = Math.ceil(this.sizes.inner.height / (this.sizes.item.height * overlapFactor) ),
			// since we are rounding up the previous calcs we need to know how much more we are adding to the calcs for both x and y axis
			addX = lines * this.sizes.item.width * overlapFactor + this.sizes.item.width/2 - this.sizes.inner.width,
			addY = columns * this.sizes.item.height * overlapFactor + this.sizes.item.height/2 - this.sizes.inner.height,
			// we will want to center the grid
			extraX = addX / 2,
			extraY = addY / 2,
			// max and min rotation angles
			maxrot = 35, minrot = -35,
			self = this,
			// translate/rotate items
			moveItems = function() {
				--iter;
				// create a "grid" of possible positions
				var grid = [];
				// populate the positions grid
				// for each collum ()
				for( var i = 0; i < columns; ++i ) {
					var col = grid[ i ] = [];
					for( var j = 0; j < lines; ++j ) {
						// xVal = [1-11] * (width * .5) - extraX
						var xVal = j * (self.sizes.item.width * overlapFactor) - extraX,
							yVal = i * (self.sizes.item.height * overlapFactor) - extraY,
							olx = 0, oly = 0;
						// if everything is at the begining, it's ok to overlap the center
						// console.log(self.started, iter, 'iter');
						if( self.started && iter === 0 ) {
							var ol = self._isOverlapping( { x : xVal, y : yVal } );
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
				// shuffle
				grid = shuffleMArray(grid);
				var l = 0, c = 0, cntItemsAnim = 0;
				self.allItems.forEach( function( item, i ) {
					// console.log(item);
					// pick a random item from the grid
					if( l === lines - 1 ) {
						c = c === columns - 1 ? 0 : c + 1;
						l = 1;
					}
					else {
						++l
					}

					var gridVal = grid[c][l-1],
						translation = { x : gridVal.x, y : gridVal.y },
						onEndTransitionFn = function() {
							++cntItemsAnim;
							if( support.transitions ) {
								this.removeEventListener( transEndEventName, onEndTransitionFn );
							}
							if( cntItemsAnim === self.allItemsCount ) {
								if( iter > 0 ) {
									moveItems.call();
								}
								else {
									// change transform-origin
									classie.addClass( self.currentItem, 'photostack-flip' );
									// all done..
									self.isShuffling = false;
									if( typeof self.options.callback === 'function' ) {
										self.options.callback( self.currentItem );
									}
								}
							}
						};
						if (self.options.tags &&  self.started) {
							// console.log(  );
							if(item.dataset.tag === self.options.tags[0]){
								var transformation = 'translate(' + (self.sizes.inner.width/8) + 'px,' + (self.sizes.inner.height/4) + 'px) rotate(' + Math.floor( Math.random() * (maxrot - minrot + 1) + minrot ) + 'deg)';
							}else{
								var transformation = 'translate(' + (self.sizes.inner.width/8 *5) + 'px,' + (self.sizes.inner.height/4) + 'px) rotate(' + Math.floor( Math.random() * (maxrot - minrot + 1) + minrot ) + 'deg)';
							}

							item.style.WebkitTransform = transformation;
							item.style.msTransform = transformation;
							item.style.transform = transformation;
							classie.removeClass(item, 'hide')
						}else{
							var transformation = 'translate(' + translation.x + 'px,' + translation.y + 'px) rotate(' + Math.floor( Math.random() * (maxrot - minrot + 1) + minrot ) + 'deg)';
							item.style.WebkitTransform = transformation;
							item.style.msTransform = transformation;
							item.style.transform = transformation;
						}

					if( self.started ) {
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

	// display items in grid
	Photostack.prototype._grid = function( resize ) {
		var iter = resize ? 1 : this.currentItem.getAttribute( 'data-shuffle-iteration' ) || 1;
		var
			// lines & columns
			// the window width / an item widtha nd the over lap which is .5 lines = a % of the screen
			lines = Math.ceil(this.sizes.inner.width / (this.sizes.item.width) ),
			// collumns = screen height/ height of the item * 0.5 = total items on screen
			columns = Math.ceil(this.sizes.inner.height / (this.sizes.item.height) );
			// since we are rounding up the previous calcs we need to know how much more we are adding to the calcs for both x and y axis

		this._createGrid(iter, columns, lines);
	}
	Photostack.prototype._createGrid = function(iter, columns, lines) {
		--iter;
		// create a "grid" of possible positions
		var grid = [];
		// populate the positions grid
		// for each collum ()
		for( var i = 0; i < columns; ++i ) {
			var col = grid[ i ] = [];
			for( var j = 0; j < lines; ++j ) {
				// xVal = [1-11] * (width * .5) - extraX
				var xVal = j * this.sizes.item.width,
					yVal = i * this.sizes.item.height,
					olx = 0, oly = 0;
				col[ j ] = { x : xVal, y : yVal };
			}
		}
		var self = this;
		var getItems = function (){
			if(self.stacks){
				return self.stacks[self.stacks.selected];
			}else{
				return self.allItems;
			}
		}

		this._placeItemsOnGrid(getItems(), grid, columns, lines, false);
	};
	Photostack.prototype._placeItemsOnGrid = function (items, grid, columns, lines, shuffle){

		var l = 0, c = 0, cntItemsAnim = 0;
		var self = this;
		items.forEach( function( item, i ) {
			// pick a random item from the grid
			if( l === lines - 1 ) {
				c = c === columns - 1 ? 0 : c + 1;
				l = 1;
			}
			else {
				++l
			}

			var gridVal = grid[c][l-1],
				translation = { x : gridVal.x, y : gridVal.y },
				onEndTransitionFn = function() {
					++cntItemsAnim;
					if( support.transitions ) {
						this.removeEventListener( transEndEventName, onEndTransitionFn );
					}
				};

				var transformation = 'translate(' + translation.x + 'px,' + translation.y + 'px) ';
				item.style.WebkitTransform = transformation;
				item.style.msTransform = transformation;
				item.style.transform = transformation;
				classie.addClass(self.el, 'photostack-grid')

			if( self.started ) {
				if( support.transitions ) {
					item.addEventListener( transEndEventName, onEndTransitionFn );
				}
				else {
					onEndTransitionFn();
				}
			}
		} );
	}
	Photostack.prototype._getSizes = function() {
		this.sizes = {
			inner : { width : this.inner.offsetWidth, height : (this.inner.offsetHeight > 0? this.inner.offsetHeight : window.innerHeight) },
			item : { width : this.currentItem.offsetWidth, height : this.currentItem.offsetHeight }
		};

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
				// move right / or move right
				var tags = this.options.tags;
				// console.log(this);
				var right = Math.random() > 0.5,
					randExtraX = Math.floor( Math.random() * (dxItem/4 + 1) ),
					randExtraY = Math.floor( Math.random() * (dyItem/4 + 1) ),
					noOverlapX = right ? (itemVal.x - areaVal.x + dxItem) * -1 - randExtraX : (areaVal.x + dxArea) - (itemVal.x + dxItem) + dxItem + randExtraX,
					noOverlapY = right ? (itemVal.y - areaVal.y + dyItem) * -1 - randExtraY : (areaVal.y + dyArea) - (itemVal.y + dyItem) + dyItem + randExtraY;

				return {
					overlapping : true,
					noOverlap : { x : noOverlapX, y : noOverlapY }
				}
		}
		return {
			overlapping : false
		}
	}

	Photostack.prototype._addItemPerspective = function() {
		classie.addClass( this.el, 'photostack-perspective' );
	}

	Photostack.prototype._removeItemPerspective = function() {
		classie.removeClass( this.el, 'photostack-perspective' );
		classie.removeClass( this.currentItem, 'photostack-flip' );
	}

	Photostack.prototype._rotateItem = function( callback ) {
		if( classie.hasClass( this.el, 'photostack-perspective' ) && !this.isRotating && !this.isShuffling ) {
			this.isRotating = true;

			var self = this, onEndTransitionFn = function() {
					if( support.transitions && support.preserve3d ) {
						this.removeEventListener( transEndEventName, onEndTransitionFn );
					}
					self.isRotating = false;
					if( typeof callback === 'function' ) {
						callback();
					}
				};

			if( this.flipped ) {
				if( support.preserve3d ) {
					this.currentItem.style.WebkitTransform = 'translate(' + this.centerItem.x + 'px,' + this.centerItem.y + 'px) rotateY(0deg)';
					this.currentItem.style.transform = 'translate(' + this.centerItem.x + 'px,' + this.centerItem.y + 'px) rotateY(0deg)';
				}
				else {
					classie.removeClass( this.currentItem, 'photostack-showback' );
				}
			}
			else {
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

	// add to global namespace
	window.Photostack = Photostack;

})( window );
