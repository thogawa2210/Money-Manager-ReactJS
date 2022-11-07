import {Helmet} from "react-helmet-async";
import {AppWebsiteVisits} from "../sections/@dashboard/app";
import {AppBar, Box, Button, Grid, Toolbar, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import getDataBarChart from "../getDataBarChart";


function ReportPage() {

    const [chartLabels, setChartLabels] = useState([])
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const data = getDataBarChart('cash', '11/01/2022', '11/30/2022');
        setChartLabels(data.chartLabels);
        setChartData(data.chartData);
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