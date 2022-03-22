import defaultConfig, { configIdMap } from '../common/defaultConfig.js';

const { storage, management } = browser;

const UNSAVED_MSG = 'Changes unsaved';
const SAVED_MSG = 'Changes saved!';

let savedConfig;

const trimPath = (path) => path.trim().replace(/^\/*|\/*$/g, '');

function updateConfigDisplay({ exeDir, showSaveAs }) {
  document.getElementById('curr-exe-dir').textContent = `${exeDir}${exeDir && '/'}`;
  document.getElementById('exe-dir').value = exeDir;
  document.getElementById('show-save-as').checked = showSaveAs;
}

function showUnsavedMsg() {
  document.getElementById('is-saved').textContent = UNSAVED_MSG;
}

function clearUnsavedMsg() {
  document.getElementById('is-saved').textContent = '';
}

async function setConfig(config) {
  const errorTag = document.getElementById('error');
  try {
    await storage.sync.set({ config });
    savedConfig = config;
    document.getElementById('is-saved').textContent = SAVED_MSG;
    errorTag.textContent = '';
  } catch (error) {
    console.error('Error saving config (OpenDownload3):', error.message, `\n${error.stack}`);
    errorTag.textContent = error.message;
  }
}

function saveOptions(e) {
  const exeDir = trimPath(document.getElementById('exe-dir').value);
  const showSaveAs = document.getElementById('show-save-as').checked;
  const config = { exeDir, showSaveAs };
  setConfig(config);
  updateConfigDisplay(config);
  e.preventDefault();
}

async function populateOptionsPage() {
  clearUnsavedMsg();

  const { config } = (await storage.sync.get('config'));
  let missingConfigValue = false;

  if (config) {
    Object.entries(defaultConfig).forEach(([key, value]) => {
      if (config[key] === void 0) { // eslint-disable-line no-void
        missingConfigValue = true;
        config[key] = value;
      }
    });

    if (missingConfigValue) {
      setConfig(config);
    }
  } else {
    setConfig(defaultConfig);
  }

  savedConfig = config || defaultConfig;
  updateConfigDisplay(savedConfig);
}

function formChanged(e) {
  if (
    (e.target.type === 'checkbox' ? e.target.checked : trimPath(e.target.value))
    !== savedConfig[configIdMap[e.target.id]]
  ) {
    showUnsavedMsg();
  } else {
    clearUnsavedMsg();
  }
}

management.getSelf().then(({ homepageUrl }) => {
  document.getElementById('help').href = `${homepageUrl}#readme`;
});
document.addEventListener('DOMContentLoaded', populateOptionsPage);
document.addEventListener('blur', () => {
  if (document.getElementById('is-saved').textContent === 'Changes saved!') {
    clearUnsavedMsg();
  }
});
Array.from(document.getElementsByClassName('config-inputs')).forEach((formField) => {
  formField.addEventListener('input', formChanged);
});
document.querySelector('form').addEventListener('submit', saveOptions);
