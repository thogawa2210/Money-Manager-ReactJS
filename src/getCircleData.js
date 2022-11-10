
const getCircleData = (data) => {
    const transactions = data.transactions

    let incomeCategory = [];
    let expenseCategory = [];

    transactions.forEach((transaction) => {
        if(transaction.category_type === 'income'){
            if(incomeCategory.indexOf(transaction.category_name) === -1){
                incomeCategory.push(transaction.category_name);
            }
        }else{
            if(expenseCategory.indexOf(transaction.category_name) === -1){
                expenseCategory.push(transaction.category_name);
            }
        }
    })

    let income = [];
    let expense = [];

    incomeCategory.forEach((category) => {
        let amount = 0;
        transactions.forEach((transaction) => {
            if(transaction.category_name === category){
                amount += transaction.amount
            }
        })
        income.push({label: category, value: amount})
    });

    expenseCategory.forEach((category) => {
        let amount = 0;
        transactions.forEach((transaction) => {
            if(transaction.category_name === category){
                amount += transaction.amount
            }
        })
        expense.push({label: category, value: amount})
    });

    return {income:income, expense: expense}
}

export default getCircleData;