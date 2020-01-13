HTMLFormElement.prototype.save = function() {
    return new Promise((resolve, reject) => {
        this.addEventListener('submit', e => {
            e.preventDefault();

            let body = new FormData(this);

            fetch(this.action, {
                method: this.method,
                body
            }).then(response => response.json())
                .then(json => resolve(json))
                .catch(err => reject(err));
        });
    });
}