export default function getDataBarChart(data){
    const transactions = data.transactions;
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    let chartLabels = [];
    let dataIncome = [];
    let dataExpense = [];

    if(startMonth === endMonth){
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        for(let i = startDay; i <= endDay; i++) {
            if(i<10){
                chartLabels.push(`${startMonth+1}/0${i}/2022`)
            }else{
                chartLabels.push(`${startMonth+1}/${i}/2022`)
            }
        }

        chartLabels.forEach((date) => {
            let income = 0;
            let expense = 0;
            transactions.forEach((transaction) => {
                if (transaction.date === date){
                    if(transaction.category_type === 'income'){
                        income += transaction.amount;
                    }else {
                        expense += transaction.amount;
                    }
                }
            })
            dataIncome.push(income);
            dataExpense.push(expense);
        });
    }else{
        for(let i=startMonth; i <= endMonth; i++) {
            chartLabels.push(`${i+1}/01/2022`)
        }

        chartLabels.forEach((month)=>{
            let income = 0;
            let expense = 0;
            transactions.forEach((transaction) => {
                if(new Date(transaction.date).getMonth() === new Date(month).getMonth()){
                    if(transaction.category_type === 'income'){
                        income += transaction.amount;
                    }else {
                        expense += transaction.amount;
                    }
                }
            })
            dataIncome.push(income);
            dataExpense.push(expense);
        })
    }

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