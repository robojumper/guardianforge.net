import React from 'react'
import styled from 'styled-components'
import Stat from './Stat'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.05);
  background-color: #1e1f24;
  text-align: left;
  border-radius: 5px;
  padding: 5px;
  flex-wrap: wrap;

  @media (max-width: 576px) {
    max-width: 287px;
    margin: 0 auto;

    img {
      margin: 3px;
    }
  }

  img {
    max-width: 45px;
    padding: 0px 5px;
    border-radius: 5px;
    margin-right: 5px;
  }

  span {
    font-size: 1.3rem;
  }

  &:last-child {
    border-right: 0px !important;
  }
`

function StatBar({ stats, highlights, onStatClicked }) {
  return (
    <Wrapper>
      {stats.mobility && (
        <Stat
          iconUrl={stats.mobility.icon}
          value={stats.mobility.value}
          name="mobility"
          onClick={onStatClicked ? onStatClicked : null}
          highlights={highlights} />
      )}

      {stats.resilience && (
        <Stat
          iconUrl={stats.resilience.icon}
          value={stats.resilience.value}
          name="resilience"
          onClick={onStatClicked ? onStatClicked : null}
          highlights={highlights} />
      )}

      {stats.recovery && (
        <Stat
          iconUrl={stats.recovery.icon}
          value={stats.recovery.value}
          name="recovery"
          onClick={onStatClicked ? onStatClicked : null}
          highlights={highlights} />
      )}

      {stats.discipline && (
        <Stat
          iconUrl={stats.discipline.icon}
          value={stats.discipline.value}
          name="discipline"
          onClick={onStatClicked ? onStatClicked : null}
          highlights={highlights} />
      )}

      {stats.intellect && (
        <Stat
          iconUrl={stats.intellect.icon}
          value={stats.intellect.value}
          name="intellect"
          onClick={onStatClicked ? onStatClicked : null}
          highlights={highlights} />
      )}

      {stats.strength && (
        <Stat
          iconUrl={stats.strength.icon}
          value={stats.strength.value}
          name="strength"
          onClick={onStatClicked ? onStatClicked : null}
          highlights={highlights} />
      )}
    </Wrapper>
  )
}

export default StatBar
