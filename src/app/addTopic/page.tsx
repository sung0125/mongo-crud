'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AddTopicPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Title and description are required');
    }

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        throw new Error('Failed to create a topic');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { data: session } = useSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <input
        type='text'
        className='border border-slate-500 p-4'
        placeholder='Topic Title'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <textarea
        className='border border-slate-500 p-4 h-32'
        placeholder='Topic Description'
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />
      <button
        className='bg-green-800 text-white font-bold px-6 py-3 w-fit rounded-md'
        type='submit'
      >
        Add Topic
      </button>
    </form>
  );
}
