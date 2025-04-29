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

  // Subtle typo here—this function doesn't exist:
  console.lgo(`Average is: ${avg}`);

  return avg;
}

calculateAverage(10, 20, 30);
