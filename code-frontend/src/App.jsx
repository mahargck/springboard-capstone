import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

// pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Animal from './pages/Animal'
import Chicken from './pages/Chicken'
import Duck from './pages/Duck'
import Geese from './pages/Geese'
import Sheep from './pages/Sheep'
import Pig from './pages/Pig'
import Firewood from './pages/Firewood'
import SetupJSON from './pages/SetupJSON'
// These were from an instruction video.  I might recreate them in this capstone
// import Faq from './pages/help/Faq'
// import Contact from './pages/help/Contact'

// layouts
import RootLayout from './layouts/RootLayout'
import AnimalLayout from './layouts/AnimalLayout'
import SetupLayout from './layouts/SetupLayout'
// import HelpLayout from './layouts/HelpLayout'

// Styling
import './App.css'

const router = createBrowserRouter(
  // To simplify the routing, I may decide to have a catch all that checks to see if the topic is in the DB
  //  and if it is not, then it will send the path not found object.
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />

      <Route path="firewood" element={<Firewood />} />
      <Route path="animals" element={<AnimalLayout />} >
        <Route index element={<Animal />} />
        <Route path="chicken" element={<Chicken />} />
        <Route path="duck" element={<Duck />} />
        <Route path="geese" element={<Geese />} />
        <Route path="sheep" element={<Sheep />} />
        <Route path="pig" element={<Pig />} />
      </Route>
      <Route path="setup" element={<SetupLayout />} >
        <Route path="json" element={<SetupJSON />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}