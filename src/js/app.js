import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import watcher from './watcher.js';
import locales from './locales/locale.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      status: 'filling',
      valid: true,
      error: null,
    },
    feeds: [],
  };

  const i18nInstance = i18next.createInstance();
  const promise = i18nInstance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = i18nInstance.t(element.dataset.i18n);
    });
    elements.input.setAttribute('placeholder', i18nInstance.t('form.label'));
  });

  Promise.all([promise]);

  yup.setLocale(locales);

  const validate = (value, feeds) => {
    const urls = feeds.map(({ url }) => url);
    const schema = yup.string().url().required().notOneOf(urls);
    return schema.validate(value)
      .then(() => null)
      .catch((err) => err.message.key);
  };

  const watchedState = watcher(elements, state, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const value = formData.get('url').trim();

    watchedState.form.status = 'sending';

    validate(value, watchedState.feeds)
      .then((err) => {
        if (err) {
          watchedState.form = {
            status: 'filling',
            valid: false,
            error: i18nInstance.t(err),
          };
        } else {
          watchedState.feeds.push({ url: value });
          watchedState.form.status = 'success';
          watchedState.form = {
            status: 'filling',
            valid: true,
            error: null,
          };
        }
      });
  });
};
