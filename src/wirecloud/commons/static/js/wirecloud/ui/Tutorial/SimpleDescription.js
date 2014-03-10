/*
 *     (C) Copyright 2012 Universidad Politécnica de Madrid
 *
 *     This file is part of Wirecloud Platform.
 *
 *     Wirecloud Platform is free software: you can redistribute it and/or
 *     modify it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     Wirecloud is distributed in the hope that it will be useful, but WITHOUT
 *     ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *     FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
 *     License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with Wirecloud Platform.  If not, see
 *     <http://www.gnu.org/licenses/>.
 *
 */

/*global gettext, StyledElements, Wirecloud*/

(function () {

    "use strict";

    /**
     * Simple Description Constructor
     *
     */
    var SimpleDescription = function SimpleDescription(tutorial, options) {
        this.options = options;
        this.element = options.elem;
        this.tutorial = tutorial;
        this.layer = tutorial.msgLayer;
        this.last = false;
        this.pos = options.pos;
        this.title = options.title;
        this.nextButtonText = gettext('Next');
        if (options.nextButtonText) {
            this.nextButtonText = options.nextButtonText;
        }

        Wirecloud.ui.WindowMenu.call(this, this.title, 'simpleDescription');

        this.windowContent.innerHTML = options.msg;

        this.nextButton = new StyledElements.StyledButton({
            'title': gettext("next"),
            'class': 'nextButton btn-primary',
            'text': gettext(this.nextButtonText),
        });

        this.nextButton.insertInto(this.windowBottom);

        // Cancel button
        this.cancelButton = new StyledElements.StyledButton({
            'title': gettext("Cancel"),
            'class': 'cancelButton',
            'text': gettext("Cancel"),
        });
        this.cancelButton.insertInto(this.windowBottom);
        this.cancelButton.addEventListener('click', this._closeListener);

        this.layer.appendChild(this.htmlElement);

        this.wrapperElement = this.htmlElement;
    };
    SimpleDescription.prototype = new Wirecloud.ui.WindowMenu();

    SimpleDescription.prototype._closeListener = function _closeListener(e) {
        Wirecloud.ui.WindowMenu.prototype._closeListener.call(this, e);
        this.tutorial.destroy();
    };

    /**
     * get style position.
     */
    SimpleDescription.prototype.getStylePosition = function getStylePosition() {
        var coordinates;
        coordinates = {
            posX: parseInt(this.htmlElement.style.left, 10),
            posY: parseInt(this.htmlElement.style.top, 10)
        };
        return coordinates;
    };

    /**
     * set position.
     */
    SimpleDescription.prototype.setPosition = function setPosition(coordinates) {
        this.htmlElement.style.left = coordinates.posX + 'px';
        this.htmlElement.style.top = coordinates.posY + 'px';
    };

    /**
     * set this SimpleDescription as the last one, don't need next button.
     */
    SimpleDescription.prototype.setLast = function setLast(buttonLabel, optionalHandler) {
        this.last = true;
        Wirecloud.Utils.removeFromParent(this.nextButton.wrapperElement);
        if (buttonLabel == null) {
            buttonLabel = gettext('Close');
        }
        this.cancelButton.setLabel(gettext(buttonLabel));
        if (optionalHandler != null) {
            this.cancelButton.removeEventListener('click', this._closeListener);
            this.cancelButton.addEventListener('click', optionalHandler.bind(this));
        }
    };

    /**
     * set next handler
     */
    SimpleDescription.prototype.setNext = function setNext() {
        this.nextButton.addEventListener('click', function () {
            if (this.element != null) {
                this.element.removeClassName('tuto_highlight');
            }
            this.tutorial.nextStep();
        }.bind(this));
    };

    /**
     * activate this step
     */
    var _activate = function _activate() {
        this.htmlElement.classList.add("activeStep");
        if (typeof this.element === 'function') {
            this.element = this.element();
            this.tutorial.setControlLayer(this.element, true);
            this.element.classList.add('tuto_highlight');
        } else {
            this.tutorial.resetControlLayer(false);
        }
        if (this.element != null) {
            var pos = this.element.getBoundingClientRect();
            switch (this.pos) {
                case 'up':
                    this.htmlElement.style.top = (pos.top - this.htmlElement.offsetHeight - 20) + 'px';
                    break;
                case 'right':
                    this.htmlElement.style.left = (pos.right + 20) + 'px';
                    break;
                case 'left':
                    this.htmlElement.style.left = (pos.left - this.htmlElement.offsetWidth - 20) + 'px';
                    break;
                default:
                case 'down':
                    this.htmlElement.style.top = (pos.bottom + 20) + 'px';
                    break;
            }
        } else {
            this.htmlElement.style.top = ((window.innerHeight / 2) - (this.htmlElement.offsetHeight / 2)) + 'px';
            this.htmlElement.style.left = ((window.innerWidth / 2) - (this.htmlElement.offsetWidth / 2)) + 'px';
        }
        this.nextButton.focus();
    };

     /**
     * activate this step
     */
    SimpleDescription.prototype.activate = function activate() {
        if (this.options.asynchronous) {
            this.element(_activate.bind(this));
        } else {
            _activate.call(this);
        }
    };

    /*************************************************************************
     * Make SimpleDescription public
     *************************************************************************/
    Wirecloud.ui.Tutorial.SimpleDescription = SimpleDescription;

})();
