import onChange from 'on-change';

export default (state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    const inputEl = document.querySelector('#url-input');
    if (value === false) {
      inputEl.classList.add('is-invalid');
    }
  });
  return watchedState;
};
