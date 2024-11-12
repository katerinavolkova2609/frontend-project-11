import * as yup from 'yup';
// import onChange from 'on-change';
import watch from './view';
import i18next from 'i18next';
import resources from './locales/index';
import axios from 'axios';
import parse from './parser';
import { uniqId } from 'lodash';

export default () => {
  const state = {
    isValid: true,
    error: '',
    feeds: [],
  };
  const i18n = i18next.createInstance();

  i18n.init({
    lng: 'ru',
    debug: true,
    resources,
  });
  // .then(function (t) {
  //   // initialized and ready to go!
  //   //   document.getElementById('output').innerHTML = i18next.t('key');
  // });

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
      console.log(response);
      return response;
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
    validateSchema(state.feeds)
      .validate(inputValue)
      .then(() => {
        if (watchedState.error === '') {
          state.feeds.push(inputValue);
          console.log(state.feeds);
          getData(inputValue);
        }
      })
      .catch((e) => {
        const [err] = e.errors;
        watchedState.error = err;
      });
  });
};
