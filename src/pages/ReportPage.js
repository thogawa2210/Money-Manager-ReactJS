import {Helmet} from "react-helmet-async";
import {AppWebsiteVisits} from "../sections/@dashboard/app";
import {AppBar, Box, Button, Grid, Toolbar, Typography} from "@mui/material";
import transaction from "../_mock/transaction";
import {useEffect, useState} from "react";


function ReportPage() {

    const [chartLabels, setChartLabels] = useState([])
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        let result = []

        transaction.forEach((transaction) => {
            if (Date.parse(transaction.date) >= Date.parse("11/01/2022") && Date.parse(transaction.date) <= Date.parse("11/30/2022")) {
                result.push(transaction)
            }
        })

        //get days of month
        const month = new Date().getMonth()+1;
        const year = new Date().getFullYear();
        let daysInThisMonth = new Date(year, month, 0).getDate();
        let chartLabels = [];
        for (let i = 0; i < daysInThisMonth; i++){
            if(i<9){
                chartLabels.push(`${month}/0${i+1}/${year}`)
            }else{
                chartLabels.push(`${month}/${i+1}/${year}`)
            }
        }
        setChartLabels(chartLabels)

        // get income and expense by day
        let dataIncome = [];
        let dataExpense = [];
        chartLabels.forEach((date) => {
            let income = 0;
            let expense = 0;
            console.log(result)
            result.forEach((transaction) => {
                if (transaction.date === date){
                    console.log(1)
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
        setChartData(chartData)
    }, [])

    return (
        <>
            <Helmet>
                <title> Report | Money Manager Master </title>
            </Helmet>

            <AppBar position="static" color="inherit">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Expense report
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Grid item xs={12} md={6} lg={8}>
                <AppWebsiteVisits
                    title="This month Reports"
                    subheader="(+43%) than last year"
                    chartLabels={chartLabels}
                    chartData={chartData}
                />
            </Grid>
        </>
    )
}

export default ReportPage;