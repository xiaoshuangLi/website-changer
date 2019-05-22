let tabId = '';
let key;
let rootData = { enable: true };

const btn = document.getElementById('btn');
const textarea = document.getElementById('textarea');

btn.addEventListener('click', () => {
  const { enable } = rootData;

  setData({ enable: !enable });
});

textarea.addEventListener('change', () => {
  setData({ style: textarea.value });
});

textarea.addEventListener('mouseout', () => {
  setData({ style: textarea.value });
});

function update(data = {}) {
  rootData = Object.assign({}, rootData, data);

  const { enable, style = '' } = rootData;

  btn.innerHTML = enable ? '已启用' : '已禁用';

  if (textarea.value !== style) {
    textarea.value = style;
  }
};

function setData(obj = {}) {
  const data = Object.assign({}, rootData, obj);

  sendData(data, () => update(data));
}

function sendData(data, cb) {
  chrome.storage.sync.set({ [key]: data }, (result) => {
    chrome.tabs.sendMessage(tabId, data, cb);
  });
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  const [activeTab = {}] = tabs;
  const { id, url } = activeTab;

  tabId = id;
  key = url.split('/').slice(0, 3).join('/')

  chrome.storage.sync.get([key], (result) => {
    const data = result[key] || {};

    update(data);
  });
});
