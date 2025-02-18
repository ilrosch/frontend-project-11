import { uniqueId } from 'lodash';

export default (data, url) => {
  const parser = new DOMParser();
  const docRSS = parser.parseFromString(data, 'text/xml');

  const error = docRSS.querySelector('parsererror');
  if (error) {
    error.code = 'ERR_NORSS';
    throw error;
  }

  const feedTitleElement = docRSS.querySelector('channel > title');
  const feedTitle = feedTitleElement.textContent;
  const feedDescrElement = docRSS.querySelector('channel > description');
  const feedDescr = feedDescrElement.textContent;

  const feed = {
    title: feedTitle, descr: feedDescr, url, id: uniqueId(),
  };

  const feedItemElements = docRSS.querySelectorAll('item');
  const items = [...feedItemElements].map((element) => {
    const titleElement = element.querySelector('title');
    const title = titleElement.textContent;
    const descrElement = element.querySelector('description');
    const descr = descrElement.textContent;
    const linkElement = element.querySelector('link');
    const link = linkElement.textContent;
    return {
      title, descr, link, feedId: feed.id, id: uniqueId(),
    };
  });

  return { feed, posts: items };
};
