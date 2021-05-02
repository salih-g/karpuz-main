import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR, { useSWRInfinite } from 'swr';
import Image from 'next/image';
import Link from 'next/link';

import { Post, Sub } from '../types';
import PostCard from '../components/PostCard';
import { useAuthState } from '../context/auth';

dayjs.extend(relativeTime);

export default function Home() {
  const [observedPost, setObservedPost] = useState('');

  //const { data: posts } = useSWR<Post[]>('/posts');
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs');

  const { authenticated } = useAuthState();

  const {
    data,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
    error,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);

  const isInitialLoading = !data && !error;
  const posts: Post[] = data ? [].concat(...data) : [];

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 }
    );
    observer.observe(element);
  };

  return (
    <Fragment>
      <Head>
        <title>karpuz: the front page of the internet</title>
      </Head>

      <div className='container flex pt-4 text-gray-100'>
        {/**Post feed */}
        <div className='w-full px-4 md:w-160 md:p-0'>
          {isInitialLoading && <p className='text-lg text-center'>Loading..</p>}
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.identifier}
              revalidate={revalidate}
            />
          ))}
          {isValidating && posts.length > 0 && (
            <p className='text-lg text-center'>Loading More..</p>
          )}
        </div>
        {/**Sidebar */}
        <div className='hidden ml-6 md:block w-80'>
          <div className='bg-gray-500 border-0.5 border-gray-400 rounded'>
            <div className='p-4'>
              <p className='pb-4 text-base font-semibold text-left text-gray-300'>
                Top Communities
              </p>
              <div>
                {topSubs?.map((sub) => (
                  <div
                    key={sub.name}
                    className='flex items-center px-4 py-2 text-xs text-gray-100'
                  >
                    <Link href={`/k/${sub.name}`}>
                      <a>
                        <Image
                          src={sub.imageUrl}
                          className='rounded-full cursor-pointer'
                          alt='Sub'
                          width={24}
                          height={24}
                        />
                      </a>
                    </Link>
                    <Link href={`/k/${sub.name}`}>
                      <a className='ml-2 font-bold cursor-pointer '>
                        /k/{sub.name}
                      </a>
                    </Link>
                    <p className='ml-auto font-med'>{sub.postCount} Post</p>
                  </div>
                ))}
              </div>
              <div className='border-b border-gray-400 '></div>
              {authenticated && (
                <div className='p-4 '>
                  <Link href='/subs/create'>
                    <a className='w-full px-2 py-1 pink button'>
                      Create Community
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
