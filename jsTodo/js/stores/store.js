class Store {
    constructor(name) {
        var self,
            store;

        this.dataName = name;   
        this.data = {
            todoItems : [],
            count: {}
        };
        this.regExp = new RegExp('', '');
        this.searchActive = false;
        self = this;

        store = this;

        mediator.subscribe('addElement ' + store.dataName, function (args) {
            self.create(args);
        });
        mediator.subscribe('delElement ' + store.dataName, function (args) {
            self.delete(args);
        });
        mediator.subscribe('changeElement ' + store.dataName, function (args) {
            self.change(args);
        });
        mediator.subscribe('edit ' + store.dataName, function (args) {
            self.edit(args);
        });
        mediator.subscribe('changeFilter ' + store.dataName, function (args) {
            self.useFilter(args);
        });
        mediator.subscribe('setFlag ' + store.dataName, function (args) {
            self.setFlag(args);
        });
    }   
    
    init () {
        var i;

        if (!localStorage[this.dataName]) { 
            localStorage[this.dataName] = JSON.stringify(this.data);
        } else {
            this.data = JSON.parse(localStorage[this.dataName]);
        }
        this.getCount(this.data.todoItems);
        this.data.todoItems.sort(function (a, b) {
            if (!a.complete & b.complete) {
                return -1;
            }
            if (a.complete & !b.complete) {
                return 1;
            }
            return 0;
        });

        for (i = 0; i < this.data.todoItems.length; i += 1) {
            if (this.searchActive) {
                if (this.data.todoItems[i].complete) {
                    this.data.todoItems.splice(i, 1);
                    i -= 1;
                }
            }
        }

        for (i = 0; i < this.data.todoItems.length; i += 1) {
            if (!this.data.todoItems[i].text.match(this.regExp)) {
                this.data.todoItems.splice(i, 1);
                i -= 1;

            }

        }


        mediator.publish('init ' + this.dataName, this.data);
    }
    
    create (text) {
            var id,
                todoItem;
            id = Date.now();
            todoItem = {
                id: id,
                complete: false,
                text: text,
                match: false
            };    
            
            this.save(todoItem);
            this.init();

        }
    update (newData, id) {
            var data = JSON.parse(localStorage[this.dataName]),
                todoItems = data.todoItems,
                i,
                key;

            if (id) {
                for (i = 0; i < todoItems.length; i += 1) {
                    if (todoItems[i].id === id) {
                        for (key in newData) {
                            todoItems[i][key] = newData[key];
                        }
                        break;
                    }
                }
             }
            this.init();
    }

    save (item) {
        var data = JSON.parse(localStorage[this.dataName]),
            i,
            key;

        if (item) {
            data.todoItems.unshift(item);
            localStorage[this.dataName] = JSON.stringify(data);
            this.getCount(data.todoItems);
        }
    }

    getCount(itemsArray) {
        var i,
            count;

        count = {
            active: 0,
            archive: 0
        };
        for (i = 0; i < itemsArray.length; i += 1) {
            if (itemsArray[i].complete) {
                count.archive += 1;
            } else {
                count.active += 1;
            }
        }
        this.data.count = count;
    }

    delete(id) {
        var data = JSON.parse(localStorage[this.dataName]),
            i,
            key;

        if(id) {
            for (i = 0; i < data.todoItems.length; i += 1) {
                if (data.todoItems[i].id == id) {
                    data.todoItems.splice(i, 1);
                    localStorage[this.dataName] = JSON.stringify(data);
                    this.init();
                    break;
                }

            }
        }
    }

    change(id) {
        var data = JSON.parse(localStorage[this.dataName]),
            i,
            key;

        if(id) {
            for (i = 0; i < data.todoItems.length; i += 1) {
                if (data.todoItems[i].id == id) {
                    if (!data.todoItems[i].complete) {
                        data.todoItems[i].complete = true;
                        localStorage[this.dataName] = JSON.stringify(data);
                        this.init();
                        break;
                    } else {
                        data.todoItems[i].complete = false;
                        localStorage[this.dataName] = JSON.stringify(data);
                        this.init();
                        break;
                    }
                                    }

            }
        }
    }

    edit (obj) {
        var data = JSON.parse(localStorage[this.dataName]),
            i,
            key,
            id,
            text;

        id = obj.id;
        text = obj.text;

        if(id) {
            for (i = 0; i < data.todoItems.length; i += 1) {
                if (data.todoItems[i].id == id) {
                    data.todoItems[i].text = text;
                    localStorage[this.dataName] = JSON.stringify(data);
                    this.init();
                    break;
                }
            }
        }
    }

    useFilter(regExp, searchActive) {
        this.regExp = regExp;
        this.init();
    }

    setFlag(searchActive) {
        this.searchActive = searchActive;
        this.init();
    }


}
