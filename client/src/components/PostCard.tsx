import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import classNames from 'classnames';
import router from 'next/router';

import { Post } from '../types';
import { useAuthState } from '../context/auth';
import ActionButton from './ActionButton';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
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
  },
}: PostCardProps) {
  const { authenticated } = useAuthState();

  const vote = async (value: number) => {
    //If not logged in go to login
    if (!authenticated) router.push('/login');

    //If vote is the same reset vote
    if (value === userVote) value = 0;

    try {
      const res = await axios.post('/misc/vote', {
        identifier,
        slug,
        value,
      });

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      key={identifier}
      className='flex mb-4 bg-gray-500 rounded border-0.5 border-gray-400'
    >
      {/**Vote section */}
      <div className='w-10 py-3 text-center bg-gray-600 rounded-l'>
        {/**Up vote */}
        <div
          className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-pink-600'
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
          <Link href={`/k/${subName}`}>
            <img
              src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y'
              className='w-5 h-5 mr-1 rounded-full cursor-pointer'
            />
          </Link>
          <Link href={`/k/${subName}`}>
            <a className='text-xs font-bold cursor-pointer hover:underline'>
              /k/{subName}
            </a>
          </Link>
          <p className='text-xs text-gray-300'>
            <span className='mx-1'>•</span>Posted by
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
        {body && <p className='my-1 text-xm'>{body}</p>}

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
