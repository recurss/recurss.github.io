// @ts-check
"use strict";

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(onPageReady, 0);
} else {
    document.addEventListener('DOMContentLoaded', onPageReady, true);
}

function onPageReady() {
    const DEFAULT_SPEED = 100;
    const DEFAULT_MAX = 500;
    const DEFAULT_START = 1;

    const pageSettings = /** @type {HTMLDivElement} */ (document.querySelector('#page-settings'));

    const defaultStart = !isNaN(+pageSettings.dataset.start) ? +pageSettings.dataset.start : DEFAULT_START;
    const maxCount = pageSettings.dataset.max && !isNaN(+pageSettings.dataset.max) ? +pageSettings.dataset.max : DEFAULT_MAX;
    const autoplay = pageSettings.dataset.autoplay;
    const speed = pageSettings.dataset.speed && !isNaN(+pageSettings.dataset.speed) ? +pageSettings.dataset.speed : DEFAULT_SPEED;

    // UI
    class IncreaseButton {
        constructor() {
            this._button = /** @type {HTMLButtonElement} */ (document.querySelector('.increase-button'));

            this._button.addEventListener('click', () => {
                increaseCount()
            });
        }

        set value(value) {
            this._button.disabled = value >= maxCount;
        }
    }

    class DecreaseButton {
        constructor() {
            this._button = /** @type {HTMLButtonElement} */ (document.querySelector('.decrease-button'));

            this._button.addEventListener('click', () => {
                decreaseCount()
            });
        }

        set value(value) {
            this._button.disabled = value <= 1;
        }
    }

    class PlayButton {
        constructor() {
            this._button = /** @type {HTMLButtonElement} */ (document.querySelector('.play-button'));

            this._playing = false;

            this._button.addEventListener('click', () => {
                setPlay(!this._playing);
            });
        }

        set playing(value) {
            this._playing = value;
            if (value) {
                this._button.classList.add('active')
            } else {
                this._button.classList.remove('active')
            }
        }
    }

    class CountSlider {
        constructor(/** @type {number} */ currentCount) {
            this._container = document.querySelector('.count-slider');

            this._slider = document.createElement('input');
            this._slider.className = 'count-slider';
            this._slider.type = 'range';
            this._slider.min = '1';
            this._slider.max = `${maxCount}`;
            this._slider.value = `${currentCount}`;
            this._container.appendChild(this._slider);
            this._slider.addEventListener('input', e => {
                setDivs(e.target.value)
            });
            this._slider.addEventListener('change', e => {
                setDivs(e.target.value)
            });

            this._value = document.createElement('span');
            this._value.className = 'current-count';
            this._value.textContent = '' + currentCount;
            this._container.appendChild(this._value);
        }

        set value(/** @type {number} */ value) {
            this._value.textContent = '' + value;
            this._slider.value = '' + value;
        }
    }

    class Controls {
        constructor(/** @type {number} */ currentCount) {
            this._slider = new CountSlider(currentCount);
            this._increaseButton = new IncreaseButton();
            this._decreaseButton = new DecreaseButton();
            this._playButton = new PlayButton();
        }

        set value(/** @type {number} */ value) {
            this._slider.value = value;
            this._increaseButton.value = value;
            this._decreaseButton.value = value;
        }

        set playing(/** @type {boolean} */ value) {
            this._playButton.playing = value;
        }
    };


    // State
    let animationInterval;
    let playing = false;
    let currentCount = defaultStart;
    const controls = new Controls(currentCount);

    const iframe = /** @type {HTMLIFrameElement} */ (document.getElementById('content-iframe'));
    if (iframe.contentDocument.readyState === 'complete' || iframe.contentDocument.readyState === 'interactive') {
         setTimeout(onReady, 0);
    } else {
        iframe.contentDocument.addEventListener('DOMContentLoaded', onReady, true);
    }

    function onReady() {
        if (!iframe.contentDocument || !iframe.contentDocument.body) {
            setTimeout(onReady, 50);
            return;
        }
        
        setDivs(currentCount, true);
        setPlay(autoplay, defaultStart);
    }

    function setPlay(shouldPlay, initialValue) {
        clearInterval(animationInterval);
        if (shouldPlay) {
            setDivs(initialValue || 1, true);
            animationInterval = setInterval(() => {
                if (currentCount < maxCount) {
                    setDivs(currentCount + 1, true);
                } else {
                    clearInterval(animationInterval);
                    controls.playing = false;
                }
            }, speed);
        }

        playing = shouldPlay
        controls.playing = shouldPlay;
    }

    function increaseCount() {
        const count = updateState(currentCount + 1)
        setPlay(false);

        const body = iframe.contentDocument.body;
        const newDiv = document.createElement('div');
        newDiv.appendChild(body.children[0]);
        body.appendChild(newDiv);
    }

    function decreaseCount() {
        setDivs(currentCount - 1)
    }

    function setDivs(count, animation) {
        count = updateState(count)
        if (!animation) {
            setPlay(false);
        }

        const body = iframe.contentDocument.body;
        body.innerHTML = '';
        let parent = body;
        for (let i = 0; i < count; ++i) {
            const newNode = document.createElement('div');
            parent.appendChild(newNode)
            parent = newNode;
        }
    }

    function clamp(x, min, max) {
        return Math.min(max, Math.max(min, x));
    }

    function updateState(newCount) {
        currentCount = clamp(newCount, 1, maxCount);
        controls.value = currentCount;
        return currentCount;
    }
};