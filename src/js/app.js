import * as yup from 'yup';
import watcher from './watcher.js';
import locales from './locales/index.js';

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

  const watchedState = watcher(elements, state);

  yup.setLocale(locales);

  const validate = (value, feeds) => {
    const urls = feeds.map(({ url }) => url);
    const schema = yup.string().url().required().notOneOf(urls);
    return schema.validate(value)
      .then(() => null)
      .catch((err) => err.message);
  };

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
            error: err,
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
