import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post, Comment } from '../../../../types';
import Sidebar from '../../../../components/Sidebar';
import { useAuthState } from '../../../../context/auth';
import ActionButton from '../../../../components/ActionButton';
import { FormEvent, useState } from 'react';

dayjs.extend(relativeTime);

export default function PostPage() {
  //Local state
  const [newComment, setNewComment] = useState('');

  //Global state
  const { authenticated, user } = useAuthState();

  //Utils
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  if (error) router.push('/');

  const vote = async (value: number, comment?: Comment) => {
    //If not logged in go to login
    if (!authenticated) router.push('/login');

    //If vote is the same reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;

    try {
      await axios.post('/misc/vote', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();
    if (newComment.trim() === '') return;

    try {
      await axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: newComment,
      });

      setNewComment('');

      revalidate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <>
        <Head>
          <title>{post?.title}</title>
        </Head>

        <Link href={`/k/${sub}`}>
          <a>
            <div className='flex items-center w-full h-20 p-8 bg-pink-500'>
              <div className='container flex'>
                {post && (
                  <div className='w-8 h-8 mr-2 overflow-hidden rounded-full'>
                    <Image src={post.sub.imageUrl} height={32} width={32} />
                  </div>
                )}
                <p className='text-xl font-semibold text-white '>/k/{sub}</p>
              </div>
            </div>
          </a>
        </Link>
        <div className='container flex pt-5 text-gray-100'>
          {/* Post*/}
          <div className='w-160'>
            <div className='bg-gray-500 rounded border-0.5 border-gray-400'>
              {post && (
                <>
                  <div className='flex'>
                    {/* VoteSection*/}
                    <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
                      {/**Up vote */}
                      <div
                        className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-pink-600'
                        onClick={() => vote(1)}
                      >
                        <i
                          className={classNames('icon-arrow-up', {
                            'text-pink-600': post.userVote === 1,
                          })}
                        ></i>
                      </div>
                      {/**Vote count*/}
                      <p
                        className={classNames('text-xs font-bold', {
                          'text-pink-600': post.userVote === 1,
                          'text-red-500': post.userVote === -1,
                        })}
                      >
                        {post.voteScore}
                      </p>
                      {/**Down vote */}
                      <div
                        className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-red-500'
                        onClick={() => vote(-1)}
                      >
                        <i
                          className={classNames('icon-arrow-down', {
                            'text-red-500': post.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    {/* Post section*/}
                    <div className='py-2 pr-2'>
                      <div className='flex items-center'>
                        <p className='text-xs text-gray-300'>
                          Posted by
                          <Link href={`/u/${post.username}`}>
                            <a className='mx-1 text-gray-100 hover:underline'>
                              /u/{post.username}
                            </a>
                          </Link>
                          <Link href={post.url}>
                            <a className='mx-1 cursor-default'>
                              {dayjs(post.createdAt).fromNow()}
                            </a>
                          </Link>
                        </p>
                      </div>
                      {/* Post title*/}
                      <h1 className='my-1 text-xl font-medium'>{post.title}</h1>
                      {/* Post body*/}
                      <p className='my-3 text-sm'>{post.body}</p>
                      {/* Actions*/}
                      <div className='flex'>
                        <Link href={post.url}>
                          <a>
                            <ActionButton>
                              <i className='mr-1 fas fa-comment-alt fa-xs'></i>
                              <span className='font-bold'>
                                {post.commentCount} Comments
                              </span>
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
                  {/*Comment input area */}
                  <div className='pl-10 pr-6 mb-4'>
                    {authenticated ? (
                      <div>
                        <p className='mb-2 text-xs'>
                          Comment as{' '}
                          <Link href={`/u/${user.username}`}>
                            <a className='font-semibold text-pink-500'>
                              {user.username}
                            </a>
                          </Link>
                        </p>
                        <form onSubmit={submitComment}>
                          <textarea
                            className='w-full p-3 border-0.5 border-gray-400 focus:outline-none focus:border-gray-300 rounded bg-gray-500 mb-2'
                            placeholder='What are your thoughts ?'
                            onChange={(e) => setNewComment(e.target.value)}
                            value={newComment}
                          ></textarea>

                          <div className='flex justify-end'>
                            <button className='px-3 py-1 pink button'>
                              Comment
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className='flex items-center px-2 py-4 border-0.5 border-gray-400 justify-between rounded'>
                        <p className='font-bold text-gray-100'>
                          Log in or Sign up to leave a commnet
                        </p>
                        <div>
                          <Link href='/login'>
                            <a className='px-4 py-1 mr-4 hollow pink button'>
                              Login
                            </a>
                          </Link>
                          <Link href='/register'>
                            <a className='px-4 py-1 pink button'>Register</a>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='border-b border-gray-400 '></div>
                  {/*Comment Section */}
                  {comments?.map((comment) => (
                    <div className='flex' key={comment.identifier}>
                      <div className='flex-shrink-0 w-10 py-2 text-center rounded-l'>
                        {/**Up vote */}
                        <div
                          className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-pink-600'
                          onClick={() => vote(1, comment)}
                        >
                          <i
                            className={classNames('icon-arrow-up', {
                              'text-pink-600': comment.userVote === 1,
                            })}
                          ></i>
                        </div>
                        {/**Vote count*/}
                        <p
                          className={classNames('text-xs font-bold', {
                            'text-pink-600': comment.userVote === 1,
                            'text-red-500': comment.userVote === -1,
                          })}
                        >
                          {comment.voteScore}
                        </p>
                        {/**Down vote */}
                        <div
                          className='w-6 mx-auto text-gray-200 rounded cursor-pointer hover:bg-gray-400 hover:text-red-500'
                          onClick={() => vote(-1, comment)}
                        >
                          <i
                            className={classNames('icon-arrow-down', {
                              'text-red-500': comment.userVote === -1,
                            })}
                          ></i>
                        </div>
                      </div>
                      <div className='py-2 pr-2'>
                        <p className='mb-1 text-xs leading-none'>
                          <Link href={`/u/${comment.username}`}>
                            <a className='mr-1 font-bold hover:underline'>
                              /u/
                              {comment.username}
                            </a>
                          </Link>
                          <span className='text-gray-300'>
                            {`
                                                            ${comment.voteScore}
                                                            points • 
                                                            ${dayjs(
                                                              comment.createdAt
                                                            ).fromNow()}
                                                        `}
                          </span>
                        </p>
                        <p>{comment.body}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          {/* Sidebar*/}
          {post && <Sidebar sub={post.sub} />}
        </div>
      </>
    </div>
  );
}
