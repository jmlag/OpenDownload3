import { parse } from './modules/content-disposition-header/content-disposition-header.browser.esm.js';
import mimeParse from './modules/whatwg-mimetype/parser.mjs';

import defaultConfig from './common/defaultConfig.js';
import {
  FILE_EXTENSIONS,
  MIMETYPES,
  CANCEL_RESPONSE,
  EMPTY_OBJ,
  POPUP_HEIGHT,
  POPUP_WIDTH,
} from './constants.js';

const {
  downloads,
  webRequest,
  windows,
  runtime,
  storage,
  tabs,
  management,
} = browser;

function addHeadersListener(listener) {
  if (!webRequest.onHeadersReceived.hasListener(listener)) {
    webRequest.onHeadersReceived.addListener(
      listener,
      { urls: ['<all_urls>'] },
      [
        'responseHeaders',
        'blocking',
      ],
    );
  }
}

function getFilenameFromPath(path, separator = '/') {
  // https://stackoverflow.com/a/53560218/4664330
  const { pathname } = new URL(path);
  const index = pathname.lastIndexOf(separator);
  return (index !== -1) ? pathname.substring(index + 1) : pathname;
}

function mimetypeEssence(mimetype) {
  const { type, subtype } = mimeParse(mimetype);
  return `${type}/${subtype}`;
}

function getFilename(responseHeaders, url) {
  let includedMimetype = null;
  const filenameFromUrl = getFilenameFromPath(url);
  const includedFiletype = FILE_EXTENSIONS.some((val) => filenameFromUrl.toLowerCase().endsWith(val));
  let filename;

  // if the file extension cannot be found in the url, look for it in the content-disposition header
  for (let i = 0; i < responseHeaders.length; i++) {
    const { name, value } = responseHeaders[i];
    if (name.toLowerCase() === 'content-type') {
      const respMimetype = mimetypeEssence(value);
      includedMimetype = MIMETYPES.some((mimetype) => mimetype === respMimetype);

      if (!includedMimetype) return null;
      if (includedFiletype) return filenameFromUrl;
      if (filename) return filename;
    } else if (!includedFiletype && name.toLowerCase() === 'content-disposition') {
      const { type, parameters } = parse(value);
      filename = FILE_EXTENSIONS.some((ext) => parameters?.filename.toLowerCase().endsWith(ext))
        ? parameters.filename : null;

      if (type !== 'attachment' || !filename) return null;
      if (includedMimetype) return filename;
    }
  }
  return null;
}

const getCenterOffset = (windowDim, windowOffset, popupDim) => Math.round((windowDim - popupDim) / 2) + windowOffset;

async function openPopup(downloadId, filename) {
  const { width, height, top, left } = await windows.get(windows.WINDOW_ID_CURRENT);
  const { id: windowId } = await windows.create({
    url: [
      `popup/popup.html?id=${downloadId}&filename=${filename}`,
    ],
    type: 'popup',
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
  });

  // top and left are currently ignored by Firefox in window.create() so we use windows.update() after creation
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/create#left
  windows.update(windowId, {
    top: Math.max(0, getCenterOffset(height, top, POPUP_HEIGHT)),
    left: Math.max(0, getCenterOffset(width, left, POPUP_WIDTH)),
  });
}

async function checkHeaders(resObj) {
  const { method, url, responseHeaders } = resObj;

  if (url && method === 'GET') {
    const filename = getFilename(responseHeaders, url);
    if (filename) {
      webRequest.onHeadersReceived.removeListener(checkHeaders);

      const decodedFilename = decodeURIComponent(filename);

      const { exeDir, showSaveAs } = (await storage.sync.get('config')).config || defaultConfig;
      const exeDirPath = `${exeDir ?? 'Temp/'}${exeDir ? '/' : ''}`;

      const downloadId = await downloads.download({
        url,
        filename: `${exeDirPath}${decodedFilename}`,
        saveAs: showSaveAs,
      }).catch((error) => {
        console.error('Error (OpenDownload3):', error.message);
        addHeadersListener(checkHeaders);
        if (error.message === 'Download canceled by the user') return CANCEL_RESPONSE;
        return EMPTY_OBJ;
      });

      const dlCompleteListener = (downloadDelta) => {
        const { id, state } = downloadDelta;
        if (id === downloadId && state?.current === 'complete') {
          openPopup(downloadId, filename);
          addHeadersListener(checkHeaders);
          downloads.onChanged.removeListener(dlCompleteListener);
        }
      };

      downloads.onChanged.addListener(dlCompleteListener);
      return CANCEL_RESPONSE;
    }
  }
  return EMPTY_OBJ;
}

async function initialize() {
  try {
    storage.sync.set({ config: defaultConfig });
    const { installType, homepageUrl } = await management.getSelf();
    if (installType !== 'development') {
      tabs.create({ url: `${homepageUrl}#setup-and-install` });
    }
  } catch (error) {
    console.error('Error initializing (OpenDownload3):', error.message, `\n${error.stack}`);
  }
}

runtime.onInstalled.addListener(initialize);
addHeadersListener(checkHeaders);
