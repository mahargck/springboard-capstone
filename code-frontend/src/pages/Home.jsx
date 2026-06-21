import Container from '../components/Container';
import { NavLink } from "react-router-dom";
import "./Home.css"

export default function Home() {
  return (
    <>
      <Container className="bg-brown-c2" padding>
        <h2>Welcome</h2>
      </Container>
      <Container className="bg-brown-c4" padding>
        <p>A Homesteader researcher's dream virtual notebook that collects the data and makes it available for you to sort and filter - until you find the best choices for your property.</p>
      </Container>
      <Container className="bg-brown-c5" padding>
        <div className='w3-row w3-clear'>
          <div className='w3-col l6 w3-right home-text'>
            <img alt="Chicken" className="w3-right logo" src="/images/sk-chicken.png" />
            <h2>Chickens
              <NavLink to="./animals/chicken" className="material-symbols-outlined bg-blue w3-padding-small w3-margin-left">
                link_2
              </NavLink>
            </h2>
            <p>Find the breed of chicken that works best for you. </p>
            <p> Want to maximize egg production? Filter based on the purpose.  Add the category for eggs to see yearly egg output.  Sort to focus on the high producers.</p>
            <p>Add Environment to see if the breed excels in hot or cold climates.</p>
          </div>
          <div className='w3-col l6'>
            <img alt="Chicken Table" className="home-image trans-left" src="/images/home-1.png" />
          </div>
        </div>
      </Container>
      <Container className="bg-brown-c4 w3-padding-16" padding>
        <div className='w3-row w3-clear'>
          <div className='w3-col l6 w3-left home-text w3-right-align'>
            <img alt="Chicken" className="w3-left logo" src="/images/sk-firewood.png" />
            <h2>Firewood
              <NavLink to="./plants/firewood" className="material-symbols-outlined bg-blue w3-padding-small w3-margin-left">
                link_2
              </NavLink>
            </h2>
            <p>Figure out which wood is going to be best for you.</p>
            <p>Is your wood, pre-split? If not, take a look at how easy it is to split.  How about starting a fire? Or smoke output?</p>
            <p>Find what works best for you!</p>
          </div>
          <div className='w3-col l6'>
            <img alt="Firewood Table" className="home-image trans-right" src="/images/home-2.png" />
          </div>
        </div>
      </Container>
    </>
  );
}