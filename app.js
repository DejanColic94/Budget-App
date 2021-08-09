// budet controller module -------------------------------------------------------------------------------------------------------------------------------------
var model = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        }else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this. value = value;
    }

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        deleteItem: function(type,id) {
            // creates new array consisting of ids of all items
            var ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            // returns position of the item with the given id
            var index = ids.indexOf(id);

            // delete the item
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0) {
            data.percentage =Math.round((data.totals.exp / data.totals.inc) * 100);
            }else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            var income = data.totals.inc;
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(income);
            });

        },

        getPercentages: function() {
            var allPercentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages; // array with all of the percentages
        },

        getBudget: function() {
            return {
                budget: data.budget,
                income: data.totals.inc,
                expenses: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expensesLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        listContainer : '.container',
        percentageItem : '.item__percentage'
    }

    var formatNumber = function(num, type) {

        // RULES:
        // 1. + or - before the number
        // 2. 2 decimal points
        // 3. comma (,) separating the thousands

        num = Math.abs(num);
        num = num.toFixed(2);

        var numSplit = num.split('.');
        var integerPart = numSplit[0];
        var decimalPart = numSplit[1];

        if(integerPart.length > 3) {
            // works for all of the cases
            // if 2345 -> 2,345
            // if 345967 -> 345, 967
            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr( integerPart.length - 3, 3);
        }

        var sign;
        type === 'exp' ? sign = '-' : sign = '+';

        // putting it all together
        return sign + ' ' + integerPart + '.' + decimalPart;
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // returns inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            // placeholder html string
            var html, newHtml, element;

            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }
            // replace placeholders with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));



            // insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
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

        displayBudget: function(object) {
            var type;

            object.budget > 0? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(object.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent =formatNumber(object.income, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent =formatNumber(object.expenses, 'exp');
          

            if(object.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = object.percentage + '%';
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "/";
            }
        },


        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.percentageItem);

            // function that loops through html elements - nodes
            var nodeListForEach = function(list, callback) {
                for( var i = 0; i < list.length; i++) {
                    callback(list[i],i);
                }
            };

            
            nodeListForEach(fields,function(current, index) {
                if(percentages[index] > 0) {
                current.textContent = percentages[index] + ' %';
                }else {
                    current.textContent =' /';
                }
            });
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

            document.querySelector(DOMstrings.listContainer).addEventListener('click', controllDeleteItem);
    }

    var updateBudget = function() {

        // 1. calculate budget
        model.calculateBudget();
        // 2. return budget
        var budget = model.getBudget();
        // 3. update UI
        view.displayBudget(budget);
    }

    var updatePercentages = function() {
        // 1. calculate percentages
        model.calculatePercentages();
        // 2. read percentages from model
        var percentages = model.getPercentages();
        // 3. update the UI
        view.displayPercentages(percentages);
    }


    var controllAddItem = function() {
        // 1. Get input data
        var input = view.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

        // 2. Add new item to the DS
        var newItem = model.addItem(input.type, input.description, input.value);
        // 3. Display the data in the UI
        view.addListItem(newItem, input.type);
        view.clearInputFileds();
         
        // 4. calculate and display budget
        updateBudget();

        // 5. update percentages
        updatePercentages();

        }
    }

    var controllDeleteItem = function(event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if( itemID) {
            var splitID = itemID.split('-');
            var type = splitID[0];
            var ID = parseInt(splitID[1]);


            // 1. delete item from data structure
            model.deleteItem(type,ID);
            // 2. delete item from the UI
            view.deleteListItem(itemID);
            // 3. update and show the new budget
            updateBudget();
        }   
    };


    return {
        init: function() {
            view.displayBudget({
                budget: 0,
                income: 0,
                expenses: 0,
                percentage: 0
            });
            setUpEventListeners();
        }
    }

})(model, view);







controller.init();