import * as yup from 'yup';
// import onChange from 'on-change';
import watch from './view';
import i18next from 'i18next';
import resources from './locales/index';
import axios, { AxiosError } from 'axios';
import parse from './parser';
import { uniqueId } from 'lodash';

export default () => {
  const state = {
    error: '',
    url: [],
    feeds: [],
    posts: [],
  };
  const i18n = i18next.createInstance();

  i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  yup.setLocale({
    mixed: {
      notOneOf: i18n.t('error.validation.uniqURL'),
    },
    string: {
      url: i18n.t('error.validation.invalidURL'),
    },
  });

  const makeProxyURL = (link) =>
    `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`;

  const getData = (link) =>
    axios.get(makeProxyURL(link)).then((response) => {
      const parsedData = parse(response.data.contents);
      return parsedData;
    });

  const validateSchema = (links) => {
    const schema = yup.string().url().notOneOf(links);
    return schema;
  };

  const form = document.querySelector('form');
  const watchedState = watch(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    validateSchema(state.url)
      .validate(inputValue)
      .then(() => {
        getData(inputValue)
          .then((response) => {
            const { feeds, posts } = response;
            state.url.push(inputValue);
            posts.map((item) => {
              item['id'] = uniqueId();
            });
            state.feeds.unshift(feeds);
            state.posts.unshift(posts);
            watchedState.feeds = [...state.feeds];
            watchedState.posts = [...state.posts];
          })
          .catch((e) => {
            if (e.message === 'parse error') {
              watchedState.error = i18n.t('error.validation.notContainRSS');
            }
            if (e instanceof AxiosError) {
              watchedState.error = i18n.t('error.networkError');
            }
          });
      })
      .catch((e) => {
        const [err] = e.errors;
        watchedState.error = err;
      });
  });
};
