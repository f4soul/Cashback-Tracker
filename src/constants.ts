import { Bank } from './types';

export const BANKS: Bank[] = [
  { id: 'tbank', name: 'Т-Банк', color: '#FFDD2D', logoText: 'Т', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/T-Bank_logo.svg/512px-T-Bank_logo.svg.png' },
  { id: 'sber', name: 'Сбербанк', color: '#21A038', logoText: 'С', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sberbank_Logo_2020.svg/512px-Sberbank_Logo_2020.svg.png' },
  { id: 'alfa', name: 'Альфа-Банк', color: '#EF3124', logoText: 'А', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Alfa-Bank_Logo.svg/512px-Alfa-Bank_Logo.svg.png' },
  { id: 'vtb', name: 'ВТБ', color: '#0A2896', logoText: 'В', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/VTB_Logo_2018.svg/512px-VTB_Logo_2018.svg.png' },
  { id: 'raif', name: 'Райффайзен', color: '#FEE600', logoText: 'Р', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Raiffeisen_Bank_International_logo.svg/512px-Raiffeisen_Bank_International_logo.svg.png' },
  { id: 'gazprom', name: 'Газпромбанк', color: '#00145A', logoText: 'Г', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gazprombank_logo.svg/512px-Gazprombank_logo.svg.png' },
  { id: 'ozon', name: 'Ozon Банк', color: '#005BFF', logoText: 'O', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Ozon_logo.svg/512px-Ozon_logo.svg.png' },
  { id: 'yandex', name: 'Яндекс Пэй', color: '#FFCC00', logoText: 'Я', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Yandex_logo.svg/512px-Yandex_logo.svg.png' },
  { id: 'halva', name: 'Халва', color: '#FF4B5F', logoText: 'Х', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Halva_logo.svg/512px-Halva_logo.svg.png' },
  { id: 'rosbank', name: 'Росбанк', color: '#000000', logoText: 'РБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Rosbank_logo.svg/512px-Rosbank_logo.svg.png' },
  { id: 'uralsib', name: 'Уралсиб', color: '#004B87', logoText: 'У', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Uralsib_logo.svg/512px-Uralsib_logo.svg.png' },
  { id: 'psb', name: 'ПСБ', color: '#E35F14', logoText: 'П', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/PSB_logo.svg/512px-PSB_logo.svg.png' },
  { id: 'otkritie', name: 'Открытие', color: '#00B4E6', logoText: 'О', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Otkritie_Bank_logo.svg/512px-Otkritie_Bank_logo.svg.png' },
  { id: 'rshb', name: 'Россельхозбанк', color: '#006B3D', logoText: 'РС', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/RSHB_logo.svg/512px-RSHB_logo.svg.png' },
  { id: 'mkb', name: 'МКБ', color: '#E3000F', logoText: 'М', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/MKB_logo.svg/512px-MKB_logo.svg.png' },
  { id: 'sovcom', name: 'Совкомбанк', color: '#0033A0', logoText: 'СВ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Sovcombank_logo.svg/512px-Sovcombank_logo.svg.png' },
  { id: 'pochta', name: 'Почта Банк', color: '#103A71', logoText: 'ПБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Pochta_Bank_logo.svg/512px-Pochta_Bank_logo.svg.png' },
  { id: 'mts', name: 'МТС Банк', color: '#E30611', logoText: 'МТ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/MTS_logo.svg/512px-MTS_logo.svg.png' },
  { id: 'rnkb', name: 'РНКБ', color: '#0055A5', logoText: 'РН', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RNKB_logo.svg/512px-RNKB_logo.svg.png' },
  { id: 'domrf', name: 'Банк ДОМ.РФ', color: '#00A19C', logoText: 'Д', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Dom.rf_logo.svg/512px-Dom.rf_logo.svg.png' },
  { id: 'ubrir', name: 'УБРиР', color: '#E3000F', logoText: 'УБ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/UBRIR_logo.svg/512px-UBRIR_logo.svg.png' },
  { id: 'rencredit', name: 'Ренессанс', color: '#FF4B5F', logoText: 'РК', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Renaissance_Credit_logo.svg/512px-Renaissance_Credit_logo.svg.png' },
  { id: 'otp', name: 'ОТП Банк', color: '#007A33', logoText: 'ОТ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/OTP_Bank_logo.svg/512px-OTP_Bank_logo.svg.png' },
  { id: 'avangard', name: 'Авангард', color: '#0033A0', logoText: 'АВ', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Avangard_Bank_logo.svg/512px-Avangard_Bank_logo.svg.png' },
  { id: 'bspb', name: 'Банк Санкт-Петербург', color: '#0033A0', logoText: 'БС', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bank_Saint_Petersburg_logo.svg/512px-Bank_Saint_Petersburg_logo.svg.png' },
];

export const COMMON_CATEGORIES = [
  'На все покупки',
  'Супермаркеты',
  'Аптеки',
  'Транспорт',
  'Такси',
  'Рестораны',
  'Фастфуд',
  'Одежда и обувь',
  'Электроника',
  'Дом и ремонт',
  'Автоуслуги',
  'АЗС',
  'Здоровье',
  'Красота',
  'Развлечения',
  'Образование',
  'Спорттовары',
  'Книги',
  'Животные',
  'Цветы',
  'Кино',
  'Маркетплейсы'
];

export const getBankDetails = (bankId: string, customName?: string): Bank | undefined => {
  if (bankId === 'custom' && customName) {
    return {
      id: 'custom',
      name: customName,
      color: '#64748b', // slate-500
      logoText: customName.charAt(0).toUpperCase()
    };
  }
  return BANKS.find(b => b.id === bankId);
};
