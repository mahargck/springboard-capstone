import { useState } from 'react'

import duckJson from '../json/geese.json';
import Table from '../Table.jsx'

export default function Geese() {
  const [json] = useState(duckJson)
  return (
    <>
      <h2>Geese</h2>
      {/* <p>It has been said that Ducks are the 'gateway' animals to homesteading.</p> */}
      <Table
        json={json} />
    </>
  );
}