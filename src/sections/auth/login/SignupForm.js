
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'
import axios from 'axios'
import {
    Box, Button,
    TextField,
} from '@mui/material';

import {useNavigate} from "react-router-dom";
import {useState} from "react";



const SignupForm = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = (value)=> {
        axios.post(`http://localhost:3001/products`, value)
            .then(res => {
                alert("Create successfully!!!",res);
                navigate('/')
            })
            .catch(err => {
                throw err;
            });
        // alert("Create successfully!!!");
    }

    // const handleApi = (data) =>{
    //     if(data.type === 'success'){
    //         Swal.fire(
    //             'Register success',
    //             'Please check mail to confirm user',
    //             'success'
    //         ).then(navigate('/login'));
    //     }else {
    //         Swal.fire({
    //             icon: 'info',
    //             title: 'Oops...',
    //             text: 'Account already exists!',
    //             footer: '<a href="/login">Go to Login</a>'
    //         })
    //     }
    // }

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     if(values.username===''||values.password===''||values.confirmPassword===''||values.email==='') {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Oops...',
    //             text: 'Please fill out all the required fields'
    //         })
    //     }
    //     callApi().then(res=>{handleApi(res.data)})
    //         .catch(err => console.error(err.message))
    // }


      const createSchema = Yup.object({
            email: Yup
                .string()
                .email('Must be a valid email')
                .required('Email is required'),
            username: Yup
                .string()
                .max(255)
                .required('User name is required'),
            password: Yup
                .string()
                .max(255)
                .required('Password is required')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/,
                    " \"Must Contain 6 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character\""
                ),
        })

    console.log(form)


    return (
       <>
           <Formik
               initialValues={form}
               validationSchema={createSchema}
               onSubmit={value => {
                   handleSubmit(value)
                       .then((res)=> {
                           console.log(res)
                           return res
                       })
                       .catch((e) => setExistedEmail("Không được để trống"))
               }}
           >
               <Form>
                   <div>
                       {existedEmail ? (
                           <div
                               style={{ height: 10, fontSize: 15 }}
                               class="rounded-lg py-2 px-2 mb-3 text-base text-red-700 inline-flex items-center  "
                               role="alert"
                           >
                               <svg
                                   aria-hidden="true"
                                   focusable="false"
                                   data-prefix="fas"
                                   data-icon="times-circle"
                                   class="w-4 h-4 mr-2 fill-current"
                                   role="img"
                                   xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 500 500"
                               >
                                   <path
                                       fill="currentColor"
                                       d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                                   ></path>
                               </svg>
                               {existedEmail}
                           </div>
                       ) : null}
                       <div class="flex flex-wrap items-stretch w-full mb-4 relative">
                           <div class="flex -mr-px">
                               <span class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">ID </span>
                           </div>
                           <Field
                               type="text"
                               name="id"
                               class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
                           />
                           <ErrorMessage name="id" />
                           {/* <input type="text" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" name="id" onChange={handleChange} /> */}
                       </div>
                       <div class="flex flex-wrap items-stretch w-full mb-4 relative">
                           <div class="flex -mr-px">
                               <span class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">Name </span>
                           </div>
                           <Field
                               type="text"
                               name="name"
                               class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
                           />
                           <ErrorMessage name="name" />
                           {/* <input type="text" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" name="id" onChange={handleChange} /> */}
                       </div>
                       <div class="flex flex-wrap items-stretch w-full mb-4 relative">
                           <div class="flex -mr-px">
                               <span class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">Price </span>
                           </div>
                           <Field
                               type="number"
                               name="price"
                               class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
                           />
                           <ErrorMessage name="price" />
                           {/* <input type="text" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" name="id" onChange={handleChange} /> */}
                       </div>
                       <div class="flex flex-wrap items-stretch w-full mb-4 relative">
                           <div class="flex -mr-px">
                               <span class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">Stock </span>
                           </div>
                           <Field
                               type="number"
                               name="stock"
                               class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
                           />
                           <ErrorMessage name="stock" />
                           {/* <input type="text" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" name="id" onChange={handleChange} /> */}
                       </div>
                       <div class="flex flex-wrap items-stretch w-full mb-4 relative">
                           <div class="flex -mr-px">
                               <span class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">Description </span>
                           </div>
                           <Field
                               type="text"
                               name="description"
                               class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
                           />
                           <ErrorMessage name="description" />
                           {/* <input type="text" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" name="id" onChange={handleChange} /> */}
                       </div>
                       <button class="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer" type="submit"  >
                           Submit
                       </button>
                       <Link className="bg-yellow-400 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer" to={`/`}>Cancel</Link>
                   </div>
               </Form>
           </Formik>
       </>
    );
};

export default SignupForm;