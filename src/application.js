import * as yup from 'yup';
// import onChange from 'on-change';
import watch from './view';
import i18next from 'i18next';
import resources from './locales/index';
import axios, { AxiosError } from 'axios';
import parse from './parser';
import { uniqueId } from 'lodash';

export default async () => {
  const state = {
    error: '',
    urls: [],
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
  const watchedState = watch(state, i18n);

  const errorHandler = (err) => {
    if (err.message === 'parse error') {
      watchedState.error = i18n.t('error.validation.notContainRSS');
    }
    if (err instanceof AxiosError) {
      watchedState.error = i18n.t('error.networkError');
    }
  };

  const getId = (posts) => posts.map((post) => ({...post, id: uniqueId()}));

  const updatePosts = (delay = 5000) => {
    setTimeout(() => {
      const promises = state.urls.map((url) =>
        getData(url)
          .then((response) => {
            const newPosts = response.posts;
            const oldTitles = state.posts.flat().map((post) => post.title);
            const filteredPosts = newPosts.filter(
              ({ title }) => !oldTitles.includes(title)
            );
            const newPostWithId = getId(filteredPosts);
            state.posts.unshift(newPostWithId);
            watchedState.posts = [...state.posts];
          })
          .catch((err) => errorHandler(err))
      );
      Promise.all(promises).finally(() => updatePosts());
    }, delay);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    validateSchema(state.urls)
      .validate(inputValue)
      .then(() => {
        getData(inputValue)
          .then((response) => {
            const { feeds, posts } = response;
            state.urls.push(inputValue);
            const postsWithId = getId(posts);
            state.feeds.unshift(feeds);
            state.posts.unshift(postsWithId);
            watchedState.feeds = [...state.feeds];
            watchedState.posts = [...state.posts];
          })
          .catch((err) => errorHandler(err));
      })
      .catch((e) => {
        const [err] = e.errors;
        watchedState.error = err;
      });
  });
  updatePosts();
};
