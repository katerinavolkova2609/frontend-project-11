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
const renderReadPosts = (idOfReadPosts) => {
  idOfReadPosts.forEach((id) => {
    const readPost = document.querySelector(`[data-id="${id}"]`);
    readPost.classList.remove('fw-bold');
    readPost.classList.add('fw-normal');
  });
};
const renderPosts = (element, posts, idOfReadPosts) => {
  console.log(idOfReadPosts);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  element.append(list);
  posts.map(({ title, id }) => {
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
    const buttonEl = document.createElement('button');
    liEl.append(aEl, buttonEl);
    const typeOfClass = idOfReadPosts.includes(id) ? 'fw-normal' : 'fw-bold';
    aEl.outerHTML = `<a href="http://example.com/test/1731683520" class="${typeOfClass}" data-id="${id}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    buttonEl.outerHTML = `<button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    list.append(liEl);
    return;
  });
};

const renderModal = (currentPost) => {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  modalTitle.textContent = currentPost.title;
  modalBody.textContent = currentPost.description;
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
      value.map((post) => renderPosts(postsContainer, post, state.viewedPosts));
    }
    if (path === 'currentPost') {
      renderModal(value);
    }
    if (path === 'error') {
      inputEl.classList.add('is-invalid');
      feedbackEl.classList.add('text-danger');
      feedbackEl.textContent = value;
    }
    if (path === 'viewedPosts') {
      renderReadPosts(value);
    }
  });
  return watchedState;
};
