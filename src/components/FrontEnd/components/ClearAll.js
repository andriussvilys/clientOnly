import React from 'react'

const ClearAll = (props) => {

    let hide = props.context.state.artworkOnDisplay && Object.keys(props.context.state.artworkOnDisplay).length > 0

    const clearImgs = (hide, e) => {
        props.context.filterAllThemes(hide)
            // props.context.closeEnlarge(e, true)
            props.context.resetAll()
    }

    const spreadLetters = (title) => {
        let letters = Array.from(title).map((letter, index) => {
            return <div key={`${title}-leter-${index}`} className="title-letter white-font">{letter}</div>
        })
        return letters
    }

    return(
        <div 
        onClick={(e) => {clearImgs(hide, e)}}
        className="
        clearAll-container
        dark-bg
        ">
            {spreadLetters(
                props.context.state.artworkOnDisplay && Object.keys(props.context.state.artworkOnDisplay).length > 0 ?
                    "clear all" :
                    "view all"
            )}
        </div>
    )
}

export default ClearAll;