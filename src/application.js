import * as yup from 'yup';
import onChange from 'on-change';
import watch from './view';
import i18next from 'i18next';
import resources from './locales/index';

export default () => {
  const state = {
    isValid: true,
    errors: [],
    feeds: [],
  };
  const i18n = i18next.createInstance();

  i18n
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
    .then(function (t) {
      // initialized and ready to go!
      //   document.getElementById('output').innerHTML = i18next.t('key');
    });
  yup.setLocale({
    mixed: {
      notOneOf: i18n.t('errors.validation.uniqURL'),
    },
    string: {
      url: i18n.t('errors.validation.invalidURL'),

    },

  });
  const validateSchema = (links) => {
    const schema = yup.string().url().notOneOf(links);
    return schema;
  };

  const form = document.querySelector('form');
  const watchedState = watch(state);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    await validateSchema(state.feeds)
      .validate(inputValue)
      .catch((e) => {
        watchedState.isValid = false;
        console.log(e.errors);
      });
    // console.log(answer);
    // if (answer === false) {
    //   watchedState.isValid = false;
    // } else {
    if (watchedState.isValid !== false) {
      state.feeds.push(inputValue);
    }
    // }
    console.log(state.feeds);
  });
};
