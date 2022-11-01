import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {useEffect} from "react";
import Swal from "sweetalert2";

function VerifyRegister() {

    const navigate = useNavigate();

    const userId = useParams();
    console.log(userId.id);

    const sendIdApi = async (userId)=> {
        const results = await axios.request({
            url: `http://localhost:3001/auth/verify/${userId.id}`,
            method: "POST",
            data: JSON.stringify(userId.id),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return results
    }

    const handleApi = (data) =>{
        if(data.type === 'success'){
            Swal.fire(
                'Register success',
                'Confirm success',
                'success'
            ).then(navigate('/login'));
        }else {
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Confirm error',
                footer: '<a href="/login">Go to Login</a>'
            })
        }
    }

    useEffect(() => {
        sendIdApi(userId).then(res=>handleApi(res.data)).catch(err=>console.log(err.message))
    },[])

    return (
        <>
        </>
    )
}

export default VerifyRegister;