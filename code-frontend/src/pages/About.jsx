import Container from '../components/Container';

export default function About() {
  return (
    <>
      <Container className="bg-brown-c2" padding>
        <h2>About</h2>
      </Container>
      <Container className="bg-brown-c4" padding>
        <p>
          In 2022, my wife started our homesteading journey by going "Mr. G, I want some chickens to give me eggs."  Thinking 'Happy Wife = Happy Life', I agreed.  Unknown to me, my wife entered <b>Research Mode</b> looking at all types of chickens; their breeds, egg production, temperament, etc. She compiled the information into several sheets of paper before switching to notebooks.  Deciding on Buff Orpingtons and Americaunas, we started a flock of four and later, added two Lavendar Orpingtons.
        </p>
        <p>
          With egg production underway, my wife shifted to meat production and asked, "Mr. G, I want some rabits to give us meat." Again, I said yes and, again, my wife started researching.
        </p>
        <p>
          Skip forward several years, we now have 5 acres with goats, pigs, and chickens. We have also tried both ducks and rabbits. (Ducks are coming back next year!) My wife is planning on sheep next year and trying to figure out a way to get a cow or two.
        </p>
        <p>
          <b>Homesteader's Notebook</b> was designed as a simple project to help my wife organize her homesteading notes. As I learned "Happy Wife = Happy Life."
        </p>
        <p>
          We hope the content that has been collected may be useful to others looking to learn more about homesteading. Choosing either animals or plants can be confusing and time-consuming. We hope this will help you save time and frustration, while deciding what will work best for you.
        </p>
        <p>
          If you have any questions, suggestions, or would like to contribute to the project, please feel free to reach out to us. We are always looking for ways to improve the application and make it more useful for our users.
        </p>
      </Container>

      <Container className="bg-green-c2" padding>
        <h3>Contact Us</h3>
      </Container>
      <Container className="bg-green-c4" padding>
        <p>
          <a className='w3-padding-small bg-blue' href="mailto:mahargck@gmail.com">Email</a>
        </p>
      </Container>

      <Container className="bg-blue-c2" padding>
        <h3>Staff</h3>
      </Container>
      <Container className="bg-blue-c4" padding>
        <div className="w3-row">
          <div className="w3-col m6 l4 w3-padding-small">
            <img src={'/images/sk-g.png'} className="w3-left" style={{width:"96px"}}/>
            <h4>Mr. G</h4>
            Head of Design and Implementation
          </div>
          <div className="w3-col m6 l4 w3-padding-small">
            <img src={'/images/sk-j.png'} className="w3-left" style={{width:"96px"}}/>
            <h4>Mrs. J</h4>
            Head of Research
          </div>
          <div className="w3-col m6 l4 w3-padding-small">
            <img src={'/images/sk-s.png'} className="w3-left" style={{width:"96px"}}/>
            <h4>Ms. S</h4>
            Head of Artistic Image Creation
          </div>
        </div>
      </Container>
      <Container className="bg-blue-c4" padding>
          <span className="w3-right">Last Updated: {import.meta.env.VITE_LAST_UPDATED}</span>
      </Container>
    </>
  );
}