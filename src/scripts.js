/**
 * Calculates the average of an array of numbers, logs it, and returns the result.
 *
 * @param {number[]} nums
 * @returns {number}
 * @throws {Error} if nums is empty or not an array
 */
function calculateAverage(nums) {
  if (!Array.isArray(nums) || nums.length === 0) {
    throw new Error('You must provide a non-empty array of numbers.');
  }

  const total = nums.reduce((sum, n) => sum + n, 0);
  const avg = total / nums.length;

  // Fixed typo: console.log instead of console.lgo
  console.log(`Average is: ${avg}`);

  return avg;
}

// Test the function with an array of numbers
try {
  const testNumbers = [10, 20, 30, 40, 50];
  const result = calculateAverage(testNumbers);
  console.log('Test passed! Result:', result);
} catch (error) {
  console.error('Test failed:', error.message);
}

// Add event listener for the button when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('calculate-btn');
  if (button) {
    button.addEventListener('click', () => {
      try {
        // Call the function with an array (fixing the original incorrect call)
        const result = calculateAverage([10, 20, 30]);
        alert(`The average is: ${result}`);
      } catch (error) {
        console.error('Error calculating average:', error.message);
        alert('Error: ' + error.message);
      }
    });
  }
});
