export const USD_TO_INR = 83
const inrFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
export const usdToInr = (amountUsd) => (Number(amountUsd || 0) * USD_TO_INR) / 10
export const formatINR = (amount) => inrFormatter.format(Number(amount || 0))


