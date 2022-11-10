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
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Slide,
  Stack,
  Tab,
  TableFooter,
  TablePagination,
  Tabs,
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
import mockExpense from 'src/_mock/categoryExpense';
import mockIncome from 'src/_mock/categoryIncome';
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
// Tab Detail

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function ProductsPage() {
  // Tab detail
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Done


  const idUser = JSON.parse(localStorage.getItem('user')).user_id;
  const flag = useSelector((state) => state.flag);
  const dispatch = useDispatch();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    name: '',
    type: '',
    icon: ''
  });
  const [openAddForm, setOpenAddForm] = useState(false);
  // Create
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
      icon: category.icon,
      name: category.name,
      type: category.type,
      user_id: idUser,
    };
    if (category.name === '' || category.type === '') {
      setOpenCreateCategory(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      const result = await axios.post('http://localhost:3001/category/add-category', data);
      if (result.data.type === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Create Category Successfully!',
          showConfirmButton: false,
          timer: 1500
        }).then(
          setCategory({
            ...category,
            icon: null,
            name: '',
            type: null
          }),
          setOpenCreateCategory(false),
          dispatch(changeFlag(1)),
        )
          .catch((error) => console.log(error.message));
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Your name of category already exist',
          showConfirmButton: false,
          timer: 1500,
        });
        setOpenCreateCategory(false);
        setCategory({
          icon: '',
          name: '',
          type: '',
        });
      }
    }
  };

  // Table detail category
  const getCategories = async () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return await axios.get(` http://localhost:3001/category/get-category-byuser/${userId.user_id}`, idUser);
  };

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categoryOfUser))
      .catch((error) => console.log(error.message));
  }, [flag]);

  // Delete Category
  const handleDeleteCategory = (id) => {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54D62C',
      cancelButtonColor: '#FF4842'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`http://localhost:3001/category/delete-category/${id}`)
          .then((res) => {
            dispatch(changeFlag(1));
            Swal.fire({
              icon: 'success',
              text: 'Deleted!',
              title: 'Category has been deleted.',
              showConfirmButton: false,
              timer: 1500
            })
          })
          .catch(err => console.log(err))
      }
    });
  };

  //  Update Category
  //  Xu li lay form du lieu
  const [openEditCategory, setOpenEditCategory] = useState(false);

  const [editForm, setEditForm] = useState([]);

  const handleChangeEdit = async (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }



  // Xử lý hàm trả về thông tin update

  const handleCloseEdit = () => {
    setOpenEditCategory(false);
  };
  const handleClickOpenCategory = async (id) => {
    const categoryEditForm = categories.filter((cate) => cate._id === id);
    setEditForm(categoryEditForm[0]);
    setOpenEditCategory(true);
  };

  const data = {
    icon: editForm.icon,
    name: editForm.name,
    type: editForm.type,
  };

  const handleSubmitCateEdit = async () => {
    setOpenEditCategory(false);
    if (data.name === '' || data.icon === '' || data.type === '') {
      setOpenEditCategory(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
        showConfirmButton: false,
        timer: 1500,
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
              Swal.fire({
                icon: 'success',
                title: 'Edited!',
                text: 'Category has been edited.',
                showConfirmButton: false,
                timer: 1500
              })
              setEditForm({
                ...editForm,
                icon: '',
                name: '',
                type: ''
              })
            })
            .catch(err => console.log(err))

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
                    <Box sx={{ flexGrow: 10, bgcolor: 'background.paper', display: 'flex', height: 400 }}>
                      <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                      >
                        <Tab label="InCome" {...a11yProps(0)} />
                        <Tab label="Expense" {...a11yProps(1)} />
                      </Tabs>
                      <TabPanel value={value} index={0}>
                        <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Icon</TableCell>
                              <TableCell align="center">Name Category</TableCell>
                              <TableCell align="center">Type&nbsp;</TableCell>
                              <TableCell align="center">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categories.map((item, index) => {
                              if (item.type === 'income')
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
                          </TableBody>
                        </Table>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
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
                            {categories.map((item, index) => {
                              if (item.type === "expense")
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
                          </TableBody>
                        </Table>
                      </TabPanel>
                    </Box>
                    {/* Done Table */}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs />
      </Grid>

      {/* Dialog create category/>*/}
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
            {/*  */}
            <Grid item xs={5}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 340 }}>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="type"
                    name="type"
                    onChange={handleChangeCreate}
                    sx={{ height: 55 }}
                  >
                    <MenuItem value={`expense`}>Expense</MenuItem>
                    <MenuItem value={`income`}>Income</MenuItem>
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
                    onChange={handleChangeCreate}
                    sx={{ height: 55 }}
                  >
                    {category.type === "expense" ? mockExpense.map((item) => {
                      return (
                        <MenuItem value={item.icon}>
                          <Avatar src={item.icon} sx={{ mr: 0 }} />
                        </MenuItem>
                      )
                    }

                    ) : mockIncome.map((item) => {
                      return (
                        <MenuItem value={item.icon}>
                          <Avatar src={item.icon} sx={{ mr: 0 }} />
                        </MenuItem>
                      )

                    })}

                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseCreate}>
            Cancel
          </Button>
          <Button variant="outlined" color="success" onClick={handleSubmitCreate}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Category */}
      <Dialog
        TransitionComponent={TransitionEdit}
        fullWidth
        maxWidth="md"
        keepMounted
        open={openEditCategory}
        onClose={() => handleCloseEdit(false)}
      >
        <DialogTitle>{'Edit category'}</DialogTitle>
        <DialogContentText></DialogContentText>
        <DialogContent>
          <Grid container spacing={2}>

            <Grid item xs={5} >

              <TextField
                sx={{ minWidth: 340 }}
                id="outlined-select-currency"
                select
                name='type'
                label="Type"
                onChange={handleChangeEdit}
                helperText="Please select your currency"
                value={editForm.type + ''}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>


            <Grid item xs={5}>
              <TextField

                name="name"
                InputProps={{ startAdornment: <InputAdornment position="start">Name</InputAdornment> }}
                onChange={handleChangeEdit}
                fullWidth
                variant="outlined"
                value={editForm.name}
              />
            </Grid>
            <Grid item xs={2}>
              {/* Select icon */}
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 100 }}>
                  <InputLabel>Icon</InputLabel>
                  <Select name="icon" onChange={handleChangeEdit} sx={{ height: 55 }}
                    value={editForm.icon + ''}>
                    {editForm.type === "expense" ? mockExpense.map((item, index) => {
                      return (
                        <MenuItem value={item.icon} key={index}>
                          <Avatar src={item.icon} sx={{ mr: 0 }} />
                        </MenuItem>
                      )
                    }
                    ) : mockIncome.map((item) => {
                      return (
                        <MenuItem value={item.icon} key={item.icon}>
                          <Avatar src={item.icon} sx={{ mr: 0 }} />
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseEdit}>
            Cancel
          </Button>
          <Button variant="outlined" color="success" onClick={() => handleSubmitCateEdit(editForm._id)}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
