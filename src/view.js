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

const renderFeeds = (element, titles, description) => {
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  element.append(list);
  const liEl = document.createElement('li');
  const hEl = document.createElement('h3');
  const pEl = document.createElement('p');
  liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
  hEl.classList.add('h6', 'm-0');
  pEl.classList.add('m-0', 'small', 'text-black-50');
  list.append(liEl);
  liEl.append(hEl, pEl);
  hEl.textContent = titles;
  pEl.textContent = description;
};

const renderPosts = () => {
};

export default (state) => {
  const watchedState = onChange(state, (path, value, previousValue) => {
    console.log(path, value, previousValue);
    if (path === 'feeds') {
      renderContainers(feedsContainer, 'Фиды');
      renderContainers(postsContainer, 'Посты');
      renderFeeds(feedsContainer, value.title, value.description);
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
