import { useState } from 'react'

import Table from '../Table.jsx'
import CreateJson from '../CreateJson.jsx'
import chickenJson from '../json/chicken.json';
import firewoodJson from '../json/firewood.json';
import pigJson from '../json/pig.json';
import duckJson from '../json/duck.json';
import geeseJson from '../json/geese.json';
import sheepJson from '../json/sheep.json';

export default function SetupJSON() {
  const [json] = useState(sheepJson)
  return (
    <>
      <CreateJson
        json={json} />
    </>
  );
}

