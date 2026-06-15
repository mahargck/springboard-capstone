import Container from '../components/Container';

export default function FAQ() {
  return (
    <>
      <Container className="bg-brown-2" padding>
        <h2>Frequently Asked Questions</h2>
      </Container>
      <Container className="bg-brown-4" padding>
        <h3>What is this?</h3>
        <p>
          This is a site designed to give the raw data for individulals to analyze and draw conclusions.
        </p>
      </Container>
      <Container className="bg-brown-5" padding>
        <h3>Where does the data come from?</h3>
        <p>
          The data is pulled from a variety of sources.  After each table, there is a list of sources used to compile the data.
        </p>
      </Container>
      <Container className="bg-brown-4" padding>
        <h3>What makes this site so special?</h3>
        <p>
          With the large amounts of data for each individual topic, users can choose which categories of data to view and analyze.  This allows users to drill down into specific aspects of each topic and gain deeper insights.
        </p>
      </Container>
      <Container className="bg-brown-5" padding>
        <h3>Why should I make a user?</h3>
        <p>When you create a user and login, you will be able to bookmark various items and filter to view your bookmarks. Only necessary information is collected and saved, such as e-mail address, zip code, and hardiness zone. All information is not shared for any reason.
          In addition, you can add notes to the bookmarks for a variety of reasons, such as: 
        </p>
        <ul>
          <li>Quantities</li>
          <li>Ages</li>
          <li>Success/Failures</li>
        </ul>
        <p>
          You can also keep track of animal breeds or other items you want to revisit for future consideration.
        </p>
      </Container>
    </>
  );
}