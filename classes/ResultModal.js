export default class ResultModal {

    constructor(width, height, text, color) {
        this.text = text;
        this.color = color;
        this.presentation = document.createElement('div');
        this.presentation.classList.add('presentation');
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');
        this.modal.style.width = width + 'px';
        this.modal.style.height = height + 'px';
        this.presentation.appendChild(this.modal);
    }

    show() {
        this.modal.style.backgroundColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        this.modal.innerHTML = this.text;

        document.body.appendChild(this.presentation);
    }

    dismiss() {
        this.presentation.remove();
    }

}