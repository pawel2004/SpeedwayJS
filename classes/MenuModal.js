import PlayerCard from "./PlayerCard.js";

export default class MenuModal {

    constructor(playerCardsData) {
        this.playerCardsData = playerCardsData;
        this.presentation = document.createElement('div');
        this.presentation.classList.add('presentation');
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');
        this.modal.classList.add('menu');
        this.presentation.appendChild(this.modal);
    }

    show() {
        this.renderGameSettings();
        this.renderPlayerSettings();
        this.renderButton();
        document.body.appendChild(this.presentation);
    }

    renderGameSettings() {
        this.gameSettingsContainer = document.createElement('div');
        this.gameSettingsContainer.classList.add('gameSettingsContainer');

        this.loopSetter = document.createElement('input');
        this.loopSetter.classList.add('input');
        this.loopSetter.classList.add('loopSetter');
        this.loopSetter.type = 'number';
        this.loopSetter.placeholder = 'Loops';
        this.loopSetter.min = 1;
        this.loopSetter.step = 1;
        this.loopSetter.addEventListener('keydown', e => {
            if (e.key == '.' || e.key == '-' || e.key == '+' || e.key == ',')
                e.preventDefault();
        });
        this.gameSettingsContainer.appendChild(this.loopSetter);

        this.modal.appendChild(this.gameSettingsContainer);
    }

    renderPlayerSettings() {
        this.playerSettingsContainer = document.createElement('div');
        this.playerSettingsContainer.classList.add('playerSettingsContainer');

        this.cards = [];

        for (const [key, value] of Object.entries(this.playerCardsData)) {
            const card = new PlayerCard(key, value.color, value.initialName, value.initialKeyLeft, value.initialKeyRight);
            this.playerSettingsContainer.appendChild(card.playerCardContainer);
            this.cards.push(card);
        }

        this.modal.appendChild(this.playerSettingsContainer);
    }

    renderButton() {
        this.confirmButtonContainer = document.createElement('contentButtonContainer');
        this.confirmButtonContainer.classList.add('confirmButtonContainer');
        this.confirmButton = document.createElement('button');
        this.confirmButton.classList.add('button');
        this.confirmButton.style.display = 'block';
        this.confirmButton.innerHTML = 'PLAY';
        this.confirmButtonContainer.appendChild(this.confirmButton);
        this.modal.appendChild(this.confirmButtonContainer);
    }

    packData() {
        const data = {};

        data.loops = this.loopSetter.value;

        data.players = [];

        this.cards.forEach(card => {
            if (!card.hidden)
                data.players.push(card.packData());
        });

        return data;
    };

    validate() {
        if (this.loopSetter.value.length < 1)
            return 'INVALID_LOOPS';
        let playerAvailable = false;
        this.cards.forEach(function (card) {
            if (!card.hidden) {
                playerAvailable = true;
                return;
            }
        });
        if (playerAvailable) {
            let sameKeysOnCard = false;
            this.cards.forEach((card) => {
                if (!card.hidden) {
                    const leftButton = (card.leftButtonSetter.value.length != 0) ? card.leftButtonSetter.value : card.leftButtonSetter.placeholder;
                    const rightButton = (card.rightButtonSetter.value.length != 0) ? card.rightButtonSetter.value : card.rightButtonSetter.placeholder;
                    if (leftButton == rightButton) {
                        sameKeysOnCard = true;
                        return;
                    }
                }
            });
            if (!sameKeysOnCard) {
                let sameKeys = false;
                this.cards.forEach((card, index) => {
                    this.cards.forEach((cardMirror, indexMirror) => {
                        if (index < indexMirror && !card.hidden && !cardMirror.hidden) {
                            const leftButton = (card.leftButtonSetter.value.length != 0) ? card.leftButtonSetter.value : card.leftButtonSetter.placeholder;
                            const rightButton = (card.rightButtonSetter.value.length != 0) ? card.rightButtonSetter.value : card.rightButtonSetter.placeholder;
                            const leftButtonMirror = (cardMirror.leftButtonSetter.value.length != 0) ? cardMirror.leftButtonSetter.value : cardMirror.leftButtonSetter.placeholder;
                            const rightButtonMirror = (cardMirror.rightButtonSetter.value.length != 0) ? cardMirror.rightButtonSetter.value : cardMirror.rightButtonSetter.placeholder;
                            if (leftButton == leftButtonMirror || rightButton == rightButtonMirror || leftButton == rightButtonMirror || rightButton == leftButtonMirror || leftButton == rightButton || rightButton == rightButtonMirror) {
                                sameKeys = true;
                                return;
                            }
                        }
                    });
                    if (sameKeys)
                        return;
                });
                if (!sameKeys)
                    return 'OK';
                else
                    return 'SAME_KEYS';
            }
            else
                return 'SAME_KEYS_ON_CARD';
        }
        else
            return 'NO_PLAYERS';
    }

    dismiss() {
        this.presentation.remove();
    }

}