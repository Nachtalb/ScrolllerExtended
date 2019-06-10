const URL = chrome.runtime.getURL('');

class HelpDialog {
    constructor() {
        this.createHelpMenu();
    }

    createHelpMenu() {
        if (this.helpPopup !== undefined)
            return;
        let container = document.createElement('div');
        let shadowRoot = container.attachShadow({mode: 'open'});

        let styles = document.createElement('link');
        styles.rel = 'stylesheet';
        styles.href = URL + 'assets/css/help-iframe.css';

        this.helpPopup = document.createElement('div');
        this.helpPopup.style.display = 'none';
        this.helpPopup.id = 'se-help-popup';

        let iframe = document.createElement('iframe');
        iframe.src = URL + 'assets/html/help-dialog.html';

        this.helpPopup.append(iframe);
        shadowRoot.append(styles);
        shadowRoot.append(this.helpPopup);
        document.getElementsByTagName('body')[0].append(container);
    }

    isShown() {
        return this.helpPopup.style.display === 'block'
    }

    hide() {
        this.helpPopup.style.display = 'none'
    }

    show() {
        this.helpPopup.style.display = 'block'
    }

    toggle() {
        if (this.isShown())
            this.hide();
        else
            this.show();
    }
}

class ScrolllerExtended {
    constructor() {
        this.IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        this.helpDialog = new HelpDialog();

        document.addEventListener('keydown', this.keyPressed);
        document.addEventListener('click', this.clicked);
    }

    controlKeyPressed(event) {
        if (this.IS_MAC)
            return event.metaKey;
        else
            return event.ctrlKey;
    }

    keyPressed(event) {
        self = window.scrolller_extended;

        switch (event.key) {
            case 'c':
                self.saveCurrentImage();
                break;
            case 'h':
                self.helpDialog.toggle();
                break;
            case 's':
                if (self.controlKeyPressed(event)) {
                    event.preventDefault();
                    self.saveCurrentImage();
                }
                break;
        }
    }

    clicked(event) {
        self = window.scrolller_extended;

        if (self.helpDialog.isShown())
            self.helpDialog.hide();
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

window.scrolller_extended = new ScrolllerExtended();
