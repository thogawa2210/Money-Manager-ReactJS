import {useTheme} from "@mui/material/styles";
import {Grid} from "@mui/material";
import {AppCurrentVisits} from "../sections/@dashboard/app";
import Box from '@mui/material/Box';

export default function ChartPage() {
    const theme = useTheme();

    return (
        <>
            <Box sx={{mt:'10px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                        <AppCurrentVisits
                            title="Income"
                            chartData={[
                                {label: 'America', value: 9000},
                                {label: 'Asia', value: 5435},
                                {label: 'Europe', value: 1443},
                                {label: 'Africa', value: 4443},
                            ]}
                            chartColors={[
                                theme.palette.primary.main,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ]}
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <AppCurrentVisits
                            title="Expense"
                            chartData={[
                                {label: 'America', value: 9000},
                                {label: 'Asia', value: 5435},
                                {label: 'Europe', value: 1443},
                                {label: 'Africa', value: 4443},
                            ]}
                            chartColors={[
                                theme.palette.primary.main,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ]}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}