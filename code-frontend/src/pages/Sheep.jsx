import { useState } from 'react'

import sheepJson from '../json/sheep.json';
import Table from '../Table.jsx'

export default function Sheep() {
  const [json] = useState(sheepJson)
  return (
    <>
      <h2>Sheep</h2>
      {/* <p>It has been said that Ducks are the 'gateway' animals to homesteading.</p> */}
      <Table
        json={json} />
    </>
  );
}