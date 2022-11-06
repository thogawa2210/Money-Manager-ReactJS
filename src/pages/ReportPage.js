import {Helmet} from "react-helmet-async";
import {AppWebsiteVisits} from "../sections/@dashboard/app";
import {AppBar, Box, Button, Grid, Toolbar, Typography} from "@mui/material";
import transaction from "../_mock/transaction";
import {useEffect} from "react";


function ReportPage() {


    useEffect(() => {
        let result = []

        transaction.forEach((transaction) => {
            if(Date.parse(transaction.date)>Date.parse("10/31/2022") && Date.parse(transaction.date)<Date.now()){
                result.push(transaction)
            }
        })

        console.log(result)

    },[])

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
                    title="Website Visits"
                    subheader="(+43%) than last year"
                    chartLabels={[
                        '01/01/2003',
                        '02/01/2003',
                        '03/01/2003',
                        '04/01/2003',
                        '05/01/2003',
                        '06/01/2003',
                        '07/01/2003',
                        '08/01/2003',
                        '09/01/2003',
                        '10/01/2003',
                        '11/01/2003',
                    ]}
                    chartData={[
                        {
                            name: 'Team A',
                            type: 'column',
                            fill: 'solid',
                            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                        },
                        {
                            name: 'Team D',
                            type: 'column',
                            fill: 'solid',
                            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                        },
                        {
                            name: 'Team B',
                            type: 'area',
                            fill: 'gradient',
                            data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                        },
                        {
                            name: 'Team C',
                            type: 'line',
                            fill: 'solid',
                            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                        },
                    ]}
                />
            </Grid>
        </>
    )
}

export default ReportPage;