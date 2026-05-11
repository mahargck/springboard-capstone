import { useState } from 'react'

import duckJson from '../json/duck.json';
import Table from '../Table.jsx'

export default function Duck() {
  const [json] = useState(duckJson)
  return (
    <>
      <h2>Ducks</h2>
      {/* <p>It has been said that Ducks are the 'gateway' animals to homesteading.</p> */}
      <Table
        json={json} />
    </>
  );
}