import React, { Fragment } from 'react'
import Controls from '../ArtworkInfo/Controls'

const Nav = (props) => {
    const showButtons = () => {
        if(props.context.state.enlarge){
            if(!props.context.state.enlarge.open){
                return false
            }
            else{return true}
        }
        else{return false}
    }
    const showInfo = () => {
        if(props.context.state.enlarge){
            if(props.context.state.enlarge.open){
                return true
            }
            return false
        }
        return false
    }
        return(
            <div
                className="Navbar"
                style={{
                }}
                >
                    <Fragment>
                    <button
                        id="button-next"
                        onClick={() => props.context.viewNext(+1)}
                        className={showButtons() ? "Nav-button Nav-button_next" : "Nav-button Nav-button_next move-right"}
                    >
                        <img alt="view next" src="icons/point-right.png" />
                    </button>
                    <button
                        id="button-prev"
                        onClick={() => props.context.viewNext(-1)}
                        className={showButtons() ? "Nav-button Nav-button_prev" : "Nav-button Nav-button_prev move-left"}
                    >
                        <img alt="view previous" src="icons/point-left.png"/>
                    </button>
                        <div 
                            className="Nav-button Nav-button-menu" 
                            onClick={(e) => props.context.showMenu(e)}
                        >
                            <img className="menu" alt="menu button" src='icons/menu.png'/>
                        </div>
                    {showInfo() ?                                    
                        <div 
                            className="Nav-button Nav-infoButton"
                            onClick={() => props.context.showInfo()}
                        >
                            <img className="Nav-infoButton-icon" alt="info buton" src="icons/info.png" />
                        </div>
                        : 
                        null
                    }
                    </Fragment>
            </div>
        )
}

export default Nav
