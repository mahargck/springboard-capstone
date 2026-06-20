import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import userEvent from '@testing-library/user-event';
import TopicHeader from '../TopicHeader';

describe('TopicHeader Component', () => {
  // let originalError;

  // beforeAll(() => {
  //   originalError = console.error;
  //   console.error = jest.fn(); // Suppresses the error output
  // });
  // afterAll(() => {
  //   console.error = originalError; // Restore original console
  // });

  const topic_item = {
    name: "TestItem"
  }
  const topic_item_image = {
    name: "TestItem",
    logo: "a"
  }
  const topic_item_desc = {
    name: "TestItem",
    description: "Short Description | Long Description"
  }

  test('renders', () => {
    const { container } = render(<TopicHeader />);
    expect(container).toBeInTheDocument();
  });
  test('Topic', () => {
    const {container} = render(<TopicHeader topic={topic_item} />);
    expect(container).toBeInTheDocument();
  });
  test('Link', () => {
    render(
      <MemoryRouter initialEntries={['/test-route']}>
        <TopicHeader topic={topic_item} link />
      </MemoryRouter>
    );
    const link = screen.getByRole("link")
    expect(screen.getByText(topic_item.name)).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/testitem');
    expect(link.innerHTML).toEqual("TestItem");
  });

  test('Short Description', () => {
    const {container} = render(
      <MemoryRouter initialEntries={['/test-route']}>
        <TopicHeader topic={topic_item_desc} link />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();

    const p = screen.getByRole('paragraph')
    expect(p).toBeInTheDocument();
    expect(p.innerHTML).toEqual("Short Description ");
  });

  test('Long Description', () => {
    const {container} = render(
      <MemoryRouter initialEntries={['/test-route']}>
        <TopicHeader topic={topic_item_desc} />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();

    const p = screen.getByRole('paragraph')
    expect(p.innerHTML).toEqual(topic_item_desc.description.replaceAll("|", ""));
    expect(p.innerHTML).toEqual("Short Description  Long Description");
  });
});
