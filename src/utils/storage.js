const STORAGE_KEY = 'meanmachine_calculations';
const MAX_HISTORY_ITEMS = 10;

export function saveCalculation(calculationData) {
  try {
    const history = getCalculationHistory();

    const newCalculation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      numbers: [...calculationData.numbers],
      results: { ...calculationData.results },
      inputType: calculationData.inputType || 'custom',
    };

    history.unshift(newCalculation);

    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return newCalculation;
  } catch (error) {
    console.error('Failed to save calculation:', error);
    return null;
  }
}

export function getCalculationHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load calculation history:', error);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
}

export function getCalculationById(id) {
  const history = getCalculationHistory();
  return history.find(calc => calc.id === id);
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

  return date.toLocaleDateString();
}
