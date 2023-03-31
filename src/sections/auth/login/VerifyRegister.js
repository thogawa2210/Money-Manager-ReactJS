import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { enviroment } from 'src/enviroment/enviroment';

function VerifyRegister() {
  const navigate = useNavigate();

  const userId = useParams();

  const sendIdApi = async (userId) => {
    const results = await axios.request({
<<<<<<< HEAD
      url: `http://localhost:3001/auth/verify/${userId.id}`,
=======
      url: `${enviroment.apiUrl}/auth/verify/${userId.id}`,
>>>>>>> 650520c5c1ef5ffc59bbd50646230bf6cf8befdb
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return results;
  };

  const verifyApi = (data) => {
    if (data.type === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Verify Successfuly!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/login');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Verify Error',
      });
      navigate('/signup');
    }
  };

  useEffect(() => {
    sendIdApi(userId)
      .then((res) => verifyApi(res.data))
      .catch((err) =>  Swal.fire({
        icon: 'error',
        title: 'Something Wrong!',
        text:' Something wrong! Please try again!',
        showConfirmButton: false,
        timer: 2000
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return <></>;
}

export default VerifyRegister;
