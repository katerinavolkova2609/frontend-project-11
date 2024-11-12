export default (stringContainingRSS) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(
    stringContainingRSS,
    'application/xml'
  );
  console.log(content);
  if (content.querySelector('parsererror')) {
    throw new Error('parse error');
  }
  const rootEl = content.querySelector('channel');
  const mainTitle = rootEl.querySelector('title').textContent;
  const mainFeedDescription = rootEl.querySelector('description').textContent;

  const items = Array.from(rootEl.querySelectorAll('item'));
  const posts = items.map((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    return { title, description };
  });

  return {
    feeds: { title: mainTitle, description: mainFeedDescription },
    posts: posts,
  };
};
