const DOWNLOAD_DIR = 'scrolller/';

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.task === 'download') {
        chrome.downloads.download({
            url: message.download,
            filename: DOWNLOAD_DIR + message.filename
        });
    }
});
