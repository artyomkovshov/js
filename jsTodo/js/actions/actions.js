(function (window, undefined) {
    'use strict;'
    var TodoActions = {
        
        create: function (text) {
            Mediator.dispatch({
                actionType: 'create',
                text: text
            });
        },
        
        toggleComplete: function (todo) {
            var id = todo.id;
            var actionType = todo.complete ? 'uncomplete' : 'complete';
            Mediator.dispatch({
                actionType: actionType,
                id: id,
            });
        }
        
        update: function (id, text) {
            Mediator.dispatch({
                actionType: 'update',
                id: id,
                text: text
            });
        },
        
        destroy: function (id) {
            Mediator.dispatch({
                actionType: 'destroy',
                id: id,
            });
        }   
    }
    window.TodoActions = TodoActions;
})(window);