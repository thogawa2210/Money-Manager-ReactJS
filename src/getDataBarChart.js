export default function getDataBarChart(data) {
  const transactions = data.transactions;
  const chartLabels = [];
  const dataIncome = [];
  const dataExpense = [];

  transactions.forEach((transaction) => {
    const { amount, category_type, date } = transaction;

    // Split date into day, month, and year
    const [month, day, year] = date.split('/');

    // Format the date as "MM/dd/YYYY"
    const formattedDate = `${month}/${day}/${year}`;

    // Add the formatted date to the days array if it doesn't exist
    if (!chartLabels.includes(formattedDate)) {
      chartLabels.push(formattedDate);
    }

    // Calculate the total income and expense for each day
    if (category_type === 'income') {
      if (dataIncome[formattedDate]) {
        dataIncome[formattedDate] += amount;
      } else {
        dataIncome[formattedDate] = amount;
      }
    } else if (category_type === 'expense') {
      if (dataExpense[formattedDate]) {
        dataExpense[formattedDate] += amount;
      } else {
        dataExpense[formattedDate] = amount;
      }
    }
  });

  const incomeByDay = Object.values(dataIncome);
  const expenseByDay = Object.values(dataExpense);

  const chartData = [
    { name: 'Income', type: 'column', fill: 'solid', data: incomeByDay },
    { name: 'Expense', type: 'column', fill: 'solid', data: expenseByDay },
  ];

  return { chartLabels, chartData };
}
