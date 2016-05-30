/* Реализовать функцию add(x)(y), которая будет работать следующим образом: add(2)(3) = 5; */

function sum(a) {
    return function(b) {
        return a + b;
    };
};

console.log(sum(5)(7)); //12
console.log(sum(2)(3)); //5

// Написать функцию, которая вернет клон переданного объекта;

function clone(obj) {
    if (typeof obj !== 'object' || 'activeClone' in obj) {
        return obj;
    }
    var newObj = obj.constructor();
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['activeClone'] = null;
            newObj[key] = clone(obj[key]);
            delete obj['activeClone'];
        }
    }
    return newObj;
}

var user = {
    name: "Name",
    country: "Country",
    subObj:
    {
        text: '123'
    }
};

var newUser = clone(user);
console.log(newUser.name);
console.log(newUser.country);

/*
Результат выражений:
+!{}[0]
!+[0]
!-[1]
итог и решение по шагам;

1. +!{}[0] = 1
    1.1 {}[0] - undefined, так как создается пустой объект, у которого нет свойства 0 (если бы был вне выражения, было бы = [0], так как тогда скобки означали бы блок)
    1.2 !(undefined) - undefined вернет false, инверсия даст true
    1.3 +!{}[0] - унарный плюс преобразует true к 1


2. !+[0] = true;
    2.1 +[0] - вернет 0 (number), так как массив создан литералом и имеет всего один элемент.
    2.2 !+[0] - вернет true, так как сначала ! (лог. не) приведет 0 к булевому типу - это false, а затем инвертирует значение на true.

3. !-[1] = false
    3.1 -[1] - вернет первый элемент массива с противоположным знаком (-1)
    3.2 !-[1] - при приведении любого числа, кроме 0, к булевому типу, получаем true. ! инвертирует результат, в итоге получим false.
    
*/


////////////////////////////////////////////////////////////////
// function Point() {
//  this.x = 20;
//  this.getX = function() { return this.x; }
// }

// var a = new Point();
// var f = a.getX;
// console.log(f()); - что напечатает и как поправить.

// Выдаст undefined, так как при вызове f() не будет определен контекст и x будет принята за windows.x.
// Чтобы получить 20, нужно привязать контекст a:

// function Point() {
//  this.x = 20;
//  this.getX = function() { return this.x; };
// }

// var a = new Point();
// var f = a.getX;
// console.log(f.bind(a)());

///////////////////////////////////////////////////////////////////////////////

//Реализовать функцию, реализующую реверс строки;


function revers(str) {
  return str.split('')
            .reverse()
            .join('');
}

console.log(revers('abc sdsd'));

/////////////////////////////////////////////////////////

// Сконвертировать массив чисел в массив функций, возвращающие числа, было a[i] == 5, стало a[i]() == 5;

Arr = [1, 2, 3, 4, 5];

var newArr = Arr.map(item => (() => item)
);

if (newArr[1]() == 2) {
  console.log('true');
}

/////////////////////////////////////////////////////

// Дано:
// function add(x, y) {
//  return x + y;
// }

// function mul(x, y) {
//  return x * y;
// }

// function calc(x){
// }

// var result = calc(1)(2)(3)(4)(5);

// console.assert(result(add) == 15);
// console.assert(result(mul) == 120);
// Реализовать функцию calc, количество чисел может быть любым;

function add(x, y) {
 return x + y;
}

function mul(x, y) {
 return x * y;
}

function calc(x) {
  var arr = [x];
  function func(y) {
    if (typeof(y) == 'function') {
        return arr.reduce(y);
     }
    arr.push(y);
    return func;
  }
  return func;  
}

var result = calc(1)(2)(3)(4)(5);

console.assert(result(add) == 15);
console.assert(result(mul) == 120);