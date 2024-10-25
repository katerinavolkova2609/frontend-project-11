import * as yup from 'yup';
import onChange from 'on-change';
import watch from './view';

export default () => {
  const state = {
    isValid: true,
    errors: [],
    feeds: [],
  };

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
