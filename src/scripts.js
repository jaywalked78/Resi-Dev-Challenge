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

// Import the calculator modal
import { CalculatorModal } from './components/CalculatorModal.js';

// Initialize calculator modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create modal instance
  const calculatorModal = new CalculatorModal(calculateAverage);
  
  // Add event listener for the button
  const button = document.getElementById('calculate-btn');
  if (button) {
    button.addEventListener('click', () => {
      calculatorModal.open();
    });
  }
  
  // Add keyboard shortcut (Ctrl/Cmd + K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      calculatorModal.open();
    }
  });
});
