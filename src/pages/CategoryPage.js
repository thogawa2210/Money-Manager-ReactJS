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
  Divider,
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
import { LoadingButton } from '@mui/lab';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionEdit = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  // Button loading
  const [loading, setLoading] = useState(false);


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
  // Create
  const handleClickOpenCreateCategory = () => {
    setOpenCreateCategory(true);
  };
  const handleCloseCreate = () => {
    setCategory({
      ...category,
      icon: null,
      name: '',
      type: null,
      note: '',
    });
    setOpenCreateCategory(false);
  };
  const handleChangeCreate = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCreate = async () => {
    let data = {
      icon: category.icon,
      name: category.name,
      type: category.type,
      note: category.note,
      user_id: idUser,
    };

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
      setLoading(true);
      const result = await axios.post('https://money-manager-master-be.herokuapp.com/category/add-category', data);

      if (result.data.type === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Create Category Successfully!',
          showConfirmButton: false,
          timer: 1500,
        })
          .then(
            setLoading(false),
            setCategory({
              ...category,
              icon: null,
              name: '',
              type: null,
              note: '',
            }),
            setOpenCreateCategory(false),
            dispatch(changeFlag(1))
          )
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Something Wrong!',
              text: 'Something wrong! Please try again!',
              showConfirmButton: false,
              timer: 2000,
            });
          });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Your name of category already exist',
          showConfirmButton: false,
          timer: 1500,
        });
        setCategory({
          ...category,
          icon: null,
          name: '',
          type: null,
          note: '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return await axios.get(
      ` https://money-manager-master-be.herokuapp.com/category/get-category-byuser/${userId.user_id}`,
      idUser
    );
  };
  useEffect(() => {
    getWallet()
      .then((res) => setCategories(res.data.categoryOfUser))
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something wrong! Please try again!',
          showConfirmButton: false,
          timer: 2000,
        });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);

  // Delete Category
  const handleDeleteCategory = (id) => {
    setLoading(true);
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
          .delete(`https://money-manager-master-be.herokuapp.com/category/delete-category/${id}`)
          .then((res) => {
            dispatch(changeFlag(1));
            Swal.fire({
              icon: 'success',
              text: 'Deleted!',
              title: 'Category has been deleted.',
              showConfirmButton: false,
              timer: 1500,
            });
            setLoading(false);
            setExpanded(false);
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Something Wrong!',
              text: 'Something wrong! Please try again!',
              showConfirmButton: false,
              timer: 1500,
            });
            setLoading(false);

          });
      }
      setTimeout(() => setLoading(false), 500);
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
        title: 'Are you confirm to edit?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#54D62C',
        cancelButtonColor: '#FF4842',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .put(` https://money-manager-master-be.herokuapp.com/category/update-categody/${editForm._id}`, data)
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
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Something Wrong!',
                text: 'Something wrong! Please try again!',
                showConfirmButton: false,
                timer: 2000,
              });
            });
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
                                      sx={{ backgroundColor: '#EAFFC6' }}
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
                                                <Grid container>
                                                  <Grid item xs={3}>
                                                    <TableCell>Name</TableCell>
                                                  </Grid>
                                                  <Grid item xs={5}>
                                                    <TableCell align="center">Note</TableCell>
                                                  </Grid>
                                                  <Grid item xs={4} sx={{ pl: 5 }}>
                                                    <TableCell align="center">Action</TableCell>
                                                  </Grid>
                                                </Grid>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody key={index}>
                                              <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                              >
                                                <Grid container>
                                                  <Grid item xs={3}>
                                                    <TableCell component="th" scope="row" xs={{padding : 0}}>
                                                      <strong>{item.name}</strong>
                                                    </TableCell>
                                                  </Grid>
                                                  <Grid item xs={5}>
                                                    <TableCell component="th" scope="row" align="left" xs={{padding : 0}}>
                                                      <strong>{item.note}</strong>   
                                                    </TableCell >
                                                  </Grid>
                                                  <Grid item xs={4}>
                                                    <TableCell align="center" xs={{padding : 0}}>
                                                      <Button
                                                        variant="outlined"
                                                        color="success"
                                                        onClick={() => handleClickOpenCategory(item._id)}
                                                      >
                                                        Edit
                                                      </Button>
                                                      
                                                  

                                                
                                                      <LoadingButton
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDeleteCategory(item._id)}
                                                        loading={loading}
                                                      >
                                                        Delete
                                                      </LoadingButton>
                                                    </TableCell>
                                                  </Grid>
                                                </Grid>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                        {/* done Table */}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                )                
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
                                    sx={{ backgroundColor: '#EAFFC6' }}
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
                                              <Grid container>
                                                <Grid item xs={3}>
                                                  <TableCell>Name</TableCell>
                                                </Grid>
                                                <Grid item xs={5}>
                                                  <TableCell align="center">Note</TableCell>
                                                </Grid>
                                                <Grid item xs={4} sx={{ pl: 5 }}>
                                                  <TableCell align="center">Action</TableCell>
                                                </Grid>
                                              </Grid>
                                            </TableRow>
                                          </TableHead>
                                          <TableBody key={index}>
                                            <TableRow
                                              key={index}
                                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                              <Grid container>
                                                <Grid item xs={3}>
                                                  <TableCell component="th" scope="row" xs={{padding : 0}}>
                                                    <strong>{item.name}</strong>
                                                  </TableCell>
                                                </Grid>
                                                <Grid item xs={5} sx={{padding: 0}}>
                                                  <TableCell component="th" scope="row" align="left" xs={{padding : 0}}  style={{ width: 250 , height : 100}}>
                                                  <strong>{item.note}</strong>   
                                                  </TableCell >
                                                </Grid>
                                                <Grid item xs={4}>
                                                  <TableCell align="center" xs={{padding : 0}}>
                                                    <Button
                                                      variant="outlined"
                                                      color="success"
                                                      onClick={() => handleClickOpenCategory(item._id)}
                                                    >
                                                      Edit
                                                    </Button>
                                                    <LoadingButton
                                                        variant="outlined"
                                                        loading={loading}
                                                      color="error"
                                                      onClick={() => handleDeleteCategory(item._id)}
                                                    >
                                                      Delete
                                                    </LoadingButton>
                                                  </TableCell>
                                                </Grid>
                                              </Grid>
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
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={2}>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="type"
                  name="type"
                  onChange={handleChangeCreate}
                  sx={{ height: 55, minWidth: 120 }}
                  value={category.type}
                >
                  <MenuItem value={`expense`}>Expense</MenuItem>
                  <MenuItem value={`income`}>Income</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <TextField
                name="name"
                sx={{ minWidth: 400 }}
                onChange={handleChangeCreate}
                fullWidth={true}
                label="Name Category"
                variant="outlined"
                value={category.name}
              />
            </Grid>{' '}
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Select icon */}
            <Grid item xs={2}>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Icon</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="icon"
                  name="icon"
                  onChange={handleChangeCreate}
                  sx={{ height: 55, minWidth: 120 }}
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
            </Grid>
            <Grid item xs>
              <TextField
                name="note"
                onChange={handleChangeCreate}
                fullWidth={true}
                label="Note"
                variant="outlined"
                placeholder="Optional"
                value={category.note}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseCreate}>
            Cancel
          </Button>
         

          <LoadingButton
          variant="outlined"
          color="success"
          onClick={handleSubmitCreate}
          loading={loading}
        >
          Submit
        </LoadingButton>
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
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
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
            </Grid>{' '}

          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={2}>
              {/* Select icon */}

              <FormControl>
                <InputLabel>Icon</InputLabel>
                <Select
                  name="icon"
                  label="icon"
                  onChange={handleChangeEdit}
                  sx={{ height: 55, minWidth: 120 }}
                  inputProps={{ readOnly: true }}
                  onClick={handleClickOpenTabCategory}
                  value={editForm.icon + ''}
                >
                  {mockExpense.map((item) => (
                    <MenuItem value={item.icon} key={item.icon}>
                      <Avatar src={item.icon} sx={{ mr: 0 }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs>
              <TextField
                name="note"
                InputProps={{ startAdornment: <InputAdornment position="start">Note</InputAdornment> }}
                onChange={handleChangeEdit}
                fullWidth
                variant="outlined"
                placeholder="Optional"
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
