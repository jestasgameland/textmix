
//Good for splitting a sentence every 2 words, every 3 words, etc.

function chunkArray(arr, n) {   // n = size of chunk
  
  var listOfArrays = [];
  
  for (i=0; i<arr.length; i+=n) {
    if (i+n <= arr.length) {     //as long as it hasn't reached the end yet
      listOfArrays.push(arr.slice(i,i+n));
    }
    else {
      listOfArrays.push(arr.slice(i,arr.length));
    } ;
  };
  
  return listOfArrays;
}