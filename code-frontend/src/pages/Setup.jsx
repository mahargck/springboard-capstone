import { useState } from 'react'
import Container from '../components/Container';

export default function Setup() {
  return (
    <>
      <Container className="bg-blue-2" padding>
        <h2>Setup</h2>
      </Container>
      <Container className="bg-blue-4" padding>
        <p>This is fairly straight forward.  Click on one of the links above for the item you want to change.</p>
      </Container>
    </>
  );
}
