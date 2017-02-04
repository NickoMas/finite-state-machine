class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      this.config  = config;
      this.current = this.config.initial;
      this.pile = {
        stack  : [this.current],
        undone : []
      };
      if(!config) return new Error();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      var states = Object.keys(this.config.states);
      if(~states.indexOf(state)) this.current = state;
      else throw new Error();
      this.pile.stack.push(this.current);
      if(this.pile.undone[0]) {
        this.pile.undone = [this.pile.undone.pop()];
      }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      var states = this.config.states;
      if(!states[this.current].transitions[event]){
        throw new Error();
      }
      this.current = states[this.current].transitions[event];
      this.pile.stack.push(this.current);
      if(this.pile.undone[0]) {
        this.pile.undone = [this.pile.undone.pop()];
      }    
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      return this.current = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      if(!event) return Object.keys(this.config.states);
      
      var states = this.config.states;
      var arr = [];
  
        for(var k in states){
          if(states[k].transitions[event]) arr.push(k);
        }
      return arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if(this.pile.stack[1]) {
        var und = this.pile.stack.pop();
        this.pile.undone.push(und);
        this.current = this.pile.stack[this.pile.stack.length-1];
        return true;
      }
      else {
        this.current = this.config.initial;
        return false;
      }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if(this.pile.undone[0]) {
        var redone = this.pile.undone.pop();
        this.pile.stack.push(redone);
        this.current = this.pile.stack[this.pile.stack.length-1];
        return true;
      }
      else {
        this.current = this.config.initial;
        return false;
      }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.pile.stack.splice(1);
      this.pile.undone.splice(0);
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
