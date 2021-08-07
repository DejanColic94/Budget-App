// budet controller module -------------------------------------------------------------------------------------------------------------------------------------
var model = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }


})();














// UIcontroller module -------------------------------------------------------------------------------------------------------------------------------------------
var view = (function() {

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // returns inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };



})();





















// App controller, connects model and view -------------------------------------------------------------------------------------------------------------------------------------------
var controller = (function(model, view) {

    var setUpEventListeners = function() {
        var DOMstrings = view.getDOMstrings();
            document.querySelector(DOMstrings.inputBtn).addEventListener('click', controllAddItem);
            document.addEventListener('keypress', function(event) {
                if(event.code === 'Enter') {
                controllAddItem();
                }
            });
    }

    var controllAddItem = function() {
        // 1. Get input data
        var input = view.getInput();
        
        // 2. Add new item to the DS

        // 3. Display the data in the UI

        // 4. Calculate new total budget

        // 5. Display total budget
        
    }

    


    return {
        init: function() {
            setUpEventListeners();
        }
    }

})(model, view);

controller.init();