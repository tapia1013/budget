//                      TODO LIST
// Add event handler
// get input values
// Add the new item to our data structure
// Add the new item to the UI
// Calculate budget
// Update the UI

//           Structuring our code with modules
//  Modules:
//    1. Important aspect of any robust applications archtitecture
//    2. Keep the units of code for a project both cleanly separated and organized
//    3. Encapsulate some data into privacy and expose other data publicly



//       UI MODULE           |         DATA MODULE
//=============================================================
// Get inut values          | Add new item to our dataStructure
// Add the new item to UI   | Calculate Budget
// Update the UI            |
//                          |
//----------------------------------------------------------- 
// 
//                  CONTROLLER MODULE
// ===========================================================
//  Add Event Handler
// 
// 
//=============================================================

//************************************************************/






//                BUDGET CONTROLLER MODULE
// We use the module pattern to make private, closures and iife
// data model for expenses and income
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

  //                   ALl Expenses
  // var allExpenses = [];
  // var allIncomes = [];
  // var totalExpenses = 0;
  // allExpenses: [],
  // allIncomes: []

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
    percentageLabel: '.budget__expenses--percentage'
  };

  // public function/method
  // we return get input object
  return {
    getinput: function () {
      // read data from UI
      // Select something the do something with it will either be inc or exp
      // var type = document.querySelector('.add__type').value;
      // var description = document.querySelector('.add__description').value;
      // var value = document.querySelector('.add__value').value;

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
        html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // 2. Replace placeholder text with data from object
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);


      // 3. Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    // Clear Fields
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      // turn fields into an ARRAY with slice... using the call method and then passing fields var into it, so it becomes the "this" variable
      // fields.slice() // its in the array 

      // All the methods that arrays inherit from the arr func constructors are in the arr prototype property, so that means the slice method must be there
      fieldsArr = Array.prototype.slice.call(fields);

      // Now we can loop and clearr fields once we turn into array
      // Accepts 3 values, first is current value of the arr that is being processed, second index(zero to the length of the arr minus one, the entire arr)
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
  };



  // update budget for steps 5 and 6 from ctrlAddItem
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
})(budgetController, UIController); // budgetCtrl is the first argument and the UICtrl is the UIController


// call init function
controller.init();





































































// // We use the module pattern to make private, closures and iife
// // budgetController.publicTest(5) returns 28
// var budgetController = (function () {
//   var x = 23;

//   var add = function (a) {
//     return x + a;
//   }

//   // return object containing method
//   return {
//     // public has access to the add function cause of closure
//     publicTest: function (b) { // we pass 5 into ()
//       return add(b);
//     }
//   }

// })();


// //                   UI MODULE
// var UIController = (function () {
//   // code
// })()



// //                 CONTROLLER
// // Pass other modules as arguments
// var controller = (function (budgetCtrl, UICtrl) {

//   // budgetCtrl is budgetController
//   var z = budgetCtrl.publicTest(5)

//   return {
//     anotherPublic: function () {
//       console.log(z);
//     }
//   }

// })(budgetController, UIController) // budgetCtrl is the first argument and the UICtrl is the UIController



















































