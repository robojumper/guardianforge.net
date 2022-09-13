import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
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
import NotFound from './views/NotFound'
import About from './views/About'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from './contexts/GlobalContext'
import posthog from 'posthog-js'

posthog.init('phc_c0L26n4Q9jYQ0NnwI6j8GC5HR7IKxAAFAxzCBya4ios', { api_host: 'https://app.posthog.com' })

type Props = {
  to: string
}

function Redirect(props: Props) {
  window.location.replace(props.to)
  return null
}

function LocationHandler() {
  const { isInitDone } = useContext(GlobalContext)
  const location = useLocation()
  const [curr, setCurr] = useState("")

  useEffect(() => {
    const page_path = location.pathname + location.search
    if(isInitDone && curr !== page_path) {
      setCurr(page_path)
      posthog.capture('my page_view', { property: page_path })
      window.gtag("event", "page_view", {
        page_path,
      });
    }
  }, [location])
  return (<></>)
}

function ForgeRouter() {
  return (
    <BrowserRouter>
      <LocationHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
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

        {/* Redirects */}
        <Route path="/blog" element={<Redirect to="/blog/index.html" />} />
        <Route path="/docs" element={<Redirect to="/docs/index.html" />} />

        {/* 404s */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default ForgeRouter