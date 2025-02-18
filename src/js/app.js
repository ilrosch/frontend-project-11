import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';

import resources from './locales/index.js';
import watcher from './watcher.js';
import locales from './locales/locale.js';
import rssParser from './rssParser.js';

const proxy = 'https://allorigins.hexlet.app/';

const addProxy = (url) => {
  const urlWidthProxy = new URL('/get', proxy);
  urlWidthProxy.searchParams.set('disableCache', true);
  urlWidthProxy.searchParams.set('url', url);
  return urlWidthProxy.toString();
};

const getRSS = (state, url) => {
  const urlWidthProxy = addProxy(url);
  return axios.get(urlWidthProxy)
    .then((response) => {
      const { feed, posts } = rssParser(response.data.contents, url);
      state.feeds.unshift(feed);
      state.posts.unshift(...posts);
    })
    .catch((err) => {
      let errorKey;
      switch (err.code) {
        case 'ERR_NETWORK':
          errorKey = 'errors.network';
          break;
        case 'ERR_NORSS':
          errorKey = 'errors.no_rss';
          break;
        default:
          console.log(err);
          errorKey = 'errors.unknow';
      }
      throw errorKey;
    });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
    feedsBox: document.querySelector('.feeds'),
    postsBox: document.querySelector('.posts'),
  };

  const state = {
    form: {
      status: 'filling',
      valid: true,
      error: null,
    },
    feeds: [],
    posts: [],
    ui: {
      seenPosts: new Set(),
      modal: {
        postId: null,
      },
    },
  };

  const i18nInstance = i18next.createInstance();
  const promise = i18nInstance.init({
    lng: 'ru',
    resources,
  })
    .then(() => {
      document.querySelectorAll('[data-i18n]').forEach((element) => {
        element.textContent = i18nInstance.t(element.dataset.i18n);
      });
      elements.input.setAttribute('placeholder', i18nInstance.t('form.label'));
    })
    .then(() => {
      yup.setLocale(locales);

      const validateUrl = (value, feeds) => {
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

        validateUrl(value, watchedState.feeds)
          .then((err) => {
            if (err) { throw err; }
          })
          .then(() => getRSS(watchedState, value))
          .then(() => {
            watchedState.form = {
              status: 'success',
              valid: true,
              error: null,
            };
          })
          .then(() => {
            watchedState.form.status = 'filling';
          })
          .catch((err) => {
            watchedState.form = {
              status: 'filling',
              valid: false,
              error: err,
            };
          });
      });

      elements.postsBox.addEventListener('click', (e) => {
        if (e.target.dataset.id) {
          const { id } = e.target.dataset;
          watchedState.ui.modal.postId = id;
          watchedState.ui.seenPosts.add(id);
        }
      });
    });

  return promise;
};
