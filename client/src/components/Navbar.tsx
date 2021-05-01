import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';

import { useAuthDispatch, useAuthState } from '../context/auth';
import KarpuzLogo from '../images/karpuz.svg';
import { Sub } from '../types';

const Navbar: React.FC = () => {
  const [name, setName] = useState('');
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);

  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const router = useRouter();

  const logout = () => {
    axios
      .get('/auth/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (name.trim() === '') {
      setSubs([]);
      return;
    }
    searchSubs();
  }, [name]);

  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await axios.get(`/subs/search/${name}`);

          setSubs(data);
        } catch (err) {
          console.log(err);
        }
      }, 250)
    );
  };

  const goToSub = (subName: string) => {
    router.push(`/k/${subName}`);
    setName('');
  };

  return (
    <div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-11 px-5 bg-gray-800 border-b-0.5 border-gray-400 text-gray-100'>
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
      <div className='relative flex items-center mx-auto bg-gray-500 border border-gray-400 rounded hover:border-white sm:w-32 md:w-96 xl:w-160'>
        <i className='pl-4 pr-3 text-gray-200 fas fa-search'></i>
        <input
          type='text'
          className='py-1 pr-3 text-gray-200 bg-transparent rounded bg-g focus:outline-none '
          placeholder='Search'
          style={{
            caretColor: 'white',
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div
          className='absolute left-0 right-0 bg-gray-500'
          style={{ top: '100%' }}
        >
          {subs?.map((sub) => (
            <div
              className='flex items-center px-4 py-3 cursor-pointer hover:bg-gray-400'
              key={sub.name}
              onClick={() => goToSub(sub.name)}
            >
              <Image
                src={sub.imageUrl}
                alt='Sub'
                height={32}
                width={32}
                className='rounded-full'
              />
              <div className='ml-4 text-sm'>
                <p className='font-medium text-gray-300'>{sub.name}</p>
                <p className='font-medium'>{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
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
