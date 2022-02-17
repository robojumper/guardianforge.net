import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import userUtils from "../../../utils/userUtils"
import { Toggles } from '../../../toggles'
import { Button } from "react-bootstrap"
import styled from 'styled-components'
import colors from '../../../colors'
import FeatureToggle from '../../../models/FeatureToggle'

const Wrapper = styled.div`
  textarea {
    width: 100%;
    height: 200px;
  }

  .toggle {
    background-color: ${colors.theme2.dark1};
    padding: 10px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;

    .toggle-name {
      margin-right: 15px;
      font-size: 18px;
    }
  }
`

function AdminTools() {
  const [userIdToImpersonate, setUserIdToImpersonate] = useState("")
  const [iterator, setIterator] = useState(1)
  const [token, setToken] = useState("")

  useEffect(() => {
    async function init() {
      const { ForgeClient } = window.services
      let t = await ForgeClient.getToken()
      setToken(t)
    }
    init()
  }, [])

  async function impersonateUser() {
    const { ForgeClient, BungieApiService } = window.services

    // const user = await BungieApiService.fetchBungieUser(userIdToImpersonate)
    let userData = await BungieApiService.fetchUserMemberships(userIdToImpersonate)
    ForgeClient.userData = userData
    let { membershipType, membershipId } = userUtils.parseMembershipFromProfile(userData)

    let charRes = await BungieApiService.fetchCharactersList(membershipType, membershipId)

    let guardians = Object.keys(charRes.characters.data).map(key => charRes.characters.data[key])
    // @ts-ignore
    guardians.sort((a, b) => new Date(b.dateLastPlayed) - new Date(a.dateLastPlayed))

    ForgeClient.userGuardians = guardians
  }

  function toggleFeature(toggle: FeatureToggle) {
    toggle.toggle()
    setIterator(iterator + 1)
  }

  return (
    <Wrapper>
      <h2>Impersonate User</h2>
      <div className="row g-3">
        <div className="col-auto">
          <input type="text"
            className="form-control"
            placeholder="membershipId"
            value={userIdToImpersonate}
            onChange={e => setUserIdToImpersonate(e.target.value)} />
        </div>
        <div className="col-auto">
          <button onClick={impersonateUser} className="btn btn-primary mb-3">Impersonate</button>
        </div>
      </div>
      <Row>
        <Col>
          <h2>Token</h2>
          <textarea disabled>{ token }</textarea>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Feature Toggles</h2>
          <div className="toggles">
            {iterator && Object.keys(Toggles).map((k: string) => (
              <div className="toggle">
                <div className="toggle-name">{ Toggles[k].name }</div>
                <Button className="toggle-btn" onClick={() => toggleFeature(Toggles[k])}>
                  { Toggles[k].isEnabled() ? "Enabled" : "Disabled"}
                </Button>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Wrapper>
  )
}

export default AdminTools
