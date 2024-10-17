import * as yup from 'yup';
import onChange from 'on-change';

export default () => {
  const state = {
    isValid: true,
    feed: '',
  };

  let schema = yup.object().shape({
    website: yup.string().url(),
  });

  const form = document.querySelector('form');
  const inputEl = document.querySelector('.url-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
  })
};
