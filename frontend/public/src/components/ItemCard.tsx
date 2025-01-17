import React, { useState, useEffect } from 'react'
import Plug from './Plug'
import styled from 'styled-components'
import { BuildItem, BuildItemPlug } from '../models/Build'
import Card from './ui/Card'
import colors from '../colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemTierData } from '../data-utils/models/Item'
import Highlightable from './Highlightable'
import { faCog, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'
import Image from './ui/Image'

const Wrapper = styled(Card)`
  .card-content {
    padding: 9px !important;
  }

  .item-card-left {
    display: flex;
    flex-direction: column;
    margin-right: 5px;
  }

  .item-content {
    flex: 1;
  }

  .item-card {
    display: flex;
    flex-direction: row;
    text-align: left;
  }

  .item-icon-wrapper {
    position: relative;
    height: 80px;
    width: 80px;
  }

  .item-icon {
    max-width: 75px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-sizing: content-box;
    border: 2px solid rgba(0,0,0,0);
  }

  .affinity-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 30px;
    border-radius: 100px;
  }

  .item-name {
    font-weight: bold;
    border-bottom: 2px solid ${colors.theme2.dark1};
    padding-bottom: 5px;
    margin-bottom: 7px;
  }

  .socket-icon-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .socket-icon img {
    max-width: 45px;
    margin: 0px 3px 3px 0px;
    border-radius: 5px;
  }

  .item-base-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin-bottom: 10px;

    .power {
      margin-top: 2px;
      font-size: 15px;
    }

    .item-tier {
      color: ${colors.theme2.dark1};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 4px;
      width: 20px;
      border-radius: 2px;
      height: 15px;
    }

    .item-tier-1 {
      background-color: ${colors.elements.Arc};
    }

    .item-tier-2 {
      background-color: ${colors.elements.Solar} !important;
    }

    .item-tier-3 {
      background-color: ${colors.elements.Void};
    }

    .item-tier-4 {
      background-color: ${colors.elements.Void};
    }

    .item-tier-6 {
      background-color: ${colors.elements.Stasis};
    }

    .item-tier-icon {
      height: auto;
      max-width: 15px;
      margin-right: 3px;
    }
  }

  .item-buttons {
    height: auto;
    display: flex;
    flex: 1;
    align-items: end;

    svg {
      height: 20px;
      width: 20px;
      margin-right: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
`

type Props = {
  item: BuildItem
  highlights?: Array<string>
  className?: string
  configurable?: boolean
  onConfigureItemClicked?: Function
  onSwapItemClicked?: Function
  itemTierData?: ItemTierData
  power?: number | null
  isHighlightable?: boolean
  onHighlightableClicked?: Function
}

function ItemCard(props: Props) {
  const { item,
    highlights,
    className,
    configurable,
    onConfigureItemClicked,
    onSwapItemClicked,
    itemTierData,
    power,
    isHighlightable,
    onHighlightableClicked } = props

  return (
    <Wrapper className={`${className}`}>
      <div className="item-card">
        <div className="item-card-left">
          <div className="item-icon-wrapper">
            <Highlightable
              highlightKey={`item-${item.itemInstanceId}`}
              highlights={highlights}
              isHighlightable={isHighlightable}
              highlightClass="item-icon"
              onClick={onHighlightableClicked}>
                <Image src={item.ornamentIconUrl ? item.ornamentIconUrl : item.iconUrl} className="item-icon" alt="Item Icon" />
            </Highlightable>

            {item.affinityIcon && (<Image src={item.affinityIcon} className="affinity-icon" alt="Affinity Icon" />)}
          </div>

          {(itemTierData !== undefined || power !== undefined) && (
            <div className="item-base-stats">
              <div className="power">{ power }</div>
              { itemTierData && itemTierData.tier !== undefined && <div className={`item-tier bg-white`}>{itemTierData.tier} </div>}
            </div>
          )}

          {configurable && (
            <div className="flex flex-1 gap-2 items-end">
              <FontAwesomeIcon onClick={() => onConfigureItemClicked ? onConfigureItemClicked() : null} icon={faCog} />
              <FontAwesomeIcon onClick={() => onSwapItemClicked ? onSwapItemClicked() : null} icon={faExchangeAlt} />
            </div>
          )}
        </div>
        <div className="item-content">
          <div className="item-name">
            {item.name}
          </div>
          <div className="perks sockets">
            <div className="socket-icon-wrapper">
              {item.perks && item.perks.map((p: BuildItemPlug, idx: number) => (
                <div key={`perk-${item.itemInstanceId}-${p.plugHash}-${idx}`} className="socket-icon">
                  <Plug
                    plug={p}
                    plugType="perk"
                    highlights={highlights}
                    onClick={onHighlightableClicked}
                    itemInstanceId={item.itemInstanceId ? item.itemInstanceId : ""}
                    socketIndex={p.socketIndex ? p.socketIndex : 0}
                    isHighlightable={isHighlightable} />
                </div>
              ))}
            </div>
          </div>
          <div className="mods sockets">
            <div className="socket-icon-wrapper">
              {item.mods && item.mods.map((m: BuildItemPlug, idx: number) => (
                <div key={`mod-${item.itemInstanceId}-${m.plugHash}-${idx}`} className="socket-icon">
                  <Plug
                    plug={m}
                    plugType="mod"
                    highlights={highlights}
                    onClick={onHighlightableClicked}
                    itemInstanceId={item.itemInstanceId !== undefined ? item.itemInstanceId : ""}
                    socketIndex={m.socketIndex !== undefined ? m.socketIndex : 0}
                    isHighlightable={isHighlightable} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default ItemCard
