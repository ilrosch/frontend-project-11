import onChange from 'on-change';

const handleMessage = (elements, state, i18n) => {
  const { input, feedback } = elements;
  const { error } = state.form;
  input.classList.toggle('is-invalid', error);
  feedback.classList.toggle('text-danger', error);
  feedback.classList.toggle('text-success', !error);
  feedback.textContent = i18n.t(error) || i18n.t('successes.load_rss');
};

const handleForm = (elements, state) => {
  const { status } = state.form;
  const { form, input, button } = elements;

  const mapping = {
    filling: () => {
      input.disabled = false;
      button.disabled = false;
      input.focus();
    },
    sending: () => {
      input.disabled = true;
      button.disabled = true;
    },
    success: () => {
      form.reset();
    },
  };

  return mapping[status]();
};

const handleFeeds = (elements, state, i18n) => {
  const { feedsBox } = elements;

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('title', 'h4');
  title.textContent = i18n.t('feeds');
  cardBody.append(title);
  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  const items = state.feeds.map((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h = document.createElement('h3');
    h.classList.add('h6', 'm-0');
    h.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.descr;
    li.append(h, p);
    return li;
  });
  list.append(...items);
  card.append(cardBody, list);
  feedsBox.innerHTML = '';
  feedsBox.append(card);
};

const handlePosts = (elements, state, i18n) => {
  const { postsBox } = elements;
  const { posts, ui } = state;

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('title', 'h4');
  title.textContent = i18n.t('posts');
  cardBody.append(title);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');
  const items = posts.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    const classes = ui.seenPosts.has(post.id) ? ['fw-bold', 'link-secondary'] : ['fw-bold'];
    a.classList.add(...classes);
    a.setAttribute('href', post.link);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('button_view');

    li.append(a, button);
    return li;
  });

  list.append(...items);
  card.append(cardBody, list);
  postsBox.innerHTML = '';
  postsBox.append(card);
};

const handleModal = (state) => {
  console.log(state.ui.modal.postId);
  const post = state.posts.find(({ id }) => id === state.ui.modal.postId);
  const title = document.querySelector('.modal-title');
  title.textContent = post.title;
  const descr = document.querySelector('.modal-body');
  descr.textContent = post.descr;
  const link = document.querySelector('.modal-footer > a');
  link.setAttribute('href', post.link);
};

export default (elements, state, i18n) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.status':
      case 'form':
        handleForm(elements, state);
        handleMessage(elements, state, i18n);
        break;
      case 'feeds':
        handleFeeds(elements, state, i18n);
        break;
      case 'posts':
      case 'ui.seenPosts':
        handlePosts(elements, state, i18n);
        break;
      case 'ui.modal.postId':
        handleModal(state);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
