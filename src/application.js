import axios, { AxiosError } from 'axios';
import * as yup from 'yup';
import { uniqueId } from 'lodash';
import i18next from 'i18next';
import resources from './locales/index.js';
import watch from './view.js';
import parse from './parser.js';

export default () => {
  const state = {
    error: '',
    urls: [],
    feeds: [],
    posts: [],
    currentPost: '',
    viewedPosts: [],
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

  const makeProxyURL = (link) => `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`;

  const getData = (link) => axios.get(makeProxyURL(link))
    .then((response) => parse(response.data.contents));

  const validateSchema = (links) => {
    const schema = yup.string().url().notOneOf(links);
    return schema;
  };

  const form = document.querySelector('form');
  const containerWithPosts = document.querySelector('.posts');
  const watchedState = watch(state, i18n);

  const errorHandler = (err) => {
    if (err.message === 'parse error') {
      watchedState.error = i18n.t('error.validation.notContainRSS');
    }
    if (err instanceof AxiosError) {
      watchedState.error = i18n.t('error.networkError');
    }
  };

  const setId = (posts) => posts.map((post) => ({ ...post, id: uniqueId() }));

  const updatePosts = (delay = 5000) => {
    setTimeout(() => {
      const promises = state.urls.map((url) => {
        getData(url).then((response) => {
          const newPosts = response.posts;
          const oldTitles = state.posts.flat().map((post) => post.title);
          const filteredPosts = newPosts.filter(
            ({ title }) => !oldTitles.includes(title),
          );
          const newPostWithId = setId(filteredPosts);
          state.posts.unshift(newPostWithId);
          watchedState.posts = [...state.posts];
          watchedState.error = state.error;
        })
          .catch((err) => errorHandler(err));
        return;
      });
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
            const { feed, posts } = response;
            state.urls.push(inputValue);
            const postsWithId = setId(posts);
            state.feeds.unshift(feed);
            state.posts.unshift(postsWithId);
            watchedState.feeds = [...state.feeds];
            watchedState.posts = [...state.posts];
          })
          .catch((err) => errorHandler(err));
      })
      .catch((error) => {
        const [err] = error.errors;
        watchedState.error = err;
        state.error = err;
      });
  });

  containerWithPosts.addEventListener('click', (e) => {
    if (e.target.dataset.id) {
      const [currentPost] = state.posts
        .flat()
        .filter((post) => post.id === e.target.dataset.id);
      watchedState.currentPost = currentPost;
      state.viewedPosts.push(currentPost.id);
      watchedState.viewedPosts = [...state.viewedPosts];
    }
  });

  updatePosts();
};
