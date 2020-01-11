class HcodeFileReader {
    constructor(inputEl, imgEl, errorEl) {
        this.inputEl = inputEl;
        this.errorEl = errorEl;
        this.imgEl = imgEl;

        this.initInputEvent();
    }

    initInputEvent() {
        document.querySelector(this.inputEl).addEventListener('change', e => {
            let error = document.querySelector(this.errorEl);
            error.style.display = 'none';

            this.reader(e.target.files[0])
                .then(result => document.querySelector(this.imgEl).src = result)
                .catch(err => {
                    error.innerHTML = err.message;
                    error.style.display = 'block';
                });
        });
    }

    reader(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = function() {
                resolve(reader.result);
            }

            reader.onerror = function() {
                reject(new Error('Não foi possível ler a imagem.'));
            }

            reader.readAsDataURL(file);
        });
    }
}