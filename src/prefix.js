let styleDom;
const key = window.location.origin;

chrome.storage.sync.get([key], (result = {}) => {
  const data = result[key] || {};

  run(data);
});

function getDom() {
  if (!styleDom) {
    styleDom = document.createElement('style');
    document.head.appendChild(styleDom);
  }

  return styleDom;
}

function addStyle(style) {
  const dom = getDom();

  dom.innerHTML = style;
}

function removeStyle() {
  const dom = getDom();

  dom.innerHTML = '';
}

function run(data = {}) {
  const { enable, style } = data;

  enable ? addStyle(style) : removeStyle();
  style && chrome.storage.sync.set({ key: style });
}

chrome.runtime.onMessage.addListener((data = {}) => run(data));