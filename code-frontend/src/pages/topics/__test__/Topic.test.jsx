import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';

import Topic from '../Topic';

const topic_default = [{
  id: 1,
  division: "Farm",
  section: "Barn",
  name: "Cow",
  order_id: 0,
  logo: "/images/sk-bee.png",
  description: "Adding honey bees to a homestead dramatically improves garden yields and ecological diversity, while providing a sustainable supply of honey and beeswax. | Successful beekeeping requires an upfront financial investment of about $200+ for a hive and $150+ for bees, along with routine management during the warmer months.",
  isvisible: true,
  category: null
}]
const data_default = {
  header: [{key: 'name', name: 'Name'}],
  data: [{id: 1, name: 'Cow'}]
}
const error_default = {
  error: "Problem pulling data:  /division/{division:blah}"
}
describe('Topic Component', () => {
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppresses the error output
  });
  afterAll(() => {
    console.error = originalError; // Restore original console
  });

  const oldFetch = global.fetch;
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    global.fetch = oldFetch

    document.body.removeChild(container);
    container = null;
  });

  test('Render', async () => {
    const mockJest = jest.fn()
      // Topic
      .mockResolvedValueOnce({ json: async () => (topic_default)})
      // Table
      .mockResolvedValueOnce({ json: async () => (data_default)})
    global.fetch = mockJest

    act(() => {
      createRoot(container)
        .render((
          <UserContext.Provider value={{}}>
            <MemoryRouter initialEntries={['/farm/cow']}>
              <Routes>
                {/* Match the dynamic segment exactly how it is named in your app */}
                <Route path=":division">
                  <Route path=":topic" element={<Topic />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.queryAllByText("Cow")).toHaveLength(1)
  })

  test('Render Error', async () => {
    const mockJest = jest.fn()
      // Topic
      .mockResolvedValueOnce({ json: async () => (error_default)})
      // Table
      .mockResolvedValueOnce({ json: async () => (data_default)})
    global.fetch = mockJest

    act(() => {
      createRoot(container)
        .render((
          <UserContext.Provider value={{}}>
            <MemoryRouter initialEntries={['/farm/cow']}>
              <Routes>
                {/* Match the dynamic segment exactly how it is named in your app */}
                <Route path=":division">
                  <Route path=":topic" element={<Topic />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByText("Cow")).toHaveLength(0)
    expect(screen.queryAllByRole("table")).toHaveLength(0)
  })
});
