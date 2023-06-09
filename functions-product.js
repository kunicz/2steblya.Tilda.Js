/**
 * инициализация товаров и каталогов
 */
function product() {
	var int = setInterval(function () {
		if (window.location.pathname.includes('/tproduct/')) {
			/* страница продукта /tproduct/... */
			productLogoInHeader();
			var tovar = $('.js-store-product:not(.loaded)');
			if (!tovar) return;
			if (!$('.js-product-img.loaded').length) return;
			setTimeout(function () {
				productTovarFunctions(tovar);
			}, 1000);
			clearInterval(int);
		} else {
			/* если на странице есть каталог */
			var catalogs = $('.js-store');
			if (!catalogs.length) return;
			catalogs.each(function () {
				productCatalogFunctions($(this));
			});
			clearInterval(int);
		}
	}, 50);
}

/**
 * функции для товаров в попапе и на отдельной странице
 */
function productTovarFunctions(tovar) {
	productReplaceCardImgWithText(tovar);
	productVyebriKartochku(tovar);
	productOptionsReadMore(tovar);
	productHtmlInDescription(tovar);
	productHideEmptyText(tovar);
	productAddAdditionalText(tovar);
	productCharcs(tovar);
	productBlackFriday(tovar);
	productSoldOut(tovar);
	productBomjPlashka(tovar);
	productButton(tovar);
	productCartDisabled(tovar);
	productShow(tovar);
}

/**
 * функции для товаров в каталоге
 */
function productCatalogTovarFunctions(tovar, catalog) {
	productPrices(tovar, catalog);
	productReplaceCardImgWithText(tovar, catalog);
	productBlackFriday(tovar);
	productSoldOut(tovar, catalog);
	productBomjPlashka(tovar, catalog);
	productHideVitrinaDuplicate(tovar, catalog);
	producTotHide(tovar);
	productShow(tovar);
}

/**
 * функции для каталога 
 */
function productCatalogFunctions(catalog) {
	if (isVitrina(catalog, true)) return;
	productPopupOpen(catalog);
	productPopupClose();
	productCatalogMenu(catalog);
	productCatalogMutationObserver(catalog);
}

/**
 * открытие попапа товара
 */
function productPopupOpen(catalog) {
	var int = setInterval(function () {
		var popupTovar = catalog.find('.t-popup .js-product:not(.loaded)');
		if (!popupTovar.length) return;
		var observer = new MutationObserver(observerCallback);
		observer.observe(popupTovar.get(0), { attributes: true, attributeFilter: ['data-product-gen-uid'], attributeOldValue: true, childList: false, subtree: false });
		function observerCallback(mutationList, observer) {
			if (!mutationList.length) return;
			setTimeout(function () {
				productTovarFunctions(popupTovar);
			}, 1000);
		}
		clearInterval(int);
	}, 50);
}

/**
 * закрытие попапа
 */
function productPopupClose() {
	$('body').on('click', '.t-popup__close,.t-store__prod-popup__close-txt-wr,.t-store__prod-popup__btn', function () {
		var tovar = $(this).parents('.t-popup').find('.js-product');
		productHide(tovar);
	});
}

/**
 * проявляем товар из невидимости
 */
function productShow(tovar) {
	tovar.addClass('loaded');
	tovar.children().animate({ opacity: 1 }, 250);
}

/**
 * скрываем товар
 */
function productHide(tovar) {
	tovar.removeClass('loaded multiplePrices bomj noCard');
	setTimeout(function () {
		tovar.children().css('opacity', 0);
	}, 300);
}

/**
 * меню каталога
 */
function productCatalogMenu(catalog) {
	setTimeout(function () {
		var catalogMenuItems = catalog.find('.js-store-parts-switcher');
		if (!catalogMenuItems.length) return;
		addLinks();
		//renameAll();
		linkOnClick();

		/**
		 * делаем кликабельные ссылки
		 */
		function addLinks() {
			var catalogId = catalogMenuItems.parents('.uc-catalog').attr('id').replace('rec');
			catalogMenuItems.each(function () {
				$(this).contents().wrap('<a href="/?tfc_storepartuid[' + catalogId + ']=' + $(this).text() + '&tfc_div=:::#shop"></a>');
			});
		}

		/**
		 * переименовываем пункт "все"
		 */
		function renameAll() {
			var data = {
				'2steblya': 'ALL',
				'staytrueflowers': 'ВСЕ'
			}
			$('.t-store__parts-switch-btn-all').text(data[site]);
		}

		/**
		 * меняем адресную строку и пишем историю переходов при клике на пункт меню каталога
		 */
		function linkOnClick() {
			catalogMenuItems.on('click', function (e) {
				e.preventDefault();
				var href = window.location.href;
				href = href.slice(0, href.indexOf('#'));
				window.history.replaceState(null, '', href + '#shop');
			});
		}
	}, 1000);
}

/**
 * обновление каталога
 */
function productCatalogMutationObserver(catalog) {
	var observer = new MutationObserver(observerCallback);
	observer.observe(catalog.children('.js-store-grid-cont').get(0), { attributes: false, childList: true, subtree: false });
	function observerCallback(mutationList, observer) {
		if (!mutationList.length) return;
		var tovars = catalog.find('.js-store-grid-cont .js-product:not(.loaded)');
		if (!tovars.length) return;
		setTimeout(function () {
			tovars.each(function () {
				productCatalogTovarFunctions($(this), catalog);
			});
			window.dispatchEvent(new Event('resize'));
		}, 1000);
	}
}

/**
 * скрываем товары из витрины в других каталогах
 */
function productHideVitrinaDuplicate(tovar, catalog) {
	if (isVitrina(catalog)) return;
	var vitrinaList = getVitrinaTovarsIds();
	if (!vitrinaList.length) return;
	$.each(vitrinaList, function (i, id) {
		if (getTovarId(tovar) != id) return;
		tovar.hide();
	});
}

/**
 * цена товара
 */
function productPrices(tovar, catalog) {
	var options;
	if (isVitrina(catalog)) return;
	multipleVariantsProducts();
	specialProducts();
	minPriceCheck();
	//priceInOption();

	/**
	 * добавляем класс товару, у которого есть торговые предложения
	 */
	function multipleVariantsProducts() {
		options = tovar.find('[data-edition-option-id="' + productFormat[site] + '"] select option');
		if (options.length < 2) return;
		tovar.addClass('multiplePrices');
	}

	/**
	 * добавляем класс товару, у которого нет торговых предложений, но есть различные ценовые варианты
	 */
	function specialProducts() {
		var specialProducts = {
			'2steblya': [
				857613433221, //донатошная
				373328609241 //пионы для кисуни
			],
			'staytrueflowers': []
		}
		if (!specialProducts[site].includes(getTovarId(tovar))) return;
		tovar.addClass('multiplePrices');
	}

	/**
	 * добавляем опцию
	 */
	function priceInOption() {
		options.each(function () {
			var optionTitle = $(this).text();
			var price;
			$.each(productPriceLevels[site], function (p, levels) {
				if (!levels.includes(optionTitle)) return;
				price = p;
				return false;
			});
			$(this).attr('price', price);
		});
	}

	/**
	 * обрабатываем товар в случае, если его цена меньше минимально дозволенной
	 */
	function minPriceCheck() {
		var edited = false;
		$.each(productPriceLevels[site], function (price, titles) {
			if (price >= minPrice[site]) return;
			edited = true;
			tovar.removeClass('bomj');
			$.each(titles, function (j, title) {
				tovar.find('[data-edition-option-id="' + productFormat[site] + '"] select option[value="' + title + '"]').remove();
			});
		});
		if (!edited) return;
		var optLength = tovar.find('[data-edition-option-id="' + productFormat[site] + '"] select option').length;
		if (!optLength) tovar.hide();
		if (optLength == 1) tovar.removeClass('multiplePrices');
		if (getTovarPrice(tovar) < minPrice[site]) tovar.find('.js-product-price').text(minPrice[site].toString().replace(/(\d{3})$/, ' $1'));
	}
}

/**
 * если корзина отключена
 */
function productCartDisabled(tovar) {
	if (cartEnabled[site]) return;
	var data = {
		'2steblya': [
			'а как купить?',
			'сорян, мы зашиваемся и пока прием заказов заказан. но если у вас очень важное дело, то напишите нам в <a href="https://t.me/dva_steblya" target="blank">телегу</a>, че-нить придумаем<'
		],
		'staytrueflowers': [
			'А как купить?',
			'К сожалению, в данный момент прием заказов закрыт. Но вы всегда можете <a href="https://t.me/staytrueflowers">написать нам</a>, и мы обязательно постараемся вам помочь.'
		]
	}
	var cartDisabledParts = [
		'<p class="t-btn">' + data[site][0] + '</p>',
		'<p class="t-text">' + data[site][1] + '/p>'
	];
	var cartDisabled = $('<div class="cartDisabled t-text"></div>');
	cartDisabled.html(cartDisabledParts.join(''));
	tovar.find('.js-product-controls-wrapper').hide().after(cartDisabled);
	tovar.find('.js-store-buttons-wrapper').remove();
}

/**
 * бомжетность
 */
function productBomjPlashka(tovar, catalog) {
	if (site != '2steblya') return;
	if (getTovarPrice(tovar) > Object.keys(productPriceLevels[site])[0]) return;
	tovar.addClass('bomj');
	var data = {
		'2steblya': 'бомжетный',
		'staytrueflowers': 'бюджетный'
	}
	var plashka = $('<div class="bomjPlashka">' + data[site] + '</div>');
	tovar.find(catalog ? '.js-product-img' : '.t-slds').append(plashka);
	if (catalog) return;
	setInterval(function () {
		plashka.toggle(!$('.t-slds__item[data-slide-index="2"]').is('.t-slds__item_active')); //скрываем бомж плашку на слайдах с карточкой
	}, 100);
}

/**
 * кнопка "купить"
 */
function productButton(tovar) {
	if (site == '2steblya' && getTovarId(tovar) == 857613433221) { //донатошная
		$('.js-store-prod-popup-buy-btn-txt').text('ЗАДОНАТИТЬ!');
	}
}

/**
 * скрываем товары, которые должны быть скрыты
 */
function producTotHide(tovar) {
	if (site == '2steblya' && getTovarId(tovar) == 105671635591) { // нитакой как все
		tovar.prev('.t-clear').addBack().hide();
	}
}

/**
 * заменяем картинку "наша карточка" на текстовый аналог
 */
function productReplaceCardImgWithText(tovar, catalog) {
	if (site != '2steblya') return;
	if (!isCardToBeReplaced(tovar)) {
		removeOption();
		removeSelect(catalog);
		return;
	}
	var data = {
		'2steblya': '<p>«здесь может быть ваша реклама»</p><p>или какой хочешь текст,</p><p>решать тебе</p>',
		'staytrueflowers': '<p>здесь мы разместим ваше пожелание или поздравление</p>'
	}
	var card = tovar.find(catalog ? '.t-store__card__bgimg_second' : '.t-slds__item[data-slide-index="2"]');
	var cardContent = $('<div class="card__container t-text"></div>');
	var cardParts = [
		'<p class="card__buket">этот букет называется</p>',
		'<div class="card__title">' + getTovarTitle(tovar) + '</div>',
		'<div class="card__text">' + getTovarCardText(tovar) + '</div>',
		'<div class="card__your-text">' + data[site] + '</div>'
	]
	cardContent.append(cardParts.join(''));
	card.addClass('card').html(cardContent);
	if (!catalog) {
		setTimeout(function () {
			card.height(card.width());
		}, 500);
	}
	removeOption();
	removeSelect(catalog);

	/**
	 * удаляем опцию "с нашей карточкой", если нет текста карточки
	 */
	function removeOption() {
		if (getTovarCardText(tovar)) return;
		tovar.find('.js-product-option').find('select option[value="с нашей карточкой"]').remove();
		tovar.find('[data-slide-bullet-for="2"]').remove();
		tovar.addClass('noCard');
	}

	/**
	 * удаляем селект "выебри карточку", чтоб он не улетал в срм
	 */
	function removeSelect(catalog) {
		if (catalog) return;
		tovar.find('.js-product-option:last').remove();
	}

	/**
	 * если товару не надо подменять карточку
	 */
	function isCardToBeReplaced(tovar) {
		// по разделам к сожалению, нельзя использовать атрибут data-product-part-uid (айдишники разделов), так как этот атрибут отсутствует на страницах товаров (только в попапе)
		// по айдишникам товаров (data-product-gen-uid)
		var ids = {
			'2steblya': [],
			'staytrueflowers': []
		}
		ids['2steblya'].push(896292515801); // 14 фераля 2023 (love is)
		ids['2steblya'].push(103878497051);
		ids['2steblya'].push(448865187471);
		ids['2steblya'].push(260954710551);
		ids['2steblya'].push(953890300331); // всрадость
		if (ids[site].includes(getTovarId(tovar))) return false;
		return true;
	}
}

/**
 * скрываем текст с пустым #nbsp;
 */
function productHideEmptyText(tovar) {
	var e = tovar.find('.js-store-prod-all-text');
	if (!e.text().trim()) e.hide();
}

/**
 * поле: выебри карточку
 */
function productVyebriKartochku(tovar) {
	var selectOptions = ['с нашей карточкой', 'со своим текстом', 'без карточки', 'без айдентики'];
	tovar.find('.js-product-option:last select').on('change', function () {
		var bullets = $(this).parents('.t-store').find('.t-slds__thumbsbullet');
		if (!bullets.length) return;
		switch ($(this).val()) {
			case selectOptions[0]:
				bullets.eq(1).trigger('click');
				break;
			default:
				if (!bullets.eq(1).is('.t-slds__bullet_active')) break;
				bullets.eq(0).trigger('click');
				break;
		}
	});
}

/**
 * добавить дополнительный текст под описание товара
 */
function productAddAdditionalText(tovar) {
	var noTextProducts = {
		'2steblya': [
			857613433221 // донатошная
		],
		'staytrueflowers': []
	}
	if (noTextProducts[site].includes(getTovarId(tovar))) return;
	var data = {
		'2steblya': 'к любому букету прилагается его состав и чудо-порошок для продления жизни цветов<br>к букетам с айдентикой также прилагается карт очка и сосабельный петушок',
		'staytrueflowers': 'к любому букету прилагается его состав и чудо-порошок для продления жизни цветов'
	}
	var div = $('<div class="t-store__prod-popup__text-dop"></div>');
	div.html(data[site]);
	$('.js-store-prod-text').append(div);
}

/**
 * характеристики товара
 */
function productCharcs(tovar) {
	tovar.find('.js-store-prod-charcs').each(function () {
		$(this).addClass('costumized');
		let [first, ...rest] = $(this).text().split(/:\s/);
		rest = rest.join(': ');
		$(this).html('<b>' + first + '</b> ' + rest);
	});
}

/**
 * логотип вместо "НА ЗАД" на страницах товаров (не попап)
 */
function productLogoInHeader() {
	$('.js-store-close-text').empty().addClass('logo'); //широкие экраны
	$('.t-popup__close').addClass('logo'); //мобилка
	$('a.t-store__prod-popup__close-txt').attr('href', '/');
}

/**
 * ссылки на объясняющие страницы рядом с полями опций товара
 */
function productOptionsReadMore(tovar) {
	var productOptionsHelpLinks = {
		'2steblya': {
			'фор мат': '/format',
			'выебри карточку': '/card'
		},
		'staytrueflowers': {
			'Размер': '/format',
			'выберите карточку': '/card'
		}
	}
	tovar.find('.t-product__option-select').each(function () {
		var href = productOptionsHelpLinks[site][$(this).parent().prev().text()];
		if (!href) return;
		$(this).after('<a class="product__optionReadMore" href="' + href + '" onclick="window.open(\'' + href + '\');return false;">?</a>');
	});
}

/**
 * заменяем (&lt; &gt;) на нормальные символы (< >) в описании товара, чтоб отрабатывал html
 */
function productHtmlInDescription(tovar) {
	var text = tovar.find('.js-store-prod-all-text');
	if (!text.length) return;
	if (!text.html().includes('&lt;')) return;
	var html = text.html();
	html = html.replace('&lt;', '<');
	html = html.replace('&gt;', '>');
	text.html(html);
}

/**
 * черная пятница
 */
function productBlackFriday(tovar) {
	return;
	if (site != '2steblya') return;
	var originalPriceCont = tovar.find('.js-store-prod-price');
	var originalPrice = tovar.find('.js-product-price');
	var fridayPrice = $('<div class="fridayPrice" />');
	var fridayOldprice = $('<div class="fridayOldprice" />');
	var fridayDiscont = $('<div class="fridayDiscont">90% sale</div>');
	fridayPrice.append(fridayOldprice).append(fridayDiscont).insertBefore(originalPrice);
	rePrice(getTovarPrice(tovar));
	tovar.find('[data-edition-option-id="фор мат"] select').on('change', function () {
		rePrice(getTovarPrice(tovar));
	});
	function rePrice(price) {
		originalPriceCont.css('visibility', 'hidden');
		setTimeout(function () {
			var priceVal = Math.round(price / 10) * 10;
			fridayOldprice.text(priceVal * 10);
			originalPrice.text((priceVal - 1).toString().replace(/9{3}$/, ' 999'));
			originalPriceCont.css('visibility', 'visible');
		}, 250);
	}
}

/**
 * товар распродан
 */
function productSoldOut(tovar, catalog) {
	if (catalog) {
		var e = tovar.find('.js-store-prod-sold-out');
		e.removeClass('t-name').addClass('t-descr').css({ 'line-height': '31px', 'text-transform': 'lowercase' });
		e.siblings('.t-store__card__price').hide();
	} else {
		var btn = $('.t-store__prod-popup__btn');
		btn.show();
		var selects = $('.js-product-controls-wrapper');
		selects.show();
		tovar.find('.productSoldout').remove();
		if (!['Нет в наличии', 'Out of stock'].includes(btn.text().trim())) return;
		btn.hide().after('<div class="productSoldout t-btn">нет в наличии</div>');
		selects.hide();
	}
}

/**
 * получаем текст карточки из селекта "выебри карточку"
 */
function getTovarCardText(tovar) {
	var val = tovar.find('.js-product-option:last').find('select').val();
	return val.split('*br*').join('<br>');
}

/**
 * получаем название товара для карточки
 */
function getTovarTitle(tovar) {
	return tovar.find('.js-store-prod-name').text();
}

/**
 * получаем id товара
 */
function getTovarId(tovar) {
	return parseInt(tovar.attr('data-product-gen-uid'));
}

/**
 * получаем текущую цену товара
 */
function getTovarPrice(tovar) {
	var price = tovar.find('[data-product-price-def]');
	if (!price) return null;
	if (!price.text()) return null;
	return parseInt(price.text().replace(/[^\d]/g, ''));
}

/**
 * получаем айдишники товаров с витрины
 */
function getVitrinaTovarsIds() {
	var vitrinaList = [];
	var vitrinaTovars = $('.uc-vitrinaFooter .js-product.t-store__card');
	if (!vitrinaTovars.length) return vitrinaList;
	vitrinaTovars.each(function () {
		vitrinaList.push(getTovarId($(this)));
	});
	return vitrinaList;
}

/**
 * если каталог - это витрина
 */
function isVitrina(catalog, inFooter = false) {
	var c = '.uc-' + (inFooter ? 'vitrinaFooter' : 'vitrina__catalog');
	if (catalog.parents(c).length) return true;
	return false;
}