/* * * * * *
 * Keymap  *
 * * * * * *
 *
 * CTRL-s / CMD-s / c: Save current media in slideshow to DownloadDir/scrolller/SubReddit - MediaID.ext
 */

class ScrolllerExtended {
    constructor() {
        this.IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        document.addEventListener('keydown', this.keyPressed);
    }

    controlKeyPressed(event) {
        if (this.IS_MAC)
            return event.metaKey;
        else
            return event.ctrlKey;
    }

    keyPressed(event) {
        self = window.scroller_extended;

        switch (event.key) {
            case 'c':
                self.saveCurrentImage();
                break;
            case 's':
                if (self.controlKeyPressed(event)) {
                    event.preventDefault();
                    self.saveCurrentImage();
                }
                break;
        }

    }

    getInfoFromSlideshowItem(item) {
        let image = item.querySelector('.fill-size[style=""] img');
        let subReddit = item.querySelector('.text');
        let subRedditItemLink = subReddit.querySelector('.external-link a').href;

        return {
            'src': image.src,
            'filename': image.src.split('/').reverse()[0],
            'subReddit': subReddit.querySelector('a').innerText,
            'subRedditLink': subRedditItemLink,
            'subRedditItemLink': subRedditItemLink.split('/', 5).join('/'),
        }
    }

    downloadSlideshowImages(item) {
        let image_info = this.getInfoFromSlideshowItem(item);
        chrome.runtime.sendMessage(chrome.runtime.id, {
            'task': 'download',
            'download': image_info.src,
            'filename': image_info.subReddit + ' - ' + image_info.filename,
        })

    }

    saveCurrentImage() {
        let current = document.getElementsByClassName('media-element slideshow')[0];
        if (current !== undefined)
            this.downloadSlideshowImages(current)
    }
}

window.scroller_extended = new ScrolllerExtended();
