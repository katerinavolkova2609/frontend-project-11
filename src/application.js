import * as yup from 'yup';
// import onChange from 'on-change';
import watch from './view';
import i18next from 'i18next';
import resources from './locales/index';
import axios, { AxiosError } from 'axios';
import parse from './parser';
import { uniqId } from 'lodash';

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
            console.log(feeds);
            console.log(posts);
            state.url.push(inputValue);
            state.feeds.push(feeds);
            state.posts.push(posts);     
            watchedState.feeds = feeds;
            watchedState.posts = posts;
          })
          .catch((e) => {
            if (e.message === 'parse error') {
              watchedState.error = i18n.t('error.validation.notContainRSS');
            } else watchedState.error = i18n.t('error.networkError');
          });
      })
      .catch((e) => {
        const [err] = e.errors;
        watchedState.error = err;
      });

  });
};
