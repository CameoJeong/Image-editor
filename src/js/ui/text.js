import Range from './tools/range';
import Colorpicker from './tools/colorpicker';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/text';
import {defaultTextRangeValus} from '../consts';

/**
 * Crop ui class
 * @class
 * @ignore
 */
class Text extends Submenu {
    constructor(subMenuElement, {locale, iconStyle, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'text',
            iconStyle,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });
        this.effect = {
            bold: false,
            italic: false,
            underline: false
        };
        this.align = 'left';
        this._els = {
            textEffectButton: this.selector('.tie-text-effect-button'),
            textAlignButton: this.selector('.tie-text-align-button'),
            textColorpicker: new Colorpicker(
                this.selector('.tie-text-color'), '#ffbb3b', this.toggleDirection, this.usageStatistics
            ),
            textRange: new Range({
                slider: this.selector('.tie-text-range'),
                input: this.selector('.tie-text-range-value')
            }, defaultTextRangeValus)
        };
    }

    /**
     * Add event for text
     * @param {Object} actions - actions for text
     *   @param {Function} actions.changeTextStyle - change text style
     */
    addEvent(actions) {
        this.actions = actions;
        this._els.textEffectButton.addEventListener('click', this._setTextEffectHandler.bind(this));
        this._els.textAlignButton.addEventListener('click', this._setTextAlignHandler.bind(this));
        this._els.textRange.on('change', this._changeTextRnageHandler.bind(this));
        this._els.textColorpicker.on('change', this._changeColorHandler.bind(this));
    }

    /**
     * Returns the menu to its default state.
     */
    changeStandbyMode() {
        this.actions.stopDrawingMode();
    }

    /**
     * Executed when the menu starts.
     */
    changeStartMode() {
        this.actions.modeChange('text');
    }

    /**
     * Get text color
     * @returns {string} - text color
     */
    get textColor() {
        return this._els.textColorpicker.color;
    }

    /**
     * Get text size
     * @returns {string} - text size
     */
    get fontSize() {
        return this._els.textRange.value;
    }

    /**
     * Set text size
     * @param {Number} value - text size
     */
    set fontSize(value) {
        this._els.textRange.value = value;
    }

    /**
     * text effect set handler
     * @param {object} event - add button event object
     * @private
     */
    _setTextEffectHandler(event) {
        const button = event.target.closest('.tui-image-editor-button');
        const [styleType] = button.className.match(/(bold|italic|underline)/);
        const styleObj = {
            'bold': {fontWeight: 'bold'},
            'italic': {fontStyle: 'italic'},
            'underline': {
                underline: true,
                textDecoration: 'underline'
            }
        }[styleType];

        this.effect[styleType] = !this.effect[styleType];
        button.classList.toggle('active');
        this.actions.changeTextStyle(styleObj);
    }

    /**
     * text effect set handler
     * @param {object} event - add button event object
     * @private
     */
    _setTextAlignHandler(event) {
        const button = event.target.closest('.tui-image-editor-button');
        if (button) {
            const styleType = this.getButtonType(button, ['left', 'center', 'right']);

            event.currentTarget.classList.remove(this.align);
            if (this.align !== styleType) {
                event.currentTarget.classList.add(styleType);
            }
            this.actions.changeTextStyle({textAlign: styleType});

            this.align = styleType;
        }
    }

    /**
     * text align set handler
     * @param {number} value - range value
     * @private
     */
    _changeTextRnageHandler(value) {
        this.actions.changeTextStyle({
            fontSize: value
        });
    }

    /**
     * change color handler
     * @param {string} color - change color string
     * @private
     */
    _changeColorHandler(color) {
        color = color || 'transparent';
        this.actions.changeTextStyle({
            'fill': color
        });
    }
}

export default Text;
