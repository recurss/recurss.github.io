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
    const autoplay = !!(pageSettings.dataset.autoplay && !isNaN(+pageSettings.dataset.autoplay) && +pageSettings.dataset.autoplay);
    const speed = pageSettings.dataset.speed && !isNaN(+pageSettings.dataset.speed) ? +pageSettings.dataset.speed : DEFAULT_SPEED;

    // UI
    class IncreaseButton {
        /**
         * @param {() => void} onClick
         */
        constructor(onClick) {
            this._button = /** @type {HTMLButtonElement} */ (document.querySelector('.increase-button'));

            this._button.addEventListener('click', onClick);
        }

        set value(value) {
            this._button.disabled = value >= maxCount;
        }
    }

    class DecreaseButton {
        /**
         * @param {() => void} onClick
         */
        constructor(onClick) {
            this._button = /** @type {HTMLButtonElement} */ (document.querySelector('.decrease-button'));

            this._button.addEventListener('click', onClick);
        }

        set value(value) {
            this._button.disabled = value <= 1;
        }
    }

    class PlayButton {
        constructor(onChange) {
            this._button = /** @type {HTMLButtonElement} */ (document.querySelector('.play-button'));

            this._playing = false;

            this._button.addEventListener('click', () => {
                onChange(!this._playing);
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
        constructor(/** @type {number} */ currentCount, onChange) {
            this._container = document.querySelector('.count-slider');

            this._slider = document.createElement('input');
            this._slider.className = 'count-slider';
            this._slider.type = 'range';
            this._slider.min = '1';
            this._slider.max = `${maxCount}`;
            this._slider.value = `${currentCount}`;
            this._container.appendChild(this._slider);
            this._slider.addEventListener('input', e => onChange(e.target.value));
            this._slider.addEventListener('change', e => onChange(e.target.value));

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
        /**
         * @param {number} currentCount
         * @param {Preview} preview
         */
        constructor(currentCount, preview) {
            this._slider = new CountSlider(currentCount, x => preview.setDivs(x));
            this._increaseButton = new IncreaseButton(() => preview.increaseCount());
            this._decreaseButton = new DecreaseButton(() => preview.decreaseCount());
            this._playButton = new PlayButton(x => preview.setPlay(x));
        }

        set value(/** @type {number} */ value) {
            this._slider.value = value;
            this._increaseButton.value = value;
            this._decreaseButton.value = value;
        }

        set playing(/** @type {boolean} */ value) {
            this._playButton.playing = value;
        }
    }

    class Preview {
        constructor() {
            this.playing = false;

            this.iframe = /** @type {HTMLIFrameElement} */ (document.getElementById('content-iframe'));

            const onReady = () => {
                if (!this.iframe.contentDocument || !this.iframe.contentDocument.body) {
                    setTimeout(onReady, 50);
                    return;
                }

                preview.setDivs(currentCount, true);
                this.setPlay(autoplay, defaultStart);
            };

            if (this.iframe.contentDocument.readyState === 'complete' || this.iframe.contentDocument.readyState === 'interactive') {
                setTimeout(onReady, 0);
            } else {
                this.iframe.contentDocument.addEventListener('DOMContentLoaded', onReady, true);
            }
        }

        /**
         * @param {number} count
         * @param {boolean} [animation]
         */
        setDivs(count, animation) {
            count = this.updateState(count)
            if (!animation) {
                this.setPlay(false);
            }

            const body = this.iframe.contentDocument.body;
            body.innerHTML = '';
            let parent = body;
            for (let i = 0; i < count; ++i) {
                const newNode = document.createElement('div');
                parent.appendChild(newNode)
                parent = newNode;
            }
        }

        increaseCount() {
            const count = this.updateState(currentCount + 1)
            this.setPlay(false);

            const body = this.iframe.contentDocument.body;
            const newDiv = document.createElement('div');
            newDiv.appendChild(body.children[0]);
            body.appendChild(newDiv);
        }

        decreaseCount() {
            preview.setDivs(currentCount - 1)
        }

        /**
         * @param {boolean} shouldPlay
         * @param {number} [initialValue]
         */
        setPlay(shouldPlay, initialValue) {
            clearInterval(animationInterval);
            if (shouldPlay) {
                preview.setDivs(initialValue || 1, true);
                animationInterval = setInterval(() => {
                    if (currentCount < maxCount) {
                        preview.setDivs(currentCount + 1, true);
                    } else {
                        clearInterval(animationInterval);
                        controls.playing = false;
                    }
                }, speed);
            }
    
            this.playing = shouldPlay
            controls.playing = shouldPlay;
        }

        updateState(newCount) {
            currentCount = clamp(newCount, 1, maxCount);
            controls.value = currentCount;
            return currentCount;
        }
    }
    
    function clamp(x, min, max) {
        return Math.min(max, Math.max(min, x));
    }

    // State
    let animationInterval;
    let currentCount = defaultStart;
    const preview = new Preview();
    const controls = new Controls(currentCount, preview);

   
};