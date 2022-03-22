// based on: https://github.com/mdn/webextensions-examples/tree/master/latest-download
const { downloads } = browser;

function updateIconUrl(iconUrl) {
  document.getElementById('icon').setAttribute('src', iconUrl);
}

function deleteItem(downloadId) {
  if (!document.getElementById('delete').classList.contains('disabled')) {
    downloads.removeFile(downloadId).then(() => {
      downloads.erase({ id: downloadId });
    }).catch((error) => {
      console.error('Error deleting file (OpenDownload3):', error.message, `\n${error.stack}`);
    });
    window.close();
  }
}

function openItem(downloadId) {
  if (!document.getElementById('open').classList.contains('disabled')) {
    downloads.open(downloadId).then(window.close).catch((error) => {
      console.error('Error opening file (OpenDownload3):', error.message, `\n${error.stack}`);
    });
  }
}

function dontOpen() {
  if (!document.getElementById('dont-open').classList.contains('disabled')) {
    window.close();
  }
}

function showFolder(downloadId) {
  if (!document.getElementById('show-folder').classList.contains('disabled')) {
    downloads.show(downloadId).then(window.close).catch((error) => {
      console.error('Error opening folder (OpenDownload3):', error.message, `\n${error.stack}`);
    });
  }
}

function initializeLatestDownload(searchParams) {
  const downloadId = parseInt(searchParams.get('id'), 10);
  const filename = decodeURIComponent(searchParams.get('filename'));

  document.getElementById('url').textContent = filename;
  downloads.getFileIcon(downloadId).then(updateIconUrl, (error) => {
    console.error('Error getting file icon (OpenDownload3):', error.message, `\n${error.stack}`);
  });

  document.getElementById('open').classList.remove('disabled');
  document.getElementById('delete').classList.remove('disabled');
  document.getElementById('dont-open').classList.remove('disabled');
  document.getElementById('show-folder').classList.remove('disabled');

  document.getElementById('open').addEventListener('click', () => { openItem(downloadId); });
  document.getElementById('delete').addEventListener('click', () => { deleteItem(downloadId); });
  document.getElementById('dont-open').addEventListener('click', dontOpen);
  document.getElementById('show-folder').addEventListener('click', () => { showFolder(downloadId); });
}

initializeLatestDownload(new URLSearchParams(window.location.search));
