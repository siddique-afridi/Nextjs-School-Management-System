

function fruit(){
    const fruits = ["apple", "banana", "apple", "orange", "banana"];

const countFruits = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

console.log(countFruits);
// { apple: 2, banana: 2, orange: 1 }
}



// You have an array of numbers:
// Using reduce, count how many times each number appears.
// Expected result: { 2: 3, 5: 2, 7: 1, 9: 1 }
const anotherReduceExample = ()=> {

    const numbers = [2,3,7,6,2,4,7,3,6,9,0];
    
    const useReduce = numbers.reduce((acc,num)=> {
      acc[num] = (acc[num]||0) +1;
    
     
      return acc;
    }, {});
    console.log(useReduce)
}

anotherReduceExample()
fruit()