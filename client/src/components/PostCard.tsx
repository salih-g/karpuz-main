import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Post, Sub } from '../types';
import { useAuthState } from '../context/auth';
import ActionButton from './ActionButton';
import useSWR from 'swr';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  revalidate?: Function;
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const router = useRouter();

  const isInSubPage = router.pathname === '/k/[sub]';

  const vote = async (value: number) => {
    if (!authenticated) router.push('/login');

    if (value === userVote) value = 0;

    try {
      const res = await axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      });

      if (revalidate) revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={identifier}
      className='flex mb-4 bg-gray-500 rounded border-0.5 border-gray-400 hover:border-white'
      id={identifier}
    >
      {/**Vote section */}
      <div className='w-10 py-3 text-center bg-gray-600 rounded-l'>
        {/**Up vote */}
        <div
          className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-pink-600 '
          onClick={() => vote(1)}
        >
          <i
            className={classNames('icon-arrow-up', {
              'text-pink-600': userVote === 1,
            })}
          ></i>
        </div>
        {/**Vote count*/}
        <p
          className={classNames('text-xs font-bold', {
            'text-pink-600': userVote === 1,
            'text-red-500': userVote === -1,
          })}
        >
          {voteScore}
        </p>
        {/**Down vote */}
        <div
          className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-red-500'
          onClick={() => vote(-1)}
        >
          <i
            className={classNames('icon-arrow-down', {
              'text-red-500': userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/**Post data Section */}
      <div className='p-2 w-ful'>
        <div className='flex items-center'>
          {!isInSubPage && (
            <>
              {sub && (
                <Link href={`/k/${subName}`}>
                  <a className='mr-1'>
                    <Image
                      src={sub.imageUrl}
                      alt='Sub'
                      className='rounded-full'
                      width={20}
                      height={20}
                    />
                  </a>
                </Link>
              )}
              <Link href={`/k/${subName}`}>
                <a className='text-xs font-bold cursor-pointer hover:underline'>
                  /k/{subName}
                </a>
              </Link>
              <span className='mx-1 text-xs text-gray-300'>•</span>
            </>
          )}
          <p className='text-xs text-gray-300'>
            Posted by
            <Link href={`/u/${username}`}>
              <a className='mx-1 hover:underline '>/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className='mx-1 hover:underline'>
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>

        <Link href={url}>
          <a className='my-1 text-lg font-medium'>{title}</a>
        </Link>
        {body && (
          <p className='my-1 text-xm'>
            <Link href={url}>
              <a>{body}</a>
            </Link>
          </p>
        )}

        <div className='flex'>
          <Link href={url}>
            <a>
              <ActionButton>
                <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                <span className='font-bold'>{commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className='mr-1 fas fa-share fa-xs'></i>
            <span className='font-bold'>Share</span>
          </ActionButton>
          <ActionButton>
            <i className='mr-1 fas fa-bookmark fa-xs'></i>
            <span className='font-bold'>Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
