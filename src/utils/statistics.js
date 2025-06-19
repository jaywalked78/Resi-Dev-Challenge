/**
 * Calculate the median (middle value) of a set of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The median value
 */
export function calculateMedian(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}

/**
 * Calculate the sample variance of a set of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The sample variance
 */
export function calculateVariance(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    if (numbers.length === 1) return 0; // No variance with single data point
    
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2));
    
    // Use sample variance (n-1) for better statistical accuracy with small datasets
    return squaredDifferences.reduce((sum, diff) => sum + diff, 0) / (numbers.length - 1);
}

/**
 * Calculate the range (difference between max and min) of a set of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The range value
 */
export function calculateRange(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    return max - min;
}

/**
 * Calculate the standard deviation of a set of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The standard deviation
 */
export function calculateStandardDeviation(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    
    return Math.sqrt(calculateVariance(numbers));
}

/**
 * Calculate the sum of a set of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The sum of all numbers
 */
export function calculateSum(numbers) {
    if (!numbers || numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Get the count of numbers in the array
 * @param {number[]} numbers - Array of numbers
 * @returns {number} The count of numbers
 */
export function calculateCount(numbers) {
    return numbers ? numbers.length : 0;
}

/**
 * Format a number for display with specified decimal places
 * @param {number|string} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value !== 'number') return value.toString();
    
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    }).format(value);
}

export function calculateAllStats(numbers) {
    if (!numbers || numbers.length === 0) {
        return {
            average: 0,
            median: 0,
            variance: 0,
            range: 0,
            standardDeviation: 0,
            sum: 0,
            count: 0
        };
    }

    return {
        average: calculateSum(numbers) / numbers.length,
        median: calculateMedian(numbers),
        variance: calculateVariance(numbers),
        range: calculateRange(numbers),
        standardDeviation: calculateStandardDeviation(numbers),
        sum: calculateSum(numbers),
        count: calculateCount(numbers)
    };
}