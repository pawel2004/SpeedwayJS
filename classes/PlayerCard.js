export default class PlayerCard {

    constructor(color, colorRGB, initialName, initialKeyLeft, initialKeyRight) {
        this.color = color;
        this.colorRGB = colorRGB;
        this.initialName = initialName;
        this.initialKeyLeft = initialKeyLeft;
        this.initialKeyRight = initialKeyRight;

        this.invalidKeyList = [
            'ShiftLeft',
            'ShiftRight',
            'Enter',
            'Space',
            'Backspace',
            'CapsLock',
            'ControlLeft',
            'ControlRight',
            'MetaLeft',
            'MetaRight',
            'AltLeft',
            'AltRight',
            'ContextMenu',
            'Tab',
            'Escape',
            'NumLock'
        ];

        this.playerCardContainer = document.createElement('div');
        this.playerCardContainer.classList.add('playerCardContainer');
        this.playerCardContainer.style.borderColor = `rgb(${this.colorRGB.r}, ${this.colorRGB.g}, ${this.colorRGB.b})`;

        this.hide();
    }

    hide() {
        this.hidden = true;
        this.playerCardContainer.innerHTML = '';
        this.revealButton = document.createElement('div');
        this.revealButton.innerHTML = '+';
        this.revealButton.classList.add('revealButton');
        this.playerCardContainer.onclick = () => {
            this.reveal();
        };
        this.playerCardContainer.appendChild(this.revealButton);
    }

    reveal() {
        this.hidden = false;
        this.playerCardContainer.innerHTML = '';
        this.playerCardContainer.onclick = null;

        this.nameSetter = document.createElement('input');
        this.nameSetter.placeholder = this.initialName;
        this.nameSetter.classList.add('input');
        this.nameSetter.classList.add('nameSetter');
        this.nameSetter.style.borderColor = `rgb(${this.colorRGB.r}, ${this.colorRGB.g}, ${this.colorRGB.b})`;
        this.playerCardContainer.appendChild(this.nameSetter);

        this.leftButtonSetter = document.createElement('input');
        this.leftButtonSetter.placeholder = this.initialKeyLeft;
        this.leftButtonSetter.classList.add('input');
        this.leftButtonSetter.classList.add('buttonSetter');
        this.leftButtonSetter.addEventListener('keydown', e => {
            e.preventDefault();
            if (!this.invalidKeyList.includes(e.code)) {
                this.leftButtonSetter.value = e.code;
                this.leftButtonSetter.blur();
            }
        });
        this.leftButtonSetter.style.borderColor = `rgb(${this.colorRGB.r}, ${this.colorRGB.g}, ${this.colorRGB.b})`;
        this.playerCardContainer.appendChild(this.leftButtonSetter);

        this.rightButtonSetter = document.createElement('input');
        this.rightButtonSetter.placeholder = this.initialKeyRight;
        this.rightButtonSetter.classList.add('input');
        this.rightButtonSetter.classList.add('buttonSetter');
        this.rightButtonSetter.addEventListener('keydown', e => {
            e.preventDefault();
            if (!this.invalidKeyList.includes(e.code)) {
                this.rightButtonSetter.value = e.code;
                this.rightButtonSetter.blur();
            }
        });
        this.rightButtonSetter.style.borderColor = `rgb(${this.colorRGB.r}, ${this.colorRGB.g}, ${this.colorRGB.b})`;
        this.playerCardContainer.appendChild(this.rightButtonSetter);

        const hideButton = document.createElement('button');
        hideButton.classList.add('button');
        hideButton.classList.add('hideButton');
        hideButton.innerHTML = 'Remove';
        hideButton.onclick = e => {
            e.stopPropagation();
            this.hide();
        };
        this.playerCardContainer.appendChild(hideButton);
    }

    packData() {
        const data = {
            name: (this.nameSetter.value.length != 0) ? this.nameSetter.value : this.initialName,
            leftTurn: (this.leftButtonSetter.value.length != 0) ? this.leftButtonSetter.value : this.initialKeyLeft,
            rightTurn: (this.rightButtonSetter.value.length != 0) ? this.rightButtonSetter.value : this.initialKeyRight,
            color: this.color
        };

        return data;
    }

}