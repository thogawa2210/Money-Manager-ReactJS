const getCircleData = (data) => {
    const transactions = data.transactions;
  
    const categories = {
      income: new Map(),
      expense: new Map(),
    };
  
    transactions.forEach((transaction) => {
      const { category_type, category_name, amount } = transaction;
      const categoryMap = categories[category_type];
      const currentAmount = categoryMap.get(category_name) || 0;
      categoryMap.set(category_name, currentAmount + amount);
    });
  
    const income = Array.from(categories.income, ([label, value]) => ({ label, value }));
    const expense = Array.from(categories.expense, ([label, value]) => ({ label, value }));
  
    return { income, expense };
  };
  
  export default getCircleData;
  