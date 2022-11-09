import { Helmet } from 'react-helmet-async';
import { forwardRef, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Slide,
  Stack,
  TableFooter,
  TablePagination,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { changeFlag } from 'src/features/flagSlice';
import { useDispatch, useSelector } from 'react-redux';

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

const currencies = [
  {
    value: 'expense',
    label: 'expense',
  },
  {
    value: 'income',
    label: 'income',
  },
];

export default function ProductsPage() {
  const flag = useSelector((state) => state.flag);
  const dispatch = useDispatch();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    name: '',
    type: '',
    icon: '',
  });
  const [openAddForm, setOpenAddForm] = useState(false);

  const idUser = JSON.parse(localStorage.getItem('user')).user_id;
  const handleClickOpenCreateCategory = () => {
    setOpenCreateCategory(true);
  };
  const handleCloseCreate = () => {
    setOpenCreateCategory(false);
  };
  const handleChangeCreate = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitCreate = async () => {
    setOpenAddForm(false);
    let data = {
      icon: icon,
      name: category.name,
      type: type,
      user_id: idUser,
    };

    if (category.name === '') {
      setOpenCreateCategory(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
        showConfirmButton : false,
        timer : 1500
      });
    } else {
      const result = await axios.post('http://localhost:3001/category/add-category', data);
      if (result.data.type === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Create Category Successfully!',
          showConfirmButton : false,
          timer : 1500
         
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
          showConfirmButton : false,
          timer : 1500
        })
        setOpenCreateCategory(false)
        setCategory({
          name: '',
          type: '',
          icon: '',
        });
      }
    }
  };
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
      confirmButtonColor: '#54D62C',
      cancelButtonColor: '#FF4842’',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`http://localhost:3001/category/delete-category/${id}`)
          .then((res) => {
            dispatch(changeFlag(1));
          })
          .catch(err => console.log(err))
        Swal.fire({
          icon : 'success',
          text : 'Deleted!',
          title : 'Category has been deleted.',
          showConfirmButton : false,
          timer : 1500
        })
     
      }
    });
  };

  //  Update Category
  //  Xu li lay form du lieu
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [iconEdit, setIconEdit] = useState('');
  const [typeEdit, setTypeEdit] = useState('');
  const [textEdit, setTextEdit] = useState('');
  const [editForm, setEditForm] = useState({});

  const handleChangeIconEdit = (event) => {
    setIconEdit(event.target.value);
  };
  const handleChangeTypeEdit = (event) => {
    setTypeEdit(event.target.value);
  };
  const handleChangeText = async (e) => {
    setTextEdit({
      ...textEdit,
      [e.target.name]: e.target.value,
    });
  };
  const data = {
    icon: iconEdit,
    name: textEdit.name,
    type: typeEdit,
    user_id: idUser,
  };
  console.log(data);
  // Xử lý hàm trả về thông tin update

  const handleCloseEdit = () => {
    setOpenEditCategory(false);
  };
  const handleClickOpenCategory = async (id) => {
    await axios.get(`http://localhost:3001/category/get-category-id/${id}`).then((res) => {
      setEditForm(res.data.category);
      setOpenEditCategory(true);
    });
  };

  const handleSubmitCateEdit = async () => {
    setOpenEditCategory(false);
    if (data.name === '' || data.icon === '' || data.type === '') {
      setOpenEditCategory(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
        showConfirmButton : false,
        timer : 1500
      });
    } else {
      Swal.fire({
        title: 'Are you sure to edit?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#54D62C',
        cancelButtonColor: '#FF4842',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .put(` http://localhost:3001/category/update-categody/${editForm._id}`, data)
            .then((res) => {
              dispatch(changeFlag(1));
            })
            .catch(err => console.log(err))
          Swal.fire({
            icon : 'success',
            title : 'Edited!',
            text : 'Category has been edited.',
            showConfirmButton : false,
            timer : 1500
        })
        }
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Category | Money Manager Master</title>
      </Helmet>

      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ padding: '0px', height: '50px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h3">Category</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleClickOpenCreateCategory}
            >
              New Category
            </Button>
          </Stack>
        </Grid>
        <Grid item xs />
        <Grid item xs={9} sx={{ padding: 0 }}>
          <Stack>
            <Grid>
              <Grid>
                <Card>
                  <CardContent sx={{ pb: 0 }}>
                    {/* Table */}
                    <Table sx={{ minWidth: 'auto' }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Icon</TableCell>
                          <TableCell align="center">Name Category</TableCell>
                          <TableCell align="center">Type&nbsp;</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <ListSubheader>Expense</ListSubheader>

                        {categories.map((item, index) => {
                          if (item.type == 'expense')
                            return (
                              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center">
                                  <Avatar src={item.icon}></Avatar>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>{item.name}</strong>
                                </TableCell>
                                <TableCell align="center">{item.type}</TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="outlined"
                                    color="success"
                                    onClick={() => handleClickOpenCategory(item._id)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDeleteCategory(item._id)}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                        })}

                        <ListSubheader>InCome</ListSubheader>

                         {categories.map((item,index)=> {
                          if (item.type == "income") 
                          return (
                            <TableRow key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="center"><Avatar src={item.icon} ></Avatar></TableCell>
                            <TableCell align="center"><strong>{item.name}</strong></TableCell>
                            <TableCell align="center">{item.type}</TableCell>
                            <TableCell align="center">
                              <Button variant="outlined" color="success" onClick={() => handleClickOpenCategory(item._id)}>Edit</Button>
                              <Button variant="outlined" color="error" onClick={() => handleDeleteCategory(item._id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                          )  
                        })}
         
                    
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
        maxWidth="md"
        keepMounted
        open={openCreateCategory}
        onClose={handleCloseCreate}
      >
        <DialogTitle>{'Add Category'}</DialogTitle>
        <DialogContentText></DialogContentText>
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
            <Grid item xs={5}>
              <TextField
                name="name"
                onChange={handleChangeCreate}
                fullWidth={true}
                label="Name Category"
                variant="outlined"
                value={category.name}
              />
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
                    <MenuItem value={`expense`}>Expense</MenuItem>
                    <MenuItem value={`income`}>Income</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseCreate}>Cancel</Button>
          <Button variant="outlined" color="success" onClick={handleSubmitCreate}>Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Update Category */}
      <Dialog
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth="md"
        keepMounted
        open={openEditCategory}
        onClose={handleCloseCreate}
      >
        <DialogTitle>{'Edit Category'}</DialogTitle>
        <DialogContentText></DialogContentText>
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
                    onChange={(event) => handleChangeIconEdit(event)}
                    sx={{ height: 55 }}
                    value={editForm.icon + ''}
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
            <Grid item xs={5}>
              <TextField
                name="name"
                onChange={(e) => handleChangeText(e)}
                fullWidth={true}
                variant="outlined"
                placeholder={editForm.name}
              />
            </Grid>
            <Grid item xs={2}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 300 }}>
                  {/* <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="type"
                    name="type"
                    onChange={(event) => handleChangeTypeEdit(event)}
                    sx={{ height: 55 }}
                    value={editForm.type + ''}
                  >
                    <MenuItem value={`expense`}>
                      Expense
                    </MenuItem>
                    <MenuItem value={`income`}>
                      Income
                    </MenuItem>
                  </Select> */}

                  <TextField
                    id="outlined-select-currency"
                    select
                    label="Type"
                    onChange={(event) => handleChangeTypeEdit(event)}
                    placeholder={editForm.type + ''}
                    helperText="Please select your currency"
         
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="outlined"  color="success" onClick={handleSubmitCateEdit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
