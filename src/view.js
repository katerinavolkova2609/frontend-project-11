import onChange from 'on-change';

export default (state) => {

  const watchedState = onChange(state, (path, value, previousValue) => {
    const inputEl = document.querySelector('#url-input');
    console.log(path, value, previousValue);
    if (path === 'error') {
      inputEl.classList.add('is-invalid');
      const feedbackEl = document.querySelector('.text-danger');
      feedbackEl.textContent = value;
    }
  });
  return watchedState;
};
