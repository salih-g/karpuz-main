import dayjs from 'dayjs';

import { Sub } from '../types';
import { useAuthState } from '../context/auth';
import Link from 'next/link';

export default function Sidebar({ sub }: { sub: Sub }) {
  const { authenticated } = useAuthState();

  return (
    <div className='hidden ml-6 md:block w-80'>
      <div className='bg-gray-500 rounded border-0.5 border-gray-400'>
        <div className='p-3 bg-pink-500 rounded-t'>
          <p className='font-semibold text-white'>About Community</p>
        </div>
        <div className='p-3'>
          <p className='mb-3 text-md'>{sub.description}</p>
          <div className='flex mb-3 text-sm font-medium'>
            <div className='w-1/2'>
              <p>-</p>
              <p>members</p>
            </div>
            <div className='w-1/2'>
              <p>-</p>
              <p>online</p>
            </div>
          </div>
          <p className='my-3'>
            <i className='mr-2 fas fa-birthday-cake'></i>
            Created {dayjs(sub.createdAt).format('D MMM YYYY')}
          </p>
          <p className='my-3'>
            Created by
            <Link href={`/u/${sub.username}`}>
              <a className='mx-1 text-pink-500 hover:underline'>
                {sub.username}
              </a>
            </Link>
          </p>
          {authenticated && (
            <Link href={`/k/${sub.name}/submit`}>
              <a className='w-full py-1 text-sm pink button'>Create Post</a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
