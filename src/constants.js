export const FILE_EXTENSIONS = [
  '.exe',
  '.msi',
];

export const MIMETYPES = [
  'application/octet-stream',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-ms-dos-executable',
  'application/x-octet-stream',
  'application/download',
  'application/exe',
  'application/x-dosexec',
  'application/x-unknown',
  'application/x-msi',
  // 'application/x-ole-storage', // disabled because Firefox does not recognize this mimetype and it can be opened natively
  // 'application/windows-installer',
];

export const CANCEL_RESPONSE = { cancel: true };
export const EMPTY_OBJ = {};

export const POPUP_HEIGHT = 200 + 38;
export const POPUP_WIDTH = 500 + 14;
