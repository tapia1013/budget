//                BUDGET CONTROLLER MODULE
var budgetController = (function () {
  // Expense
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Income
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;

    // loop over array
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    /*
    initial sum: 0
    [200,400,100]
    sum = 0 + 200
    sum = 200 + 400
    sum = 600 + 100 = 700
    */

    // Store sums in data var below
    data.totals[type] = sum;
  };

  // data object where all data is put
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    // for calculateBudge
    budget: 0,
    // set to -1 usually used to something nonexistent
    percentage: -1

  };

  return {
    // we need the type describtion and value
    addItem: function (type, des, val) {
      var newItem, ID;

      //[1 2 3 4 5], next ID = 6
      //[1 2 4 6 8], next ID = 9
      // ID = last ID + 1

      // CREATE NEW ID.......first select last element
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        // Add a new Expense
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        // Add a new Expense
        newItem = new Income(ID, des, val);
      }

      // PUSH IT INTO OUR DATA STRUCTURE.....We dont need any if or else to determine which arr to store the data
      data.allItems[type].push(newItem);

      // RETURN THE NEW ELEMENT
      return newItem;

    },
    // DELETE ITEM
    deleteItem: function (type, id) {
      var ids, index;

      // id = 3
      // data.allItems[type][id] // doesnt works
      // ids = [1 2 4 6 8]    remove #6
      // index = 3 to remove 

      // create an arr with all ID #, then find out what index ID input is... The difference between .forEach() and .map() is that map actually returns a brand new array
      var ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      // find the index you want to remove
      index = ids.indexOf(id);

      // delete index you removed
      if (index !== -1) {
        // splice(position # you want deleted, # of elements want to delete)
        data.allItems[type].splice(index, 1);
      }

    },
    // create function for the CtrlAddItem
    calculateBudget: function () {
      // Calculate total sums of income and expenses private func
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income we spent
      if (data.totals.inc > 0) {
        // Expense = 100 and icome 200, spent 50% = 100 / 200 = 0.5 * 100... we have to round to 2 decimals instead of alot of thm
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }



    },
    // return something from data structure
    getBudget: function () {

      // use object to return four values
      return {
        // place where we stored result of calculation
        budget: data.budget,
        // total income
        totalInc: data.totals.inc,
        // expeneses
        totalExp: data.totals.exp,
        // percentage
        percentage: data.percentage
      };

    },
    // ONLY FOR DEVELOPMENT NOT FOR PRODUCTION
    testing: function () {
      console.log(data);

    }
  }

})();





//                 UI MODULE/CONTROLLER
var UIController = (function () {
  // create private variable... stores all strings
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  };

  // public function/method
  // we return get input object
  return {
    getinput: function () {

      // A faster way to returning all 3 inputs is with objects
      return {
        // type will be either inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        // this originally returns a string so we convert to number
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    // we need the object and type(income or expense)
    addListItem: function (obj, type) {
      var html, newHtml, element;

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        // 1. Create html string with placeholder text
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // 2. Replace placeholder text with data from object
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // 3. Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    // Delte list items
    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);

      // move up DOM to remove child
      el.parentNode.removeChild(el);

    },

    // Clear Fields
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        // we want to clear all input fields
        current.value = "";
      });

      // Sets focused on first input after submitting
      fieldsArr[0].focus();

    },
    // need budget where all data is stored we use (obj)
    displayBudget: function (obj) {

      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;


      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    },
    // Get Dom strings
    getDOMstrings: function () {
      // return our private DOMstrings into the public
      return DOMstrings;

    }
  };


})();





//                  GLOBAL APP CONTROLLER
// Pass other modules as arguments
var controller = (function (budgetCtrl, UICtrl) {

  // set up event listeners
  var setupEventListeners = function () {
    // Define new varibale to get the DOMstrings
    var DOM = UICtrl.getDOMstrings();

    // Event listeners
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Add when enter is pressed instead of clicked on btn
    document.addEventListener('keypress', function (e) {
      // execute code when enter/return is pressed enter = 13
      // console.log(e);
      if (e.keyCode === 13 || e.which === 13) {
        // console.log('Enter was pressed!');
        // call the ctrlAdd function
        ctrlAddItem();
      }
    });
    // bubble
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };


  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. return the budget function
    var budget = budgetCtrl.getBudget();

    // 3. Display budget on the UI
    // console.log(budget);
    UICtrl.displayBudget(budget);
  }


  // Custom function
  var ctrlAddItem = function () {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getinput();
    // console.log(input);

    // use this cause it shows NaN when you press the enter button again... if desc is not blank, and if its not NaN it should be #
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add new item to UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. calculate and update budget
      updateBudget();
    }

    // console.log('It works!');
  };

  // DELETE ITEM
  var ctrlDeleteItem = function (e) {
    var itemID, splitID, type, ID;
    // get parent node of target
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // Inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      // converts string id to a number or else wont work deleting a number from the arr its in
      ID = parseInt(splitID[1]);

      // 1. Delete the item from data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI/page
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();


    }

  }

  // call the private setupEventlistener, make it public
  return {
    init: function () {
      console.log('App has started...');
      // run in the beginning set all inputs to 0
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });

      setupEventListeners();
    }
  };
})(budgetController, UIController);


// call init function
controller.init();











//                         EVENT BUBBLING
// It means when an event is fired or triggered on some DOM element, for example by clicking on our button on the html, then the exaact same event is also triggered on all of the PARENT elements.

// It first fires on the button but then it will also fire on all the PARENT elements, one at a time, so it will also fire on the paragraph, the section, the main elements all the way up in the DOM tree till the HTML element which is the root.

// The target element is what makes the bubble trigger. This means that all the parent elements on which will also fire will know the target element of the event. So where the event was first fired.

// It brings us to EVENT DELIGATION, becasue if the event bubbles up the DOM tree, and if we know where the event was fired, then we can simply attach an event handler to a parent element and wait for the event to bubble up, and we can then do whatever we inteded to do with our targeted element

// We can simply add the event handler to the main element.

// <main>
//   <section>
//     <p>Lorem ipsum dolor sit.</p>
//     <p>Lorem ipsum dolor sit. <button>link</button></p>
//   </section>
// </main>


//               USE CASES FOR EVENT DELEGATION
// 1. When we have an element with lots of child elements that we are interested in;
// 2 . When we want an event handler attached to an element that is not yet in the DOM when our page is loaded

















