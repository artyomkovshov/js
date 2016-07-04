class Mediator {
    constructor() {
        this._subs = {};
    }
    
    subscribe (sub, callback)  {
            if (!this._subs.hasOwnProperty(sub)) {
                this._subs[sub] = [];
            }
            this._subs[sub].push(callback);
            return true;
        };
        
    unsubscribe (sub, callback) {
            var i,
                length;
            if (!this._subs.hasOwnProperty(sub)) {
                return false;
            }

            for (i = 0, length = this._subs[sub].length; i < length; i += 1) {
                if (this._subs[sub][i] === callback) {
                    this._subs[sub].splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        
        publish() {
            var args = Array.prototype.slice.call(arguments),
                sub = args.shift(),
                i,
                length;

            if (!this._subs.hasOwnProperty(sub)) {
                return false;
            }
            for (i = 0, length = this._subs[sub].length; i < length; i += 1) {
                this._subs[sub][i].apply(undefined, args);
            }
            return true;        
        };
          
}



