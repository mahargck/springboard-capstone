import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'

// pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import About from './pages/About'
import FAQ from './pages/FAQ'

import UserProfile from './pages/UserProfile'
import UserRegister from './pages/UserRegister'
import UserLogin from './pages/UserLogin'
import UserLogout from './pages/UserLogout'
import UserBookmarks from './pages/UserBookmarks'

import Setup from './pages/Setup'
import SetupColumn from './pages/SetupColumn'
import SetupTopic from './pages/SetupTopic'
import SetupTopicItem from './pages/SetupTopicItem'

import TopicDivision from './pages/TopicDivision'
import Topic from './pages/Topic'

// layouts
import RootLayout from './layouts/RootLayout'
import SetupLayout from './layouts/SetupLayout'
import DivisionLayout from './layouts/DivisionLayout'

const router = createBrowserRouter(
  // To simplify the routing, I may decide to have a catch all that checks to see if the topic is in the DB
  //  and if it is not, then it will send the path not found object.
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />

      <Route path="about" element={<About />} />
      <Route path="faq" element={<FAQ />} />

      <Route path="register" element={<UserRegister />} />
      <Route path="login" element={<UserLogin />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="bookmark" element={<UserBookmarks />} />
      <Route path="logout" element={<UserLogout />} />

      <Route path="setup" element={<SetupLayout />} >
        <Route index element={<Setup />} />
        <Route path="column" element={<SetupColumn />} />
        <Route path="topic" element={<SetupTopic />} />
        <Route path="topic_item" element={<SetupTopicItem />} />
      </Route>

      <Route path=":division" element={<DivisionLayout />}>
        <Route index element={<TopicDivision />} />
        <Route path=":topic" element={<Topic />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

export default router;