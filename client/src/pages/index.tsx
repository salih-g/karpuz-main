import Head from 'next/head';
import { Fragment } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR from 'swr';

import { Sub } from '../types';

import PostCard from '../components/PostCard';
import Image from 'next/image';
import Link from 'next/link';

dayjs.extend(relativeTime);

export default function Home() {
    const { data: posts } = useSWR('/posts');
    const { data: topSubs } = useSWR('/misc/top-subs');

    return (
        <Fragment>
            <Head>
                <title>karpuz: the front page of the internet</title>
            </Head>

            <div className='container flex pt-4 text-gray-100'>
                {/**Post feed */}
                <div className='w-160'>
                    {posts?.map((post) => (
                        <PostCard post={post} key={post.identifier} />
                    ))}
                </div>
                {/**Sidebar */}
                <div className='ml-6 w-80'>
                    <div className='bg-gray-500 border-0.5 border-gray-400 rounded'>
                        <div className='p-4'>
                            <p className='pb-4 text-base font-semibold text-left text-gray-300'>
                                Top Communities
                            </p>
                            <div>
                                {topSubs?.map((sub: Sub) => (
                                    <div
                                        key={sub.name}
                                        className='flex items-center px-4 py-2 text-xs text-gray-100'
                                    >
                                        <div className='mr-2 overflow-hidden rounded-full cursor-pointer'>
                                            <Link href={`/k/${sub.name}`}>
                                                <Image
                                                    src={sub.imageUrl}
                                                    alt='Sub'
                                                    width={24}
                                                    height={24}
                                                />
                                            </Link>
                                        </div>
                                        <Link href={`/k/${sub.name}`}>
                                            <a className='font-bold cursor-pointer '>
                                                /k/{sub.name}
                                            </a>
                                        </Link>
                                        <p className='ml-auto font-med'>
                                            {sub.postCount} Post
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
