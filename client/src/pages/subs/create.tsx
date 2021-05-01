import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

export default function create() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<any>>({});

  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const res = await axios.post('/subs', { name, title, description });

      router.push(`/k/${res.data.name}`);
    } catch (err) {
      console.log(err);
      setErrors(err.response.data);
    }
  };

  return (
    <div className='flex bg-white'>
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className='h-screen bg-center bg-cover w-36'
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className='flex flex-col justify-center pl-6'>
        <div className='w-98'>
          <h1 className='mb-2 text-lg font-medium'>Create a Community</h1>
          <div className='border-b border-gray-100 '></div>

          <form onSubmit={submitForm}>
            {/* Name*/}
            <div className='my-6'>
              <p className='font-medium'>
                Name <span className='text-pink-500'>*</span>
              </p>
              <p className='mb-2 text-xs text-gray-300'>
                Community names including capitalization cannot be changed.
              </p>
              <input
                type='text'
                className={classNames(
                  'w-full p-3 border border-gray-100 hover:border-gray-500',
                  { 'border-red-600': errors.name }
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.name}</small>
            </div>
            {/*Title */}
            <div className='my-6'>
              <p className='font-medium'>
                Title <span className='text-pink-500'>*</span>
              </p>
              <p className='mb-2 text-xs text-gray-300'>
                Community title represent the topic an you can change it any
                time.
              </p>
              <input
                type='text'
                className={classNames(
                  'w-full p-3 border border-gray-100 hover:border-gray-500',
                  { 'border-red-600': errors.title }
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className='font-medium text-red-600'>{errors.title}</small>
            </div>
            {/*Description */}
            <div className='my-6 '>
              <p className='font-medium'>Description</p>
              <p className='mb-2 text-xs text-gray-300'>
                This is how new members come to understand your community.
              </p>
              <textarea
                className='w-full p-3 border border-gray-100 hover:border-gray-500'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className='flex justify-end'>
              <button className='px-4 py-1 capitalize pink button'>
                Create a Community
              </button>
            </div>
          </form>
        </div>
      </div>
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
