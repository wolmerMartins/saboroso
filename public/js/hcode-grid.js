class HcodeGrid {
    constructor(config) {
        config.listeners = Object.assign({
            afterUpdateClick: e => $('#modal-update').modal('show'),
            afterDeleteClick: e => window.location.reload(),
            afterDeleteClickError: err => {
              alert('Não foi possível fazer a exclusão no momento');
              console.log('error deleting data from DB', err);
            },
            afterFormCreate: json => window.location.reload(),
            afterFormCreateError: (err, message) => {
              alert(message);
              console.log('error saving data in DB', err);
            },
            afterFormUpdate: json => window.location.reload(),
            afterFormUpdateError: (err, message) => {
              alert(message);
              console.log('error updating data from DB', err);
            }
        }, config.listeners);
        
        this.options = Object.assign({}, {
            data: 'row',
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

    initForm(forms) {
      forms.forEach(obj => {
        obj.form.save()
          .then(json => this.fireEvent(obj.event, [json]))
          .catch(err => this.fireEvent(obj.eventError, [err, obj.errorMessage]));
      });
    }

    initForms() {
      this.initForm([
        {
          form: this.formCreate,
          event: 'afterFormCreate',
          eventError: 'afterFormCreateError',
          errorMessage: this.options.errorCreateMessage
        },
        {
          form: this.formUpdate,
          event: 'afterFormUpdate',
          eventError: 'afterFormUpdateError',
          errorMessage: this.options.errorUpdateMessage
        }
      ]);
    }

    getTrData(event) {
      const tr = event.path.find(el => el.tagName === 'TR');
      const data = JSON.parse(tr.dataset[this.options.data]);

      return data;
    }

    fireEvent(name, args) {
        if (typeof this.options.listeners[name] === 'function') {
            this.options.listeners[name].apply(this, args);
        }
    }

    initUpdateButtons() {
        document.querySelectorAll(this.options.btnUpdate).forEach(btn => {
          btn.addEventListener('click', e => {
            this.fireEvent('beforeUpdateClick', [e]);

            const data = this.getTrData(e);
            
            for (let name in data) {
              const input = this.formUpdate.querySelector(`[name=${name}]`);
              if (!input) continue;

              this.options.onUpdateLoad(input, name, data);
            }
      
            this.fireEvent('afterUpdateClick', [e]);
          });
        });
    }

    initDeleteButtons() {      
        document.querySelectorAll(this.options.btnDelete).forEach(btn => {
          btn.addEventListener('click', e => {
            this.fireEvent('beforeDeleteClick');

            const data = this.getTrData(e);
      
            if (confirm(`Você realmente deseja excluir ${this.options.deleteMsg}?`)) {
              fetch(`${this.options.deleteUrl}/${data.id}`, {
                method: 'delete'
              }).then(response => response.json())
                .then(json => this.fireEvent('afterDeleteClick'))
                .catch(err => this.fireEvent('afterDeleteClickError', [err]));
            }
          });
        });
    }
}