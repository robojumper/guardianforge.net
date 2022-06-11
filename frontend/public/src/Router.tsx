import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Build from './views/Build'
import FindBuilds from './views/FindBuilds'
import FindPlayers from './views/FindPlayers'
import Home from './views/Home'
import OAuthHandler from './views/OAuthHandler'
import PublicGuardian from './views/PublicGuardian'
import PublicProfile from './views/PublicProfile'
import AppMain from './views/app/AppMain'
import AppFindPlayers from './views/app/FindPlayers'
import AppFindBuilds from './views/app/FindBuilds'
import Bookmarks from './views/app/Bookmarks'
import UserProfile from './views/app/UserProfile'
import GuardianProfile from './views/app/GuardianProfile'
import AppBuild from './views/app/Build'
import MyBuilds from './views/app/MyBuilds'
import CreateBuild from './views/app/CreateBuild'
import EditProfile from './views/app/EditProfile'
import AdminTools from './views/app/admin/AdminTools'

function ForgeRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-builds" element={<FindBuilds />} />
        <Route path="/find-players" element={<FindPlayers />} />
        <Route path="/oauth" element={<OAuthHandler />} />
        <Route path="/build/:buildId" element={<Build />} />
        <Route path="/u/:username" element={<PublicProfile />} />
        <Route path="/g/:guardianKey" element={<PublicGuardian />} />
        <Route path="/app" element={<AppMain />} />
        <Route path="/app/find-players" element={<AppFindPlayers />} />
        <Route path="/app/find-builds" element={<AppFindBuilds />} />
        <Route path="/app/bookmarks" element={<Bookmarks />} />
        <Route path="/app/my-builds" element={<MyBuilds />} />
        <Route path="/app/create-build" element={<CreateBuild />} />
        <Route path="/app/u/:username" element={<UserProfile />} />
        <Route path="/app/g/:guardianKey" element={<GuardianProfile />} />
        <Route path="/app/build/:buildId" element={<AppBuild />} />
        <Route path="/app/edit-profile" element={<EditProfile />} />
        <Route path="/app/admin/admin-tools" element={<AdminTools />} />
      </Routes>
    </BrowserRouter>
  )
}

export default ForgeRouter