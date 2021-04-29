import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useSWR from 'swr';

import { Post } from '../types';

import PostCard from '../components/PostCard';

dayjs.extend(relativeTime);

export default function Home() {
    const { data: posts } = useSWR('/posts');

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
            </div>
        </Fragment>
    );
}
