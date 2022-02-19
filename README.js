'use strict';

// forEach
// const els = Array.prototype.slice.call(el);


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js"></script>
<script src="<%= filePath %>assets/scripts/vendors/jquery.matchHeight-min.js"></script>
// [GitHub - liabru/jquery-match-height: a responsive equal heights plugin](https://github.com/liabru/jquery-match-height)
<script src="<%= filePath %>assets/scripts/vendors/intersection-observer.js"></script>
<script src="<%= filePath %>assets/scripts/vendors/swiper-bundle.min.js"></script>


--------------------------------------------- パーツ ---------------------------------------------

$(document).ready(function () {

	// ページ遷移
	//--------------------------------------------------------------------
	var $body = $("body");



	// リンク
	//--------------------------------------------------------------------
	$("a[href*='http://']:not([href*='" + location.hostname + "']),[href*='https://']:not([href*='" + location.hostname + "'])").attr('target', '_blank').addClass('blank');

	

	//  スムーズスクロール
	//--------------------------------------------------------------------
	$('a[href^="#"]').on('click', function () {
		var href = $(this).attr('href');
		var position = $(href).offset().top;
	$('html, body').animate({
		'scrollTop': position}, 500);
	return false;
	})


	
	
	//  ドロワーメニュー
	//--------------------------------------------------------------------
	$('.js-draw__trigger').on('click', function () {
		$('.js-draw__trigger').toggleClass('is-active');
		$('.js-draw__content').toggleClass('is-active');
		$('body').toggleClass('lock');
	})


	
	//  タブメニュー
	//--------------------------------------------------------------------
	$('.js-tab__list li').on('click', function () {


		var tabWrap = $(this).parents('.js-tab-wrap');
		var tabBtn = tabWrap.find(".js-tab__list li");
		var tabContents = tabWrap.find('.js-tab__content');
		tabBtn.removeClass('is-active');
		$(this).addClass('is-active');
		var elmIndex = tabBtn.index(this);
		tabContents.removeClass('is-active');
		tabContents.eq(elmIndex).addClass('is-active');
	});

	

	//  アコーディオンメニュー
	//--------------------------------------------------------------------
	$('.js-acc__trigger').on('click', function () {
		$('.js-acc__trigger').not(this).removeClass('is-open');
		$('.js-acc__trigger').not(this).next().stop().slideUp(300);
		$(this).toggleClass('is-open');
		$(this).toggleClass('is-open');
		$(this).next().stop().slideToggle(300);
	})



	

--------------------------------------------- プラグイン ---------------------------------------------

	//  matchHeight
	//--------------------------------------------------------------------
	$(function () {
		$('.p-skill__slideWrap div .p-skill__txt').matchHeight();
		$('.blog__list .blog__item .blog__body').matchHeight();
	});



	//  isotope
	//--------------------------------------------------------------------
	$('.gallery-mons').isotope({
		itemSelector: '.js-filter-items',
		masonry: {
			columnWidth: '.width2'
		}
	});

	$('.js-gallery').isotope({
		itemSelector: '.js-filter-items'
	});

	var $gallery = $('.js-gallery , .gallery-mons').isotope();

	$('.js-filtering').on('click', 'li', function () {
		var filterValue = $(this).attr('data-filter');
		$gallery.isotope({
			filter: filterValue
		});
	});

	$('.js-filtering').on('click', 'li', function () {
		$(this).addClass('is-active').siblings().removeClass('is-active');
	});


	//  isotope　selectbox
	//--------------------------------------------------------------------
	$('.js-filtering').on('change', function () {
		var filterValue = this.value;
		filterValue = filterFns[filterValue] || filterValue;
		$gallery.isotope({
			filter: filterValue
		});
	})


	var filterFns = {
		ium: function () {
			var name = $(this).find('.name').text();
			return name.match(/ium$/);
		}
	};

	$('.filters-select').on('change', function () {
		// get filter value from option value
		var filterValue = this.value;
		// use filterFn if matches value
		filterValue = filterFns[filterValue] || filterValue;
		$gallery.isotope({
			filter: filterValue
		});
	});
});





--------------------------------------------- スクロールアニメーション IO ---------------------------------------------

	
	


document.addEventListener('DOMContentLoaded', function () {

//  io - scrollAnim
//--------------------------------------------------------------------
	
  {
    const el = document.querySelectorAll('.inview');
    const els = Array.prototype.slice.call(el);

    const cb = function (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-anim');
        } else {}
      });
    }

    const options = {
      root: null,
      rootMargin: '-20% 0px',
      threshold: 0
    };
    const io = new IntersectionObserver(cb, options);
    els.forEach(el => io.observe(el));
  }


//  ヘッダー
//--------------------------------------------------------------------
  {
		
		
    const el = document.querySelectorAll('.js-first-view');
    const els = Array.prototype.slice.call(el);
    const header = document.getElementById('js-header');

    const options = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0
    };
    const observer = new IntersectionObserver(callback, options);
    els.forEach((el) => {
      observer.observe(el);
    });

    function callback(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          header.classList.add('is-active');
        } else {
          header.classList.remove('is-active');
        }
      });
    }

		
  }

	
//  文字分割
//--------------------------------------------------------------------
  {
    const el = document.querySelectorAll('.animate-heading');
    const els = Array.prototype.slice.call(el);

    const cb = function (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {

          entry.target.classList.add('inview');
          // setTimeout(() => {
          // }, 600);
        } else {
          // entry.target.classList.remove('inview');
        }
      });
    }

    const options = {
      root: null,
    };

    const io = new IntersectionObserver(cb, options);
    els.forEach(el => io.observe(el));

    for (let el of els) {
      const chars = el.innerHTML.trim().split("");

      el.innerHTML = chars.reduce((acc, curr) => {
        curr = curr.replace(/\s+/, '&nbsp;');
        return `${acc}<span class="char">${curr}</span>`;
      }, "");
    }
  }
});


//  目次連動
//--------------------------------------------------------------------

function doWhenIntersect(entries) {
  // 交差検知をしたもののなかで、isIntersectingがtrueのDOMを色を変える関数に渡す
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateIndex(entry.target);
    }
  });
}

function activateIndex(els) {
  // すでにアクティブになっている目次を選択
  const currentActiveIndex = document.querySelector("#indexList .is-active");
  // すでにアクティブになっているものが0個の時（=null）以外は、activeクラスを除去
  if (currentActiveIndex !== null) {
    currentActiveIndex.classList.remove("is-active");
  }
  // 引数で渡されたDOMが飛び先のaタグを選択し、activeクラスを付与
  const newActiveIndex = document.querySelector(
    `a[href='#${els.id}']`
  );
  newActiveIndex.classList.add("is-active");
}



{
	const els = document.querySelectorAll('.box');

	const options = {
		root: null, // 今回はビューポートをルート要素とする
		rootMargin: "-50% 0px", // ビューポートの中心を判定基準にする
		threshold: 0 // 閾値は0
	};

	const io = new IntersectionObserver(doWhenIntersect, options);
	els.forEach(el => io.observe(el));


	doWhenIntersect(entries);
	activateIndex(els);
}

