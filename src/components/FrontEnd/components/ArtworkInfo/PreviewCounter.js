import React from 'react'

const PreviewCounter = (props) => {
    const create = (file) => {
        // const famName = file.background.artworkFamily
        // const famArray = props.relatedArtwork[famName].column.fileIds
        const famArray = props.relatedArtwork
        const currentIndex = props.relatedArtwork.indexOf(file.background.fileName)+1
        const counter = <div className="previewBubble-container previewCounter">
            <span className={"ArtworkInfo_artworkTitle_secondary"}>
                {`${currentIndex} / ${famArray.length}`}
            </span>
        </div>
        return counter
    }
    if(props.relatedArtwork){
        return(
            // <div className="previewBubble-container" id="previewBubble-container">
            //     <div className="previewBubble-wrapper" id="previewBubble-wrapper">
            //         {props.file && props.file.open ? countBubbles(props.file) : null}
            //     </div>
            //     {props.children}
            // </div>
            create(props.file)
        )
    }
}

export default PreviewCounter