import Container from '../components/Container';

export default function Home() {
  return (
    <>
      <Container className="bg-brown-c2" padding>
        <h2>Welcome</h2>
      </Container>
      <Container className="bg-brown-c4" padding>
        <p>This is the home page.</p>
      </Container>
    </>
  );
}