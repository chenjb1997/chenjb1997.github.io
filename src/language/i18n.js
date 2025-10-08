import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './en.json';
import translationZH from './zh.json';

const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  }
};

let lng = 'zh'
if(localStorage.getItem('language')){
  lng = localStorage.getItem('language')
} else {
  const language = navigator.language || navigator.userLanguage
  lng = language.startsWith('zh') ? 'zh' : 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: lng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;