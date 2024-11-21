
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

const renderFeeds = (element, feeds) => {
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  element.append(list);
  feeds.map(({ title, description }) => {
    const liEl = document.createElement('li');
    const hEl = document.createElement('h3');
    const pEl = document.createElement('p');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    hEl.classList.add('h6', 'm-0');
    pEl.classList.add('m-0', 'small', 'text-black-50');
    hEl.textContent = title;
    pEl.textContent = description;
    liEl.append(hEl, pEl);
    list.append(liEl);
    return;
  });
};

const renderPosts = (element, posts) => {
  // console.log(posts);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  element.append(list);
  // console.log(posts);
  const liElements = posts.map((post) => {
    console.log(post);
    const { title } = post;
    // console.log(title);
    const liEl = document.createElement('li');
    liEl.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0'
    );
    const aEl = document.createElement('a');
    const buttonEl = document.createElement('a');
    liEl.append(aEl, buttonEl);
    aEl.outerHTML = `<a href="http://example.com/test/1731683520" class="fw-bold" data-id="24" target="_blank" rel="noopener noreferrer">${title}</a>`;
    buttonEl.outerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" data-id="24" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    list.append(liEl);
    return;
  });
};

export default (state, i18n) => {
  const watchedState = onChange(state, (path, value) => {
    // console.log(path, value);
    const inputEl = document.querySelector('#url-input');
    const feedbackEl = document.querySelector('.feedback');
    if (path === 'feeds') {
      feedsContainer.textContent = '';
      renderContainers(feedsContainer, 'Фиды');
      renderFeeds(feedsContainer, value);
    }
    if (path === 'posts') {
      inputEl.classList.remove('is-invalid');
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
      feedbackEl.textContent = i18n.t('successLoading');
      postsContainer.textContent = '';
      renderContainers(postsContainer, 'Посты');
      value.map((i) => renderPosts(postsContainer, i));
    }
    if (path === 'error') {
      inputEl.classList.add('is-invalid');
      feedbackEl.classList.add('text-danger');
      feedbackEl.textContent = value;
    }
  });

  return watchedState;
};
