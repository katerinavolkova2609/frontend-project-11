import * as yup from 'yup';
import onChange from 'on-change';

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
  const inputEl = document.querySelector('#url-input');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    const answer = await doValidate(state.feeds).validate(inputValue);
    console.log(answer);
    // state.source.push(inputValue);
  });
};
