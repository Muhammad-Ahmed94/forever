import React from 'react'
import Button from '../components/Button';

type SignUpPageProps = {};

const SignUpPage = (props: SignUpPageProps) => {
  return (
    <div className='capitalize font-light shadow-2xl text-2xl relative text-center py-8 flex flex-col items-center'>
      <h2>create an account</h2>
      <div className='w-1/2 border border-gray-300 flex flex-col justify-center items-center'>
        enter details below
        <div className='flex flex-col justify-start items-start mx-4'>
          <h3>title</h3>
          <input type="text" placeholder='title' className='border border-gray-400 rounded px-2 py-2' />
        </div>
        <div>
          <Button name="Create" />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage