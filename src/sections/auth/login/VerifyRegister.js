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
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return results
    }

    const verifyApi = (data) =>{
        if(data.type === 'success'){
            Swal.fire({
                    icon: 'success',
                    title: 'Confirm success',
                    showConfirmButton: false,
                    timer: 1500,
                }

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
        sendIdApi(userId).then(res=>verifyApi(res.data)).catch(err=>console.log(err.message))
    },[])

    return (
        <>
        </>
    )
}

export default VerifyRegister;