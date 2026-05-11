import { useState } from 'react'

import chickenJson from '../json/chicken.json';
import Table from '../Table.jsx'

export default function Chicken() {
  const [json] = useState(chickenJson)
  return (
    <>
      <h2>Chickens</h2>
      <p>It has been said that Chickens are the 'gateway' animals to homesteading.</p>
      <Table
        json={json} />
    </>
  );
}