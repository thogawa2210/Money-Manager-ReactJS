import { Helmet } from 'react-helmet-async';
import { forwardRef, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  Tab,
  TableContainer,
  Tabs,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Iconify from 'src/components/iconify';
import Swal from 'sweetalert2';
import axios from 'axios';
import { changeFlag } from 'src/features/flagSlice';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import mockExpense from 'src/_mock/categoryExpense';

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
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
export default function ProductsPage() {
  // Tab detail
  // Done
  const [openCategory, setOpenCategory] = useState(false);
  const idUser = JSON.parse(localStorage.getItem('user')).user_id;
  const flag = useSelector((state) => state.flag);
  const dispatch = useDispatch();
  const [openCreateCategory, setOpenCreateCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    name: '',
    type: '',
    icon: '',
    note: '',
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
      note: category.note,
      user_id: idUser,
    };
    console.log(data);
    if (category.name === '' || category.type === '' || category.icon === '') {
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
      console.log(result);
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Create Category Successfully!',
          showConfirmButton: false,
          timer: 1500,
        })
          .then(
            setCategory({
              ...category,
              icon: null,
              name: '',
              type: null,
              note: null,
            }),
            setOpenCreateCategory(false),
            dispatch(changeFlag(1))
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
      }
    }
  };

  useEffect(() => {
    setCategory({
      ...category,
      icon: '',
      name: '',
      type: '',
      note: '',
    });
  }, [flag]);

  const closeCategory = () => {
    setOpenCategory(false);
  };

  const handleChooseCategory = (icon) => {
    setEditForm({ ...editForm, icon: icon });
    setCategory({ ...category, icon: icon });
    setOpenCategory(false);
  };

  const handleClickOpenTabCategory = () => {
    setOpenCategory(true);
  };
  // Table detail category
  const [expanded, setExpanded] = useState(false);

  const handleChangeDetailTable = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [value, setValue] = useState(0);

  const handleChangeDetail = (event, newValue) => {
    setValue(newValue);
  };

  const getWallet = async () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return await axios.get(` http://localhost:3001/category/get-category-byuser/${userId.user_id}`, idUser);
  };
  useEffect(() => {
    getWallet()
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
      cancelButtonColor: '#FF4842',
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
              timer: 1500,
            });
            setExpanded(false);
          })
          .catch(
            (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Something Wrong!',
                text: 'Something wrong! Please try again!',
                showConfirmButton: false,
                timer: 2000,
              })
            }
          );
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
      [e.target.name]: e.target.value,
    });
  };

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
    note: editForm.note,
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
                timer: 1500,
              });
            })
            .catch(
              (err) => console.log(err),
              Swal.fire({
                icon: 'error',
                title: 'Something Wrong!',
                text: 'Something wrong! Please try again!',
                showConfirmButton: false,
                timer: 2000,
              })
            );
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
            <Typography variant="h3" sx={{ ml: '20px' }}>
              Category
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleClickOpenCreateCategory}
              sx={{ mr: '20px' }}
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
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChangeDetail} aria-label="basic tabs example">
                          <Tab label="In Come" {...a11yProps(0)} />
                          <Tab label="Expense" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <TabPanel value={value} index={0}>
                        <Grid container>
                          <Grid item xs />
                          <Grid item xs={12}>
                            {categories.map((item, index) => {
                              if (item.type === 'income')
                                return (
                                  <Accordion
                                    expanded={expanded === `panel${index + 1}`}
                                    onChange={handleChangeDetailTable(`panel${index + 1}`)}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1bh-content"
                                      id="panel1bh-header"
                                    >
                                      <Typography sx={{ width: '100%', flexShrink: 0, display: 'flex' }}>
                                        <Avatar src={item.icon} sx={{ mr: 0 }} />
                                        <ListItemText
                                          primary={item.name}
                                          sx={{
                                            ml: 2,
                                            display: 'block !important',
                                            alignItems: 'center',
                                            marginTop: 1,
                                          }}
                                        />
                                      </Typography>

                                      <Typography
                                        sx={{ ml: 2, display: 'block !important', alignItems: 'center', marginTop: 1 }}
                                      ></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Typography>
                                        <TableContainer component={Paper}>
                                          <Table size="small" aria-label="a dense table" sx={{ width: '100%' }}>
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Name Category</TableCell>
                                                <TableCell align="center">Note</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody key={index}>
                                              <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                              >
                                                <TableCell component="th" scope="row">
                                                  <strong>{item.name}</strong>
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                  <strong>{item.note}</strong>
                                                </TableCell>

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
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                        {/* done Table */}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                            })}
                          </Grid>
                          <Grid item xs />
                        </Grid>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <Grid container>
                          <Grid item xs />
                          <Grid item xs={12} sx={{ padding: 0 }}>
                            {categories.map((item, index) => {
                              if (item.type === 'expense')
                                return (
                                  <Accordion
                                    expanded={expanded === `panel${index + 1}`}
                                    onChange={handleChangeDetailTable(`panel${index + 1}`)}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1bh-content"
                                      id="panel1bh-header"
                                    >
                                      <Typography sx={{ width: '80%', flexShrink: 0, display: 'flex' }}>
                                        <Avatar src={item.icon} sx={{ mr: 0 }} />
                                        <ListItemText
                                          primary={item.name}
                                          sx={{
                                            pr: 22,
                                            ml: 2,
                                            display: 'block !important',
                                            alignItems: 'center',
                                            marginTop: 1,
                                          }}
                                        />
                                      </Typography>

                                      <Typography
                                        sx={{ ml: 2, display: 'block !important', alignItems: 'center', marginTop: 1 }}
                                      ></Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Typography>
                                        <TableContainer component={Paper}>
                                          <Table size="small" aria-label="a dense table">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Name Category</TableCell>
                                                <TableCell align="center">Note</TableCell>
                                                <TableCell align="center">Action</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody key={index}>
                                              <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                              >
                                                <TableCell component="th" scope="row">
                                                  <strong>{item.name}</strong>
                                                </TableCell>
                                                <TableCell component="td" scope="row" align="center">
                                                  {item.note}
                                                </TableCell>
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
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                        {/* done Table */}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                );
                            })}
                          </Grid>
                          <Grid item xs />
                        </Grid>
                      </TabPanel>
                    </Box>
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
                    value={category.type}
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
            <Grid item xs={5}>
              <TextField
                name="note"
                onChange={handleChangeCreate}
                fullWidth={true}
                label="Note"
                variant="outlined"
                value={category.note}
              />
            </Grid>

            {/* Select icon */}
            <Grid item xs={2}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 341 }}>
                  <InputLabel id="demo-simple-select-label">Icon</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="icon"
                    name="icon"
                    onChange={handleChangeCreate}
                    sx={{ height: 55 }}
                    inputProps={{ readOnly: true }}
                    onClick={handleClickOpenTabCategory}
                    value={category.icon + ''}
                  >
                    {mockExpense.map((item) => (
                      <MenuItem value={item.icon}>
                        <Avatar src={item.icon} sx={{ mr: 0 }} />
                      </MenuItem>
                    ))}
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
            <Grid item xs={2}>
              <TextField
                id="outlined-select-currency"
                name="type"
                label="Type"
                onChange={handleChangeEdit}
                value={editForm.type + ''}
                disabled
              />
            </Grid>

            <Grid item xs>
              <TextField
                name="name"
                sx={{ minWidth: 400 }}
                InputProps={{ startAdornment: <InputAdornment position="start">Name</InputAdornment> }}
                onChange={handleChangeEdit}
                fullWidth
                variant="outlined"
                value={editForm.name}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={2}>
              {/* Select icon */}
             
                <FormControl>
                  <InputLabel>Icon</InputLabel>
                  <Select
                    name="icon"
                    label="icon"
                    onChange={handleChangeEdit}
                    sx={{ height: 55 }}
                    inputProps={{ readOnly: true }}
                    onClick={handleClickOpenTabCategory}
                    value={editForm.icon + ''}
                  >
                    {mockExpense.map((item, index) => (
                      <MenuItem value={item.icon} key={index}>
                        <Avatar src={item.icon} sx={{ mr: 0 }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
             
            </Grid>

            <Grid item xs>
              <TextField
                name="note"
                sx={{ minWidth: 280 }}
                InputProps={{ startAdornment: <InputAdornment position="start">Note</InputAdornment> }}
                onChange={handleChangeEdit}
                fullWidth
                variant="outlined"
                value={editForm.note}
              />
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

      {/* Dialog Icon */}
      <Dialog open={openCategory} onClose={closeCategory}>
        <DialogTitle>Choose Icon</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '400px', typography: 'body1', height: '400px' }}>
            <Grid container spacing={1}>
              {mockExpense.map((item) => (
                <Grid item xs={3}>
                  <MenuItem onClick={() => handleChooseCategory(item.icon)}>
                    <Avatar src={item.icon + ''} />
                  </MenuItem>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCategory} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
