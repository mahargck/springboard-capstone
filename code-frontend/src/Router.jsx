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
import FAQ from './pages/FAQ'

import UserProfile from './pages/UserProfile'
import UserLogin from './pages/UserLogin'
import UserLogout from './pages/UserLogout'
import UserBookmarks from './pages/UserBookmarks'

import Setup from './pages/Setup'
import SetupJSON from './pages/SetupJSON'
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
    <Route path="/" loader:loader element={<RootLayout />}>
    <Route index loader:loader element={<Home />} />
    
    <Route path="about" loader:loader element={<About />} />
    
    <Route path="faq" loader:loader element={<FAQ />} />
    
    <Route path="login" loader:loader element={<UserLogin />} />
    <Route path="profile" loader:loader element={<UserProfile />} />
    <Route path="bookmark" loader:loader element={<UserBookmarks />} />
    <Route path="logout" loader:loader element={<UserLogout />} />
    
    <Route path="setup" loader:loader element={<SetupLayout />} >
        <Route index loader:loader element={<Setup />} />
        <Route path="column" loader:loader element={<SetupColumn />} />
        <Route path="topic" loader:loader element={<SetupTopic />} />
        <Route path="topic_item" loader:loader element={<SetupTopicItem />} />
        {/* <Route path="json" loader:loader element={<SetupJSON />} /> */}
    </Route>
    
    <Route path=":division" element={<DivisionLayout />}>
        <Route index loader:loader element={<TopicDivision />} />
        
        <Route 
        path=":topic"
        loader:loader element={<Topic />}
        />
    </Route>

    <Route path="*" element={<NotFound />} />
    </Route>
)
)
  
async function loader({ params }) {
    return { message: "Loading information" };
}

export default router;