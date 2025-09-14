"use client"
import Login from '@/components/login';
import Register from '@/components/register';
import React, { useState } from 'react';

const Page = () => {
  const [login,setLogin]=useState(true)
    return (
        <div>
          {
            login?<Login setLogin={setLogin}/>:< Register setLogin={setLogin} />
          }
        </div>
    );
}

export default Page;
