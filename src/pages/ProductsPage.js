import { Helmet } from 'react-helmet-async';
import { forwardRef, useState } from 'react';
import { Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Slide, Stack, TextField, Typography } from '@mui/material';
import PRODUCTS from '../_mock/products';
import Iconify from 'src/components/iconify';
import Swal from 'sweetalert2';
import axios from 'axios';
import dayjs from 'dayjs';
import { changeFlag } from 'src/features/flagSlice';
import { useDispatch, useSelector } from 'react-redux';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductsPage() {
  const dispatch = useDispatch();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState({
    name: '',
    type : '',
    icon : ''
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
          name : '',
          type : '',
          icon : ''
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

                    <MenuItem value={`/assets/icons/wallets/cash.svg`}>
                      <Avatar src={`/assets/icons/wallets/cash.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/wallets/card.svg`}>
                      <Avatar src={`/assets/icons/wallets/card.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/wallets/credit-card.svg`}>
                      <Avatar src={`/assets/icons/wallets/credit-card.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/wallets/saving.svg`}>
                      <Avatar src={`/assets/icons/wallets/saving.svg`} sx={{ mr: 0 }} />
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
                <FormControl sx={{ width : 300 }}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="type"
                    name="type"
                    onChange={(event)=> handleChangeType(event)}
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
    </>
  );
}
