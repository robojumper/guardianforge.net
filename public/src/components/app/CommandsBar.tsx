import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useContext } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import colors from '../../colors';
import Build from '../../models/Build';
import UpvoteButton from './UpvoteButton'
import copy from "copy-to-clipboard";
import { faBan, faBox, faCube, faEdit, faSave, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import ForgeButton from './forms/Button';
import ForgeModal from './Modal';
import Input from './forms/Input';
import TextArea from './forms/TextArea';
import ActivitySelector from './ActivitySelector';
import ModalSelector from './forms/ModalSelector';
import YouTubeEmbed from './YouTubeEmbed';
import ActivityOption from '../../models/ActivityOption';
import ModalSelectorOption from '../../models/ModalSelectorOption';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
// @ts-ignore
import activityOptions from "../../utils/activityOptions"
// @ts-ignore
import { GlobalContext } from "../../contexts/GlobalContext.jsx"
import { navigate } from 'gatsby';
import BuildSummary from '../../models/BuildSummary';

const Wrapper = styled.div`
  display: flex;
  background-color: ${colors.theme2.dark2};
  border-radius: 5px;
  padding: 5px;
  color: ${colors.theme2.text};
  margin: 5px 0px 10px 0px;

  button, a {
    color: #eee;
    background-color: rgba(0,0,0,0);
    border: none;

    &:hover {
      background-color: ${colors.theme2.dark3};
    }

    &:focus {
      background-color: ${colors.theme2.dark3};
      border: none !important;
      box-shadow: none !important;
    }

    &:active {
      background-color: ${colors.theme2.dark3};
      border: none !important;
      box-shadow: none !important;
    }
  }
`

const Seperator = styled.div`
  border-left: 2px solid ${colors.theme2.dark1}
`

type Props = {
  buildId: string
  buildData: Build
  isOwner?: boolean
  onBuildUpdated?: Function
  onBuildArchived?: Function
}

function CommandsBar(props: Props) {
  const { buildId, buildData, isOwner, onBuildUpdated, onBuildArchived } = props
  const { dispatchAlert } = useContext(GlobalContext)
  const [isBuildArchived, setIsBuildArchived] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [twitterLink, setTwitterLink] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isArchiveBuildModalOpen, setIsArchiveBuildModalOpen] = useState(false)

  useEffect(() => {
    setShareLink(`${location.origin}/build/${buildId}`)

    // TODO: Update this with the same thing I use for Notion
    let tweetText = "Checkout this build I found on @guardianforge!"
    setTwitterLink(`https://twitter.com/intent/tweet?text=${tweetText}&url=${shareLink}&hashtags=destiny2`)
  }, [])

  function copyToClipboard() {
    copy(shareLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  function editBuild() {
    let notes = ""
    if(buildData.notes) {
      notes = buildData.notes.replace(/<br\/>/g, "\n")
    }
    if(buildData.name) {
      setName(buildData.name)
    }
    setNotes(notes)
    if(buildData.videoLink) setVideoLink(buildData.videoLink)
    if(buildData.primaryActivity) {
      let a = activityOptions.find((opt: ActivityOption) => opt.value === buildData.primaryActivity)
      if(a) {
        setActivity(a)
      }
    }

    if(buildData.inputStyle) {
      let is = inputStyleOptions.find((opt: ModalSelectorOption) => opt.value === buildData.inputStyle)
      if(is) {
        setInputStyle(is)
      }
    }
    setIsEditing(true)
  }

  async function saveBuild() {
    try {
      setIsSaving(true)
      let updates = {
        name,
        notes,
        primaryActivity: activity.value,
        inputStyle: inputStyle.value,
        videoLink
      }

      let { ForgeClient, ForgeApiService } = window.services
      let token = await ForgeClient.getToken()
      await ForgeApiService.updateBuild(buildId, updates, token)

      // Update cache
      ForgeClient.userBuilds.forEach((b: BuildSummary) => {
        if(b.id === buildId) {
          b.name = name
        }
      })
      setIsEditing(false)
      if(onBuildUpdated) {
        onBuildUpdated(updates)
      }
    } catch (err) {
      dispatchAlert({
        title: "Updating Build",
        body: "An error occurred while updating this build. Please try again later...",
        isError: true,
        autohide: false,
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function archiveBuild() {
    let { ForgeClient, ForgeApiService } = window.services
    try {
      setIsSaving(true)
      let token = await ForgeClient.getToken()
      await ForgeApiService.archiveBuild(buildId, token)
      ForgeClient.userBuilds = ForgeClient.userBuilds.filter((b: BuildSummary) => b.id !== buildId)
      setIsBuildArchived(true)
    } catch (err) {
      dispatchAlert({
        title: "Archiving Build",
        body: "An error occurred while archiving this build. Please try again later...",
        isError: true,
        autohide: false,
      })
    } finally {
      setIsArchiveBuildModalOpen(false)
      setIsSaving(false)
    }
  }

  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [activity, setActivity] = useState<ActivityOption>({ value: "1", display: "Any Activity" })
  const [inputStyle, setInputStyle] = useState<ModalSelectorOption>({ value: "0", display: "None"})
  const [isSaving, setIsSaving] = useState(false)
  const inputStyleOptions: Array<ModalSelectorOption> = [
    {
      iconUrl: "/img/input-icons/mnk.png",
      value: "1",
      display: "Mouse & Keyboard"
    },
    {
      iconUrl: "/img/input-icons/controller.png",
      value: "2",
      display: "Controller"
    }
  ]

  return (
    <Wrapper>
      <UpvoteButton buildId={buildId} buildData={buildData} isBuildArchived={isBuildArchived} />

      <Button onClick={copyToClipboard}>
        {isCopied ? (
          <span>👍</span>
        ) : (
          <FontAwesomeIcon icon="link" />
        )}
        Copy Link
      </Button>
      <Button as="a" className="btn-twitter" href={twitterLink} target="_blank">
        <FontAwesomeIcon icon={['fab', 'twitter']} /> Share
      </Button>
      {isOwner && !isBuildArchived && (
        <>
          <Seperator />
          {!isEditing && (
            <Button onClick={() => setIsArchiveBuildModalOpen(true)}>
              <FontAwesomeIcon icon={faBox} /> Archive
            </Button>
          )}
          {!isEditing && (
            <Button onClick={() => editBuild()}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>
          )}
        </>
      )}


    <ForgeModal
      show={isArchiveBuildModalOpen}
      title="Archive Build"
      footer={
        <div>
          <ForgeButton disabled={isSaving} onClick={() => setIsArchiveBuildModalOpen(false)}>Cancel</ForgeButton>
          <ForgeButton disabled={isSaving} style={{marginLeft: "10px"}} onClick={() => archiveBuild()}>Archive</ForgeButton>
        </div>
      }>
        <p>
          Archiving a build will do the following:
        </p>
        <ul>
          <li>Remove from "My Builds"</li>
          <li>Remove from search & other public build lists</li>
          <li>Remove upvote & ownership information</li>
        </ul>
        <p>Direct links & bookmarks will still be valid. </p>
        <p><b>This operation CANNOT be undone.</b></p>
    </ForgeModal>

    <ForgeModal
      show={isEditing}
      title="Edit Build Info"
      size="lg"
      footer={
        <div>
          <ForgeButton disabled={isSaving} onClick={() => setIsEditing(false)}>Cancel</ForgeButton>
          <ForgeButton disabled={isSaving} style={{marginLeft: "10px"}} onClick={() => saveBuild()}>Save</ForgeButton>
        </div>
      }>
        <Row>
          <Col>
            <div className="build-info-card mb-3">
              <span>Name</span>
              <Input
                prefixIcon={faCube}
                placeholder='Give your build a name'
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                className="mb-3" />
              <span>Notes</span>
              <TextArea
                className="mb-3"
                prefixIcon={faStickyNote}
                rows={10}
                placeholder="Add some notes on how to use the build"
                value={notes}
                onChange={(e: any) => setNotes(e.target.value)}/>
              <span>Primary Activity</span>
              <ActivitySelector
                className="mb-3"
                value={activity}
                onChange={(opt: ActivityOption) => setActivity(opt)} />
              <span>Input Style</span>
              <ModalSelector
                title="Input Style"
                className="mb-3"
                options={inputStyleOptions}
                value={inputStyle}
                onChange={(opt: ModalSelectorOption) => setInputStyle(opt)} />
            </div>
            <h4>Video Review</h4>
            <div className="build-info-card">
              <Input
                prefixIcon={faYoutube}
                placeholder="Add a YouTube link"
                value={videoLink}
                className="mb-3"
                onChange={(e: any) => setVideoLink(e.target.value)} />
              <YouTubeEmbed youtubeUrl={videoLink} showPlaceholder />
            </div>
          </Col>
        </Row>
      </ForgeModal>
    </Wrapper>
  )
}

export default CommandsBar;
