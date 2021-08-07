// budet controller module -------------------------------------------------------------------------------------------------------------------------------------
var model = (function() {



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

    var DOMstrings = view.getDOMstrings();
    var controllAddItem = function() {
        // 1. Get input data
        var input = view.getInput();
        console.log(input);
        // 2. Add new item to the DS

        // 3. Display the data in the UI

        // 4. Calculate new total budget

        // 5. Display total budget
        
    }

    document.querySelector(DOMstrings.inputBtn).addEventListener('click', controllAddItem);

    document.addEventListener('keypress', function(event) {
        if(event.code === 'Enter') {
            controllAddItem();
        }
    })




})(model, view);
