import transaction from "./_mock/transaction";

export default function getDataBarChart(wallet, startDate, endDate){
    let result = []
    //Get transitions in time period
    transaction.forEach((transaction) => {
        if (Date.parse(transaction.date) >= Date.parse("11/01/2022")
            && Date.parse(transaction.date) <= Date.parse("11/30/2022")) {
            result.push(transaction)
        }
    })

    //get days of this month
    const month = new Date().getMonth()+1;
    const year = new Date().getFullYear();
    let daysInThisMonth = new Date(year, month, 0).getDate();

    //

    //get chartLabels in this month
    let chartLabels = [];
    for (let i = 0; i < daysInThisMonth; i++){
        if(i<9){
            chartLabels.push(`${month}/0${i+1}/${year}`)
        }else{
            chartLabels.push(`${month}/${i+1}/${year}`)
        }
    }

    // get income and expense by day
    let dataIncome = [];
    let dataExpense = [];

    chartLabels.forEach((date) => {
        let income = 0;
        let expense = 0;
        result.forEach((transaction) => {
            if (transaction.date === date){
                if(transaction.type === 'income'){
                    income += transaction.amount;
                }else {
                    expense += transaction.amount;
                }
            }
        })
        dataIncome.push(income);
        dataExpense.push(expense);
    });
    const chartData=[
        {
            name: 'Income',
            type: 'column',
            fill: 'solid',
            data: dataIncome,
        },
        {
            name: 'Expense',
            type: 'column',
            fill: 'solid',
            data: dataExpense,
        }
    ]

    return {chartLabels:chartLabels, chartData:chartData}

}