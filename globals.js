/**
 * товары из БД
 */
var tovarsFromDB = {}
var tovarsFromDBReady = false;

/**
 * корзина включена/выключена
 */
var cartEnabled = {
	'2steblya': true,
	'2steblya_white': true,
	'gvozdisco': true,
	'staytrueflowers': true
}

/**
 * форма заказа в корзине сокращенная/полная
 */
var cartExpanded = {
	'2steblya': false,
	'2steblya_white': false,
	'gvozdisco': false,
	'staytrueflowers': true
}

/**
 * уровни цен товаров
 */
var productPriceLevels = {
	'2steblya': {
		9000: ['букетусик', 'сердечко', 'кастрюлька', 'яичко'],
		12000: ['букетик', 'сердце', 'кастрюля', 'ящичек', 'яйцо', 'аквариумчик', 'формочка для запекания'],
		16000: ['букет', 'кастрюлища', 'горшок', 'ящик', 'аквариум', 'форма для запекания'],
		20000: ['букетище', 'корзиночка'],
		25000: ['коробка', 'корзинка'],
		35000: ['корзина'],
		50000: ['букет-гигант', 'корзинища'],
		100000: ['корзилла']
	},
	'2steblya_white': {
		7000: ['букетусик', 'сердечко', 'кастрюлька', 'яичко'],
		12000: ['букетик', 'сердце', 'кастрюля', 'ящичек', 'яйцо', 'аквариумчик', 'формочка для запекания'],
		16000: ['букет', 'кастрюлища', 'горшок', 'ящик', 'аквариум', 'форма для запекания'],
		20000: ['букетище', 'корзиночка'],
		25000: ['коробка', 'корзинка'],
		35000: ['корзина'],
		50000: ['букет-гигант', 'корзинища'],
		100000: ['корзилла']
	},
	'gvozdisco': {
		7000: ['букетусик', 'сердечко', 'кастрюлька', 'яичко'],
		12000: ['букетик', 'сердце', 'кастрюля', 'ящичек', 'яйцо', 'аквариумчик', 'формочка для запекания'],
		16000: ['букет', 'кастрюлища', 'горшок', 'ящик', 'аквариум', 'форма для запекания'],
		20000: ['букетище', 'корзиночка'],
		25000: ['коробка', 'корзинка'],
		35000: ['корзина'],
		50000: ['букет-гигант', 'корзинища'],
		100000: ['корзилла']
	},
	'staytrueflowers': {
		7000: ['букет S'],
		12000: ['букет M'],
		16000: ['букет L'],
		20000: ['букет XL'],
		25000: ['коробка XL', 'корзина XL'],
		35000: ['корзина XXL'],
		50000: ['корзина XXXL'],
		100000: ['корзина ГУЛЯТЬ ТАК ГУЛЯТЬ']
	}
};

/**
 * опция торгового предложения
 */
var productFormat = {
	'2steblya': 'фор мат',
	'2steblya_white': 'размер',
	'gvozdisco': 'формат',
	'staytrueflowers': 'формат'
}

/**
 * мимимальная цена на сайте
 */
var minPrice = {
	'2steblya': 0,
	'2steblya_white': 0,
	'gvozdisco': 0,
	'staytrueflowers': 0
}

/**
 * нитакой как все
 */
var nitakoi = {
	'2steblya': '105671635591',
	'2steblya_white': '',
	'gvozdisco': '',
	'staytrueflowers': '400814140661'
}

/**
 * сезоны цветов
 */
var flowersSeasons = {
	'пион': 'июнь-июль',
	'георгина': 'август-сентябрь'
}

/**
 * праздничные даты
 */
var specialDatesList = [
	{
		d: 14,
		m: 2,
		'2steblya': {
			minPrice: 12000,
			exclude: [
				652864682431, //пупырка
				663441383001, //суп
				748114270281 //powerbanka
			]
		},
		'2steblya_white': {
			minPrice: 10000,
			exclude: []
		},
		'gvozdisco': {
			minPrice: 10000,
			exclude: []
		},
		'staytrueflowers': {
			minPrice: 7500,
			exclude: []
		}
	},
	{
		d: 7,
		m: 3,
		'2steblya': {
			minPrice: 16000,
			exclude: [
				560426289201, //мимоза
				154316318491, //любюлютики
				748114270281, //powerbanka
				969888387731, //лучшей женщине
				690076603321, //суп
				652864682431, //пупырка
				561739979091 //простата
			],
		},
		'2steblya_white': {
			minPrice: 10000,
			exclude: []
		},
		'gvozdisco': {
			minPrice: 10000,
			exclude: []
		},
		'staytrueflowers': {
			minPrice: 10000,
			exclude: []
		}
	},
	{
		d: 8,
		m: 3,
		'2steblya': {
			minPrice: 10000,
			exclude: [
				560426289201, //мимоза
				154316318491, //любюлютики
				748114270281, //powerbanka
				969888387731, //лучшей женщине
				690076603321, //суп
				652864682431, //пупырка
				561739979091 //простата
			],
		},
		'2steblya_white': {
			minPrice: 10000,
			exclude: []
		},
		'gvozdisco': {
			minPrice: 10000,
			exclude: []
		},
		'staytrueflowers': {
			minPrice: 10000,
			exclude: []
		}
	}
];

//например: 2025-1-1, 2025-10-6, 2025-8-25
var notWorkingDatesList = [
	'2024-12-31',
	'2025-1-1',
	'2025-1-2',
	'2025-1-3',
];

/**
 * промокоды общие "all" или штучные "individual" (только на конкретный товар)
 */
var promocodeType = {
	'2steblya': 'all',
	'2steblya_white': 'all',
	'gvozdisco': 'all',
	'staytrueflowers': 'individual'
}

/**
 * товары по промокоду
 */
var promocodeTovars = {
	'2steblya': [],
	'2steblya_white': [],
	'gvozdisco': [],
	'staytrueflowers': []
}