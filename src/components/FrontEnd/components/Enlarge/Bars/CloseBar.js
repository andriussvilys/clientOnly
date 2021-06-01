import React from 'react'
import CloseButton from './CloseButton'

const TopBar = (props) => {
    const spreadLetters = (title) => {
        let letters = Array.from(title).map((letter, index) => {
            return <span 
            key={`${title}-leter-${index}`} 
            className="title-letter"
            >{letter}</span>
        })
        return letters
    }
    return(
        <div
            className="enlarge-bar"
        >
            <CloseButton 
                context={props.context}
            />
        </div>
    )
}

export default TopBar
