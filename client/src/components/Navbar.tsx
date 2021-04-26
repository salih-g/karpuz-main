import axios from 'axios';
import Link from 'next/link';
import { Fragment } from 'react';

import { useAuthDispatch, useAuthState } from '../context/auth';

import KarpuzLogo from '../images/karpuz.svg';

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = () => {
    axios
      .get('/auth/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-11 px-5 bg-gray-800 border-b-0.5 border-gray-400'>
      {/**Logo and title */}
      <div className='flex items-center'>
        <Link href='/'>
          <a>
            <KarpuzLogo className='w-8 h-8 mr-2' />
          </a>
        </Link>
        <span className='text-2xl font-semibold text-gray-100'>
          <Link href='/'>karpuz</Link>
        </span>
      </div>

      {/**Search Input */}
      <div className='flex items-center mx-auto bg-gray-500 border border-gray-400 rounded hover:border-white'>
        <i className='pl-4 pr-3 text-gray-200 fas fa-search'></i>
        <input
          type='text'
          className='py-1 pr-3 text-gray-200 bg-transparent rounded bg-g focus:outline-none sm:w-32 md:w-48 lg:w-96 xl:w-160'
          placeholder='Search'
          style={{
            caretColor: 'white',
          }}
        />
      </div>

      {/**Auth buttons */}
      {!loading &&
        (authenticated ? (
          //Show logout button
          <button
            className='w-32 py-1 mr-4 leading-5 hollow pink button'
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Fragment>
            <div className='flex'>
              <Link href='/login'>
                <a className='w-32 py-1 mr-4 leading-5 hollow pink button'>
                  Log In
                </a>
              </Link>
              <Link href='/register'>
                <a className='w-32 py-1 leading-5 pink button'>Sign Up</a>
              </Link>
            </div>
          </Fragment>
        ))}
    </div>
  );
};

export default Navbar;
