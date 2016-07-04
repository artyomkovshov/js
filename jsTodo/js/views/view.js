class View {
    constructor(store) {
        var view;
        this.dataName = store.dataName;
        this.container = document.querySelector('.'+this.dataName);
        if (this.container) {
            this.container.innerHTML =
                '<div class="container">' +
                    '<form>'+
                        '<div class="row">'+
                            '<div class="form-group">'+
                                '<div class="col-lg-4">'+
                                    '<input type="text" class="form-control js-text" placeholder="Дело">'+
                                '</div>'+
                                '<div class="col-lg-1">'+
                                  '<button type="button" class="btn btn-primary js-addEntry">Добавить</button>'+
                                '</div>'+
                             '</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-lg-4">'+
                                '<span class="js-active">1</span>'+
                                '<span> активных | </span>'+
                                '<span class="js-archive">0</span>'+
                                '<span> в архиве</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-lg-5 line"></div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-lg-5">'+
                                '<ul class="todoList">'+
                                    '<li data-id = 1 class = "">'+
                                        '<div class = "todo-item">'+
                                            '<input type = "checkbox" {{checked}}>'+
                                            '<label>text</label>'+
                                            '<button class = "remove"></button>'+
                                        '</div>'+
                                        '<input type="text" class="edit col-lg-4" placeholder="Новое название">'+
                                    '</li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-lg-5 line"></div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-lg-4">'+
                                '<input type="text" class="form-control js-filter" placeholder="Фильтр">'+
                            '</div>'+
                            '<div class="col-lg-1">'+
                                '<button type="button" class="btn btn-warning js-reset">Сбросить</button>'+
                            '</div>'+
                        '</div>'+
                        '<div class="row">'+
                            '<div class="col-lg-4">'+
                                '<label>'+
                                    '<input type="checkbox" class="js-flag">'+
                                    'Искать в активных'+
                                '</label>'+
                            '</div>'+
                        '</div>'+
                    '</form>'+
                '</div>';
        this.todoList = this.container.querySelector('.todoList');
        this.regExp = new RegExp('', '');
        this.activeCounter = this.container.querySelector('.js-active');
        this.archiveCounter = this.container.querySelector('.js-archive');
        this.filterFlag = this.container.querySelector('.js-flag');
        this.template =
            '<li data-id = "{{id}}" class = "{{completed}}">' + 
                '<div class = "todo-item">' +
                    '<input type = "checkbox" {{checked}}>' +
                    '<label>{{text}}</label>' +
                    '<button type="button" class = "remove"></button>' +
                '</div>' +
                '<input type="text" class="edit col-lg-4" placeholder="Новое название">' +
            '</li>';
        view = this;
        self = this;

        mediator.subscribe('init ' + view.dataName, function (args) {
            view.render(args);
        });

        }

    }

        getView(data) {
            var i,
                renderedView = '';
            
            for (i = 0; i < data.todoItems.length; i += 1) {
                var completed = '',
                    checked = '',
                    newTemplate = this.template;
                
                if (data.todoItems[i].complete) {
                    completed = 'completed';
                    checked = 'checked';
                }
                
                newTemplate = newTemplate.replace('{{id}}', data.todoItems[i].id);
                newTemplate = newTemplate.replace('{{text}}', data.todoItems[i].text);
                newTemplate = newTemplate.replace('{{completed}}', completed);
                newTemplate = newTemplate.replace('{{checked}}', checked);
                renderedView += newTemplate;
            }
            
            return renderedView;
        };

        render(data) {
            this.todoList.innerHTML = this.getView(data);
            this.activeCounter.innerHTML = data.count.active;
            this.archiveCounter.innerHTML = data.count.archive;
            this.initialization();
        };

        createItem(self) {
            var textField;

            textField = self.container.querySelector('.js-text');

            if (textField.value) {
                mediator.publish('addElement ' + self.dataName, textField.value);
                textField.value = '';
            }

        }

        deleteItem(e, self) {
            var id,
                parent,
                event = e || target,
                target = event.target || event.srcElement;

            if (target.tagName != 'BUTTON') return;
            parent = target.closest('[data-id]');
            id = parent.getAttribute('data-id');
            mediator.publish('delElement ' + self.dataName, id);
        }

        changeStatus(e, self) {
            var id,
                parent,
                event = e || target,
                target = event.target || event.srcElement;

            if (target.type != 'checkbox') return;
            parent = target.closest('[data-id]');
            id = parent.getAttribute('data-id');
            event.stopImmediatePropagation();

            mediator.publish('changeElement ' + self.dataName, id);
        }

        editEnable(e, self) {
            var id,
                parent,
                event = e || target,
                target = event.target || event.srcElement,
                editField;
            if (target.tagName != 'LABEL') return;
            parent = target.closest('[data-id]');
            id = parent.getAttribute('data-id');
            event.stopImmediatePropagation();
            editField = parent.lastChild;
            editField.classList.add('js-display');
            editField.focus();
        }

        editReady(e, self) {
            var id,
                parent,
                event = e || target,
                target = event.target || event.srcElement,
                editField,
                text,
                obj = {};

            if ((event.keyCode != 13) ||(target.type != 'text')) return;
            parent = target.closest('[data-id]');
            id = parent.getAttribute('data-id');
            text = target.value;
            event.stopImmediatePropagation();
            editField = parent.lastChild;
            editField.classList.remove('js-display');
            obj = {
                id: id,
                text: text
            };
            mediator.publish('edit ' + self.dataName, obj);
        }

        toggleFilter(e, self) {
            var text,
                event = e || target,
                target = event.target || event.srcElement,
                searchActive = false;

            event.stopImmediatePropagation();
            searchActive = this.filterFlag.checked;


            mediator.publish('setFlag ' + self.dataName, searchActive);

        }

        setFilter(e, self) {
            var text,
                event = e || target,
                target = event.target || event.srcElement;

            event.stopImmediatePropagation();

            text = target.value;

            self.regExp = new RegExp(text, '');

            mediator.publish('changeFilter ' + self.dataName, self.regExp);
        }

        resetFilter(event, self) {
            var textField;

            event.stopImmediatePropagation();
            textField = self.container.querySelector('.js-filter');
            textField.value = '';
            self.regExp = new RegExp('', '');
            mediator.publish('changeFilter ' + self.dataName, this.regExp);
        }

        initialization() {
            var addButton,
                textField,
                resetButton,
                filter,
                self = this;

            addButton = this.container.querySelector('.js-addEntry');
            addButton.addEventListener('click', function (e) {
                self.createItem(self)
            }, false);
            resetButton = this.container.querySelector('.js-reset');
            resetButton.addEventListener('click', function (e) {
                self.resetFilter(e, self)
            }, false);
            filter = this.container.querySelector('.js-filter');
            this.todoList.addEventListener('click', function (e) {
                self.deleteItem(e, self);
            }, false);
            this.todoList.addEventListener('click', function (e) {
                self.changeStatus(e, self);
            }, false);
            this.todoList.addEventListener('dblclick', function (e) {
                self.editEnable(e, self);
            }, false);
            this.todoList.addEventListener('keyup', function (e) {
                self.editReady(e, self);
            }, false);
            filter.addEventListener('keyup', function (e) {
                self.setFilter(e, self);
            }, false);
            this.filterFlag.addEventListener('change', function (e) {
                self.toggleFilter(e, self);
            }, false);
        }

}