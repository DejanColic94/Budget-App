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
    };

    return {
        addItem: function(t, des,val) {
            var newItem,ID;

            // [1 2 3 4 5] next ID = 6
            // [1 2 3 6 8] next ID = 9
            // so we want the value of the last element in the array + 1
            // last element is: data.allItems[t][data.allItems[t].length - 1]
            if(data.allItems[t].length > 0) {
            ID = data.allItems[t][data.allItems[t].length - 1].id + 1;
            } else {
                ID = 0;
            }    
            // create item based on exp or inc
            if(t === 'exp') {
                newItem = new Expense(ID, des, val);
            }else if(t === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push new item into data array
            data.allItems[t].push(newItem); // t can be exp or inc so it automatically goes into right property
            // return new item so that other modules can use it
            return newItem;
        },
        testing: function() {
            console.log(data);
        }

       
    }


})();














// UIcontroller module -------------------------------------------------------------------------------------------------------------------------------------------
var view = (function() {

    var DOMstrings = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // returns inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
            // placeholder html string
            var html, newHtml, element;

            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            // replace placeholders with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);



            // insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearInputFileds: function() {
            var fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue); // returns a List

            // Converting a List into an Array
            var filedsArray = Array.prototype.slice.call(fields);

            filedsArray.forEach(function(current, index, array) {
                current.value = "";
            });

            filedsArray[0].focus();
            
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
        var newItem = model.addItem(input.type, input.description, input.value);
        // 3. Display the data in the UI
        view.addListItem(newItem, input.type);
        view.clearInputFileds();
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