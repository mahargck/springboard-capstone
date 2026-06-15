import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import Container from '../components/Container';

export default function Home() {
  return (
    <>
      <Container className="bg-brown-2" padding>
        <h2>Welcome</h2>
      </Container>
      <Container className="bg-brown-4" padding>
        <p>This is the home page.</p>
      </Container>
    </>
  );
}