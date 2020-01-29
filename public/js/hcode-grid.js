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

        config.forms = Object.assign({
          formCreate: {
            type: 'Create',
            name: 'FormCreate',
            id: '#modal-create form'
          },
          formUpdate: {
            type: 'Update',
            name: 'FormUpdate',
            id: '#modal-update form'
          }
        }, config.forms);

        config.modals = Object.assign({
          modalUpdate: '#modal-update'
        }, config.modals);
        
        this.options = Object.assign({}, {
            data: 'row',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete'
        }, config);

        this.initForms();
        this.initUpdateButtons();
        this.initDeleteButtons();
    }

    initForm(obj) {
		obj.form.save()
			.then(json => this.fireEvent(obj.event, [json]))
			.catch(err => this.fireEvent(obj.eventError, [err, obj.errorMessage]));
    }

    initForms() {
      let formObj = {};
      const { forms } = this.options;

      Object.keys(forms).forEach(form => {
        this[forms[form].name] = document.querySelector(`${forms[form].id}`);
        formObj = {
          form: this[forms[form].name],
          event: `after${forms[form].name}`,
          eventError: `after${forms[form].name}Error`,
          errorMessage: this.options[`error${forms[form].type}Message`]
        }

        this.initForm(formObj);
      });
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
		const { btnUpdateExtra } = this.options;

        document.querySelectorAll(this.options.btnUpdate).forEach(btn => {
          btn.addEventListener('click', e => {
            this.fireEvent('beforeUpdateClick', [e]);

            const data = this.getTrData(e);
            
            for (let name in data) {
              const input = this.FormUpdate.querySelector(`[name=${name}]`);
              if (!input) continue;

              this.options.onUpdateLoad(input, name, data);
            }
      
            this.fireEvent('afterUpdateClick', [e]);
          });
		});

		if (btnUpdateExtra) {
			document.querySelectorAll(btnUpdateExtra.ref).forEach(btn => {
				btn.addEventListener('click', e => {
					this.fireEvent(`before${btnUpdateExtra.type}Click`, [e]);

					const data = this.getTrData(e);

					for (let name in data) {
						const input = document.querySelector(`[name=${name}]`);
						if (!input) continue;

						this.options.onUpdateLoad(input, name, data);
					}

					this.fireEvent(`after${btnUpdateExtra.type}Click`, [e]);
				});
			});
		}
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