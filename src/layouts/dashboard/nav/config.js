// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'transaction',
    path: '/dashboard/transaction',
    icon: icon('transaction'),
  },
  {
    title: 'report',
    path: '/dashboard/report',
    icon: icon('ic_analytics'),
  },
  {
    title: 'my wallet',
    path: '/dashboard/wallet',
    icon: icon('wallet-svgrepo-com'),
  },
  {
    title: 'my category',
    path: '/dashboard/category',
    icon: icon('ic_cart'),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'logout',
    path: '/dashboard/logout',
    icon: icon('logout'),
  },
];

export default navConfig;
