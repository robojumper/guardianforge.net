import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../contexts/GlobalContext'
import User from '../models/User'
import { Dropdown } from 'react-bootstrap'
import Image from './ui/Image'
import Loading from './Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

type Props = {
  onMenuItemClicked?: Function
  onClickMobile?: Function
}

function UserMenu(props: Props) {
  const { onMenuItemClicked, onClickMobile } = props
  const navigate = useNavigate()

  const { isClientLoaded, isUserDataLoaded, isLoggedIn } = useContext(GlobalContext)
  const [userData, setUserData] = useState<User>({})
  const [displayName, setDisplayName] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if(!isClientLoaded) return
    if(!isLoggedIn) return
    function init() {
      let { ForgeClient } = window.services
      if(ForgeClient.userData) {
        setUserData(ForgeClient.userData)
        if(ForgeClient.userData.bungieNetUser && ForgeClient.userData.bungieNetUser.membershipId === "14214042") {
          setIsAdmin(true)
        }
      }
    }
    init()
  }, [isClientLoaded, isLoggedIn, isUserDataLoaded])

  useEffect(() => {
    if(userData?.bungieNetUser?.displayName) {
      setDisplayName(userData.bungieNetUser.displayName)
    }

    if(userData?.bungieNetUser?.profilePicturePath) {
      setIconUrl(`https://www.bungie.net${userData.bungieNetUser.profilePicturePath}`)
    }
  }, [userData])

  function navigateTo(to: string) {
    navigate(to)
    if(onMenuItemClicked) onMenuItemClicked()
  }

  function logout() {
    const { ForgeClient } = window.services
    ForgeClient.logout()
  }

  function onClickMobileMenu() {
    if(onClickMobile) onClickMobile()
  }

  return (
    <>
      <div className="hidden md:flex">
        <Dropdown align="end">
          <Dropdown.Toggle className="user-badge flex gap-1 items-center rounded-none border-none bg-inherit hover:bg-neutral-800">
            {!iconUrl && !displayName && <Loading small />}
            {iconUrl && <Image className='h-[20px] w-[20px] border-neutral-600' src={iconUrl} />}
            {displayName && <span className="display-name">{ displayName }</span>}
          </Dropdown.Toggle>
          <Dropdown.Menu className='bg-neutral-800 rounded-none border-neutral-600'>
            {userData && userData.bungieNetUser && (
              <Dropdown.Item className='hover:bg-neutral-600'>
                <button className="text-white hover:text-white"
                  onClick={() => navigateTo(`/u/${userData?.bungieNetUser?.uniqueName}`)}>
                    My Profile
                </button>
              </Dropdown.Item>
            )}
            <Dropdown.Item className='hover:bg-neutral-600'>
              <Link className="text-white hover:text-white" to="/edit-profile">Edit Profile</Link>
            </Dropdown.Item>
            <Dropdown.Item className='hover:bg-neutral-600'>
              <button className="text-white hover:text-white"
                onClick={() => navigateTo(`/u/${userData?.bungieNetUser?.uniqueName}?tab=2`)}>
                  My Builds
              </button>
            </Dropdown.Item>
            <Dropdown.Item className='hover:bg-neutral-600'>
              <button className="text-white hover:text-white"
                onClick={() => navigateTo(`/u/${userData?.bungieNetUser?.uniqueName}?tab=4`)}>
                  My Bookmarks
              </button>
            </Dropdown.Item>
            <Dropdown.Item className='hover:bg-neutral-600'>
              <a className="text-white hover:text-white" href="#" onClick={logout}>Log Out</a>
            </Dropdown.Item>
            {isAdmin && (
              <Dropdown.Item className='hover:bg-neutral-600'>
                <Link className="text-white hover:text-white" to="/admin-tools">Admin</Link>
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="flex flex-1 items-center justify-end md:hidden">
        <div onClick={onClickMobileMenu} className="user-badge flex gap-1 items-center rounded-none border-none bg-inherit hover:bg-neutral-800 hover:cursor-pointer px-3 py-2">
          {!iconUrl && !displayName && <Loading small />}
          {iconUrl && <Image className='h-[20px] w-[20px] border-neutral-600' src={iconUrl} />}
          {displayName && <span className="display-name">{ displayName }</span>}
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </>
  )

}

export default UserMenu
