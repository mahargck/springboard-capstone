import { useState } from 'react'

import firewoodJson from '../json/firewood.json';
import Table from '../Table.jsx'
import firewoodLogo from '../images/sk-firewood.png'

export default function Firewood() {
  return (
    <>
      <h2>Firewood</h2>
      <p>
        <img src={firewoodLogo} alt="Firewood" className="w3-left logo" />
        For many homesteaders, firewood is an essential resource for heating and cooking. Whether you have a wood stove, fireplace, or outdoor fire pit, having a reliable supply of firewood is crucial for survival in a homestead environment. Firewood can be used for heating, cooking, and even as a source of light. It is important to have a good understanding of the different types of firewood, how to properly store it, and how to safely use it. In this section, we will cover everything you need to know about firewood regarding selecting the right type of wood to building a fire and maintaining it throughout the winter months.
      </p>
      <Table
        json={firewoodJson} />
    </>
  );
}