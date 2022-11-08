import { Helmet } from 'react-helmet-async';
import { forwardRef, useState } from 'react';
import { Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Stack, TableBody, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Swal from 'sweetalert2';
import axios from 'axios';
import { changeFlag } from 'src/features/flagSlice';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'src/theme/overrides/Table';
import Paper from '@mui/material/Paper';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import PropTypes from 'prop-types';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



export default function ProductsPage() {
  const dispatch = useDispatch();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState({
    name: '',
    type: '',
    icon: ''
  })
  const [openAddForm, setOpenAddForm] = useState(false);
  const idUser = JSON.parse(localStorage.getItem('user')).user_id
  const handleClickOpenCreateCategory = () => {
    setOpenCreateCategory(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateCategory(false);
  };
  const handleChangeCreate = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmitCreate = async () => {
    setOpenAddForm(false);
    let data = {
      icon: icon,
      name: category.name,
      type: type,
      user_id: idUser
    }

    if (category.name === '') {
      setOpenCreateCategory(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
      });
    } else {
      const result = await axios.post('http://localhost:3001/category/add-category', data)
      if (result.data.type === "success") {
        Swal.fire({
          icon: 'success',
          title: 'Create Category Successfully!'
        }).then(
          setOpenCreateCategory(false),
          dispatch(changeFlag(1)),
          setCategory({
            ...category,
            name: '',
          }),
          setIcon('')
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Your name of category already exist',

        })
        setOpenCreateCategory(false)
        setCategory({
          name: '',
          type: '',
          icon: ''
        })
      }
    }
  }
  const handleChangeIcon = (event) => {
    setIcon(event.target.value);
  };
  const handleChangeType = (event) => {
    setType(event.target.value);
  };
// Table detail category

  return (
    <>
      <Button onClick={handleClickOpenCreateCategory}> Create</Button>
      {/* Dialog create wallet/>*/}
      <Dialog
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth='md'
        keepMounted
        open={openCreateCategory}
        onClose={handleCloseCreate}>
        <DialogTitle>{"Add Wallet"}</DialogTitle>
        <DialogContentText>
        </DialogContentText>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Select icon */}
            <Grid item xs={2}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 100 }}>
                  <InputLabel id="demo-simple-select-label">Icon</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="icon"
                    name="icon"
                    onChange={(event) => handleChangeIcon(event)}
                    sx={{ height: 55 }}
                  >
                    <MenuItem value={`/assets/icons/category/car.svg`}>
                      <Avatar src={`/assets/icons/category/car.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/category/food.svg`}>
                      <Avatar src={`/assets/icons/category/food.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/category/house.svg`}>
                      <Avatar src={`/assets/icons/category/house.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/category/salary.svg`}>
                      <Avatar src={`/assets/icons/category/salary.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={5} >
              <TextField name="name" onChange={handleChangeCreate} fullWidth={true} label="Name Category" variant="outlined" value={category.name} />
            </Grid>
            {/*  */}
            <Grid item xs={2}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 300 }}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="type"
                    name="type"
                    onChange={(event) => handleChangeType(event)}
                    sx={{ height: 55 }}
                  >
                    <MenuItem value={`expense`}>
                      Expense
                    </MenuItem>
                    <MenuItem value={`income`}>
                      Income
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCreate}>Cancel</Button>
          <Button variant="contained" startIcon={<Iconify icon="uis:check" />} onClick={handleSubmitCreate}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Table Category */}
    </>
  );
}
