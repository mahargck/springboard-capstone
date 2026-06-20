import { fireEvent, render, screen } from '@testing-library/react';
import Container from '../Container';

describe('Container Component', () => {
  // let originalError;

  // beforeAll(() => {
  //   originalError = console.error;
  //   console.error = jest.fn(); // Suppresses the error output
  // });
  // afterAll(() => {
  //   console.error = originalError; // Restore original console
  // });

  test('renders', () => {
    const { container } = render(<Container>Hello</Container>);
    const elements = container.getElementsByClassName('container');
    expect(elements.length).toEqual(1);
    expect(elements[0]).toHaveClass('container');

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  test('padding', () => {
    const { container } = render(<Container padding={true}>Hello</Container>);
    const elements = container.getElementsByClassName('w3-padding-small');
    expect(elements.length).toEqual(1);
  });
  test('noMargin (0)', () => {
    const { container } = render(<Container>Hello</Container>);
    const elements = container.getElementsByClassName('sized');
    expect(elements.length).toEqual(1);
  });
  test('noMargin (1)', () => {
    const { container } = render(<Container noMargin>Hello</Container>);
    const elements = container.getElementsByClassName('sized');
    expect(elements.length).toEqual(0);
  });
});
