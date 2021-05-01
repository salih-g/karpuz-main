import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';

import Sidebar from '../../../components/Sidebar';
import { Post, Sub } from '../../../types';

export default function submit() {
  const [title, setTitle] = useState('');

  const [body, setBody] = useState('');

  const router = useRouter();

  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  if (error) router.push('/');

  const submitPost = async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') return;

    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: sub.name,
      });

      router.push(`/k/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='container flex pt-5 text-gray-100 '>
      <Head>
        <title>Submit to Karpuz</title>
      </Head>
      <div className='w-160 '>
        <div className='p-4 bg-gray-500 rounded border-0.5 border-gray-400'>
          <h1 className='mb-3'>Submit a post to /k/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className='relative mb-2'>
              <input
                className='w-full px-3 py-2 rounded border-0.5 border-gray-400 focus:outline-none bg-gray-500 focus:border-gray-300'
                placeholder='Title'
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className='absolute mb-2 text-sm text-gray-100 select-none '
                style={{ top: 11, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className='w-full p-3 border-0.5 border-gray-400 focus:outline-none focus:border-gray-300 rounded bg-gray-500 mb-2'
              placeholder='Text (optional)'
              rows={4}
              onChange={(e) => setBody(e.target.value)}
              value={body}
            ></textarea>
            <div className='flex justify-end'>
              <button
                className='px-3 py-1 pink button'
                type='submit'
                disabled={title.trim().length === 0}
              >
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <Sidebar sub={sub} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie) throw new Error('Missing auth token cookie');

    await axios.get('auth/me', { headers: { cookie } });

    return { props: {} };
  } catch (err) {
    res.writeHead(307, { Location: '/login' }).end();
  }
};
