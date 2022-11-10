import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      icon: 'warning',
      title: 'You are going to logout...',
      text: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#54D62C',
      cancelButtonColor: '#FF4842',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear('user');
        Swal.fire({title: 'You are logged out!',text: 'Thank you for using our service!', icon: 'success', showConfirmButton: false, timer: 1500});
        navigate('/login');
      } else {
        navigate('/');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
};

export default LogoutPage;
