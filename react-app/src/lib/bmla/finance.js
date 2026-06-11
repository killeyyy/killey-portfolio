// Cost/revenue/break-even math (pure).
export function breakEven(fixed, price, unitCost) {
  const margin = price - unitCost;
  return margin > 0 ? fixed / margin : null;
}

export function totals(q, fixed, price, unitCost) {
  return { cost: fixed + unitCost * q, revenue: price * q, profit: price * q - (fixed + unitCost * q) };
}
