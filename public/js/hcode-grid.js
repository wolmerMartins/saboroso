class HcodeGrid {
    constructor(config) {
        this.options = Object.assign({}, {
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete',
            modalUpdate: '#modal-update',
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
        }, config);
        this.formCreate = document.querySelector(this.options.formCreate);
        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.initForms();
        this.initUpdateButtons();
        this.initDeleteButtons();
    }

    initForms() {
        this.formCreate.save()
          .then(json => window.location.reload())
          .catch(err => console.log('error creating reservation', err));
      
        this.formUpdate.save()
          .then(json => window.location.reload())
          .catch(err => console.log('error updating reservation', err));
    }

    initUpdateButtons() {
        document.querySelectorAll(this.options.btnUpdate).forEach(btn => {
          btn.addEventListener('click', e => {
            const tr = e.path.find(el => el.tagName === 'TR');
            const data = JSON.parse(tr.dataset.reservation);
            
            for (let name in data) {
              const input = this.formUpdate.querySelector(`[name=${name}]`);
              if (!input) continue;
      
              switch(name) {
                case 'date':
                  input.value = moment(data[name]).add(1, 'days').format('YYYY-MM-DD');
                  break;
                default:
                  input.value = data[name];
              }
            }
      
            $(this.options.modalUpdate).modal('show');
          });
        });
    }

    initDeleteButtons() {      
        document.querySelectorAll(this.options.btnDelete).forEach(btn => {
          btn.addEventListener('click', e => {
            const tr = e.path.find(el => el.tagName === 'TR');
            const data = JSON.parse(tr.dataset.reservation);
      
            if (confirm(`Você realmente deseja excluir ${this.options.deleteMsg}?`)) {
              fetch(`${this.options.deleteUrl}/${data.id}`, {
                method: 'delete'
              }).then(response => response.json())
                .then(json => window.location.reload())
                .catch(err => console.log('Error deleting reservation', err));
            }
          });
        });
    }
}