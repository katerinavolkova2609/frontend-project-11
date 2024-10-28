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

  i18next
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
    .then(function (t) {
      // initialized and ready to go!
    //   document.getElementById('output').innerHTML = i18next.t('key');
    });

  const doValidate = (links) => {
    const schema = yup.string().url().notOneOf(links);
    return schema;
  };

  const form = document.querySelector('form');
  const watchedState = watch(state);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    const answer = await doValidate(state.feeds).isValid(inputValue);
    console.log(answer);
    if (answer === false) {
      watchedState.isValid = false;
    } else {
      state.feeds.push(inputValue);
    }
    console.log(state.feeds);
  });
};
