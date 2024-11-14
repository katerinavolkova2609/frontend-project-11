import onChange from 'on-change';

const renderFeeds = () => {
  const feedsContainer = document.querySelector('.feeds');
  const divEl = document.createElement('div');
  divEl.classList.add('card', 'border-0');
  feedsContainer.append(divEl);
  const divForTitle = document.createElement('div');
  divForTitle.classList.add('card-body');
  divEl.append(divForTitle);
  const titleEl = document.createElement('h2');
  titleEl.classList.add('card-title', 'h4');
  divForTitle.append(titleEl);
  titleEl.textContent = 'Фиды';
};

const renderPosts = () => {
  const postsContainer = document.querySelector('.posts');
  const divEl = document.createElement('div');
  divEl.classList.add('card', 'border-0');
  postsContainer.append(divEl);
  const divForTitle = document.createElement('div');
  divForTitle.classList.add('card-body');
  divEl.append(divForTitle);
  const titleEl = document.createElement('h2');
  titleEl.classList.add('card-title', 'h4');
  divForTitle.append(titleEl);
  titleEl.textContent = 'Посты';
};

export default (state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    console.log(path, value, previousValue);
    if (path === 'feeds') {
      renderFeeds();
      renderPosts();
    }

    if (path === 'error') {
      const inputEl = document.querySelector('#url-input');
      inputEl.classList.add('is-invalid');
      const feedbackEl = document.querySelector('.text-danger');
      feedbackEl.textContent = value;
    }
  });

  return watchedState;
};
