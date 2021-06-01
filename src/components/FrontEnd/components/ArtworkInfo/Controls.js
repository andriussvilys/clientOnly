import React from 'react'

const Controls = (props) => {
    const exitButton = () => {
        return(
            <div 
            className="controls-button controls-exitButton"
            onClick={(e) => {
                e.stopPropagation()
                const artworkInfo = document.getElementById("ArtworkInfo")
                const menu = document.getElementById("TagsMenu")
                const enlarge = props.context.state.enlarge
                if(artworkInfo &&  artworkInfo.classList.contains("info-up")){
                    // console.log("run close info")
                    // props.context.showInfo({close: true})
                    artworkInfo.classList.toggle("info-up")
                    return
                }
                else if(menu.classList.contains("show-menu")){
                    console.log("run close Menu")
                    props.context.showMenu(e)
                    return
                }
                else if(enlarge && enlarge.open){
                    console.log("run close enlar")
                    props.context.closeEnlarge(e)
                }
            }}
            >
                <span>x</span>
            </div>
        )
    }

    const slideButton = () => {
        const toggle = (e) => {
            e.stopPropagation()
            if(!props.context.state.enlarge || !props.context.state.enlarge.open){
                props.context.loadEnlarge(e, "portrait.jpg");
                setTimeout(() => {
                    if(document.getElementById("ArtworkInfo")){
                        // document.getElementById("ArtworkInfo").classList.add("show")
                        // setTimeout(() => {
                            document.getElementById("ArtworkInfo").classList.add("info-up")
                        // }, 200);
                    }
                }, 200)
                return
            }
            if(document.getElementById("TagsMenu").classList.contains("show-menu")){
                props.context.showMenu(e)
            }
            const artworkInfo = document.getElementById("ArtworkInfo")
            if(artworkInfo){
                artworkInfo.classList.toggle("info-up")
            }
        }
        return(
            <div 
            className="controls-button controls-slideButton"
            onClick={(e) => toggle(e)}
            >
                <img className="Nav-infoButton-icon" alt="info buton" src="icons/info.png" />
            </div>
        )
    }
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
        <div className="controls">
            {slideButton()}
            <div 
                className="menu-container"
                onClick={(e) => {
                    console.log("combined show menu")
                    props.context.showMenu(e)}
                }
                >
                <div className="menu-title">
                    {spreadLetters("menu")}
                </div>
            </div>
            {exitButton()}
        </div>
    )
}

export default Controls