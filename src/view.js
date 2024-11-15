import onChange from 'on-change';

const feedsContainer = document.querySelector('.feeds');
const postsContainer = document.querySelector('.posts');

const renderContainers = (element, text) => {
  const divEl = document.createElement('div');
  divEl.classList.add('card', 'border-0');
  element.append(divEl);
  const divForTitle = document.createElement('div');
  divForTitle.classList.add('card-body');
  divEl.append(divForTitle);
  const titleEl = document.createElement('h2');
  titleEl.classList.add('card-title', 'h4');
  divForTitle.append(titleEl);
  titleEl.textContent = text;
};

const renderFeeds = () => {
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  // list.innerHTML = ''
};

const renderPosts = () => {
};

export default (state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    console.log(path, value, previousValue);
    if (path === 'feeds') {
      renderContainers(feedsContainer, 'Фиды');
      renderContainers(postsContainer, 'Посты');
      // renderFeeds();
      // renderPosts();
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
