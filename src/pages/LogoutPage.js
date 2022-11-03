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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, I am sure!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear('user');
        Swal.fire('You are logged out!', 'Thank you for using our service!', 'success');
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
