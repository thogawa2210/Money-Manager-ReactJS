import { Helmet } from 'react-helmet-async';
import { forwardRef, useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Stack, TableFooter, TablePagination, TextField, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { changeFlag } from 'src/features/flagSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionEdit = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ProductsPage() {
  const flag = useSelector((state) => state.flag);
  const dispatch = useDispatch();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const [categories, setCategories] = useState([])
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
  const getWallet = async () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return await axios.get(` http://localhost:3001/category/get-category-byuser/${userId.user_id}`, idUser);
  };

  useEffect(() => {
    getWallet()
      .then((res) => setCategories(res.data.categoryOfUser))
      .catch((error) => console.log(error.message));
  }, [flag]);

  const handleDeleteCategory = (id) => {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3001/category/delete-category/${id}`)
          .then(res => {
            dispatch(changeFlag(1))
          })
          .catch(err => console.log(err))
        Swal.fire(
          'Deleted!',
          'Category has been deleted.',
          'success'
        )
      }
    });
  };
  // Update Category
  const [categoryEdit, setCategoryEdit] = useState([])


  const handleClickEditAddForm = (id) => {
    const editCategory = categories.filter((categories) => categories._id === id);
    setCategoryEdit(editCategory[0]);
    setOpenEditCategory(true);
  };

  const [iconEdit, setIconEdit] = useState('');
  const [openEditCategory, setOpenEditCategory] = useState(false);

  const handleCloseEdit = () => {
    setCategoryEdit([])
    setOpenEditCategory(false);
  };
  const handleChangeIconEdit = (event) => {
    setIconEdit(event.target.value);
  };
  const handleChangeEdit = (e) => {
    setCategoryEdit({
      ...categoryEdit,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmitEdit = async () => {

  }
  console.log(categoryEdit)
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ padding: '0px', height: '50px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h3">Category</Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenCreateCategory}>
              New Category
            </Button>
          </Stack>
        </Grid>
        <Grid item xs />
        <Grid item xs={8} sx={{ padding: 0 }}>
          <Stack>
            <Grid>
              <Grid>
                <Card>
                  <CardContent sx={{ pb: 0 }}>
                    {/* Table */}
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>N.O</TableCell>
                          <TableCell align="center">Icon</TableCell>
                          <TableCell align="center">Name Category</TableCell>
                          <TableCell align="center">Type&nbsp;</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.map((item, index) => (
                          <TableRow key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">{index + 1}</TableCell>
                            <TableCell align="center"><Avatar src={item.icon}></Avatar></TableCell>
                            <TableCell align="center"><strong>{item.name}</strong></TableCell>
                            <TableCell align="right">{item.type}</TableCell>
                            <TableCell align="right">
                              <Button variant="outlined" color="success" onClick={() => handleClickEditAddForm(item._id)}>Edit</Button>
                              <Button variant="outlined" color="error" onClick={() => handleDeleteCategory(item._id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))}

                      </TableBody>
                    </Table>
                    {/* Done Table */}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs />
      </Grid>

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
      {/* Update Category */}
      <Dialog
        TransitionComponent={TransitionEdit}
        fullWidth={true}
        maxWidth='md'
        keepMounted
        open={openEditCategory}
        onClose={handleCloseEdit}>
        <DialogTitle>{"Edit Wallet"}</DialogTitle>
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
                    value={categoryEdit.icon}
                    onChange={(event) => handleChangeIconEdit(event)}
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
              <TextField name="name" onChange={handleChangeEdit} fullWidth={true} label="Name Category" variant="outlined" value={categoryEdit.name}/>
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
                    value={categoryEdit.type}
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
          <Button variant="outlined" onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" startIcon={<Iconify icon="uis:check" />} onClick={handleSubmitEdit}>Save</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
