import onChange from 'on-change';

export default (state) => {

  const watchedState = onChange(state, (path, value, previousValue) => {

    console.log(path, value, previousValue);
    if (path === 'error') {
      const inputEl = document.querySelector('#url-input');
      inputEl.classList.add('is-invalid');
      const feedbackEl = document.querySelector('.text-danger');
      feedbackEl.textContent = value;
    }
  });
  return watchedState;
};
