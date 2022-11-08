// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
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
    title: 'transaction',
    path: '/dashboard/transaction',
    icon: icon('transaction'),
  },
  {
    title: 'profile',
    path: '/dashboard/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'my category',
    path: '/dashboard/category',
    icon: icon('ic_cart'),
  },
  {
    title: 'about',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'logout',
    path: '/dashboard/logout',
    icon: icon('logout'),
  },
];

export default navConfig;
