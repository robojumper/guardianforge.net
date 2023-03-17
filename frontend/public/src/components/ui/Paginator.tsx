import { faCaretLeft, faCaretRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { ReactNode, useEffect, useState } from 'react'
import ForgeButton from '../forms/Button'

type PaginatorButtonProps = {
  disabled?: boolean
  active?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
  children: ReactNode
}

function PaginatorButton({ disabled, active, onClick, children }: PaginatorButtonProps) {
  return <ForgeButton 
    disabled={disabled}
    onClick={onClick}
    className={`
      border-none
      px-4
      py-2
      rounded-none
      first:rounded-r-none
      first:rounded-l
      last:rounded-r 
      last:rounded-l-none
      border-r 
      last:border-none
      ${active ? 'bg-accent1' : ''}`}>
    { children }
  </ForgeButton>
}

type Props = {
  onPageNavigate: Function
  page: number
  maxPageIterationsToDisplay: number
  totalPages: number
}

function Paginator({ onPageNavigate, page, maxPageIterationsToDisplay, totalPages }: Props) {
  const [showLeftElipses, setShowLeftElipses] = useState(false)
  const [showRightElipses, setShowRightElipses] = useState(false)

  useEffect(() => {
    if((page - maxPageIterationsToDisplay) > 1) {
      setShowLeftElipses(true)
    } else {
      setShowLeftElipses(false)
    }
    if((page + maxPageIterationsToDisplay) < totalPages) {
      setShowRightElipses(true)
    } else {
      setShowRightElipses(false)
    }
  }, [page])

  return (
    <div className="mt-3 flex justify-center">
      <div className="first:rounded-l">
        <PaginatorButton
          disabled={page === 1}
          onClick={() => onPageNavigate(page - 1)}>
          <FontAwesomeIcon icon={faCaretLeft} />
        </PaginatorButton>

        {showLeftElipses && 
          <PaginatorButton disabled>
            <FontAwesomeIcon icon={faEllipsisH} />
          </PaginatorButton>
        }

        {Array.from(Array(totalPages), (el, idx) => {
          let paginatorBeingRendered = idx + 1
          let low = page - maxPageIterationsToDisplay
          let high = page + maxPageIterationsToDisplay
          while(low < 1) {
            low++
            high++
          }
          while(high > totalPages) {
            low--
            high--
          }
          if(low <= paginatorBeingRendered && paginatorBeingRendered <= high) {
            return (
              <PaginatorButton
                active={page === idx + 1}
                key={`page-${idx + 1}`}
                onClick={() => onPageNavigate(idx + 1)}>
                { idx + 1 }
              </PaginatorButton>
            )
          }
          return <></>
        })}

        {showRightElipses && 
          <PaginatorButton disabled>
            <FontAwesomeIcon icon={faEllipsisH} />
          </PaginatorButton>
        }
        
        <PaginatorButton
          disabled={page === totalPages}
          onClick={() => onPageNavigate(page + 1)}>
          <FontAwesomeIcon icon={faCaretRight} />
        </PaginatorButton>
      </div>
    </div>
  )
}

export default Paginator