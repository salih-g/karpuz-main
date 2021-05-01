import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { Comment, Post } from '../../types';
import PostCard from '../../components/PostCard';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function user() {
  const router = useRouter();
  const username = router.query.username;

  const { data, error } = useSWR<any>(username ? `/users/${username}` : null);

  if (error) router.push('/');

  return (
    <>
      <Head>
        <title>{data?.user.username}</title>
      </Head>

      {data && (
        <div className='container flex pt-5 text-gray-100'>
          <div className='w-full px-4 rounded md:w-160 md:p-0 '>
            {data.submissions.map((submission: any) => {
              if (submission.type === 'Post') {
                const post: Post = submission;
                return <PostCard key={post.identifier} post={post} />;
              } else {
                const comment: Comment = submission;
                return (
                  <div
                    key={comment.identifier}
                    className='flex my-4 bg-gray-500  rounded border-0.5 border-gray-400'
                  >
                    <div className='flex-shrink-0 w-10 py-4 text-center rounded-l'>
                      <i className='text-gray-200 fas fa-comment-alt fa-xs'></i>
                    </div>
                    <div className='w-full p-2'>
                      <p className='mb-2 text-xs text-gray-300'>
                        <span className='text-pink-500 '>
                          {comment.username}
                        </span>
                        <span> commented on </span>
                        <Link href={comment.post.url}>
                          <a className='font-semibold cursor-pointer hover:underline'>
                            {comment.post.title}
                          </a>
                        </Link>
                        <span className='mx-1'>•</span>
                        <Link href={`/k/${comment.post.subName}`}>
                          <a className='cursor-pointer hover:underline'>
                            /k/{comment.post.subName}
                          </a>
                        </Link>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          <div className='hidden ml-6 md:block w-80'>
            <div className='bg-gray-500 rounded border-0.5 border-gray-400'>
              <div className='p-3 bg-pink-600 rounded-t'>
                <img
                  src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro&f=y'
                  alt='user profile'
                  className='w-16 h-16 mx-auto border-2 border-white rounded-full'
                />
              </div>
              <div className='p-3 text-center'>
                <h1 className='mb-3 text-xl '>{data.user.username}</h1>
                <p className='mt-3'>
                  <i className='mr-2 fas fa-birthday-cake'></i>
                  Joined {dayjs(data.user.createdAt).format('MMM YYYY')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
