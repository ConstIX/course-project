import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import buttonTranslations from './translations/buttonTranslations'
import errorTranslations from './translations/errorTranslations'
import fieldTranslations from './translations/fieldTranslations'
import tableTranslations from './translations/tableTranslations'
import templateTranslations from './translations/templateTranslations'
import titleTranslations from './translations/titleTranslations'
import toasterTranslations from './translations/toasterTranslations'

const resources = {
  en: {
    title: titleTranslations.en,
    button: buttonTranslations.en,
    table: tableTranslations.en,
    field: fieldTranslations.en,
    toaster: toasterTranslations.en,
    error: errorTranslations.en,
    template: templateTranslations.en
  },
  ru: {
    title: titleTranslations.ru,
    button: buttonTranslations.ru,
    table: tableTranslations.ru,
    field: fieldTranslations.ru,
    toaster: toasterTranslations.ru,
    error: errorTranslations.ru,
    template: templateTranslations.ru
  },
  es: {
    title: titleTranslations.es,
    button: buttonTranslations.es,
    table: tableTranslations.es,
    field: fieldTranslations.es,
    toaster: toasterTranslations.es,
    error: errorTranslations.es,
    template: templateTranslations.es
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
