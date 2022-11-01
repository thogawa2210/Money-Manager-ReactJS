import {useParams} from "react-router-dom";
import axios from "axios";
import {useEffect} from "react";

function VerifyRegister() {

    const id = useParams();

    const sendIdApi=async (id)=> {
        const results = await axios.request({
            url: "http://localhost:3001/verify",
            method: "POST",
            data: JSON.stringify(id.id),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return results
    }

    useEffect(() => {
        sendIdApi(id).then(res=>console.log(res.data)).catch(err=>console.log(err.message))
    },[])

    return (
        <div>

        </div>
    )
}

export default VerifyRegister;