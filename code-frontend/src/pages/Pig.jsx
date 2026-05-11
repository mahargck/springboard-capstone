import { useState } from 'react'

import pigJson from '../json/pig.json';
import Table from '../Table.jsx'

export default function Pig() {
  const [json] = useState(pigJson)
  return (
    <>
      <h2>Pig</h2>
      <p></p>
      <Table
        json={json} />
    </>
  );
}