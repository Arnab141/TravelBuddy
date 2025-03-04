import React, { useEffect } from 'react';
import Header from '../component/Header/Header.jsx';
import Content from '../component/Content/Content.jsx';
import { useAppContext } from '../component/AllContext/AllContext.jsx';

function Home() {
  const {user} = useAppContext();
  useEffect(()=>{
  console.log(user);
  },[])


  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}

export default Home;
