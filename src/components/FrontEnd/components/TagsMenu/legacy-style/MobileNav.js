import React from 'react'

export default class MobileNav extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            openTab: null,
            closeTabMethod: null
        }
        this.closePrev = (e, trigger) => {
            if(!this.state.openTab){
                return
            }
            if(this.state.openTab === "Filters" && trigger !== "Filters"){
                if(document.getElementById("TagsMenu").classList.contains("show-menu")){
                    this.props.context.showMenu(e)
                }
            }
            if(this.state.openTab === "About" && trigger !== "About"){
                this.props.context.closeEnlarge(e)
            }
            return
        }
    }
    render(){
        return(<nav className={"MobileNav-container"}>
            <div className={"MobileNav-wrapper"}>
                <button 
                className={"Mobilenav-button"}
                onClick={(e) => {
                    // this.closePrev(e, "Filters")
                    this.props.context.showMenu(e)
                    let newState = {...this.state}
                    newState.openTab = "Filters"
                    newState.closeTabMethod = this.props.context.showMenu
                    this.setState({openTab: "Filters"})
                }}
                >
                    <span>Filters</span>
                </button>

                <button 
                    className={"Mobilenav-button"}
                    onClick={(e) => {
                        let openTab = null;
                        if(this.state.openTab == "About"){
                            if(this.props.context.state.enlarge.file == "portrait.jpg"){
                                this.props.context.closeEnlarge();
                                openTab = null;
                            }
                            else{
                                openTab = "About"  
                                this.props.context.loadImage("portrait.jpg")
                                setTimeout(() => {
                                    this.props.context.showInfo(0)
                                }, 400);
                            }
                        }
                        else{
                            openTab = "About"  
                            this.props.context.loadImage("portrait.jpg")
                            setTimeout(() => {
                                this.props.context.showInfo(0)
                            }, 400);
                        }
                        this.setState({openTab: openTab})
                    }}
                    style={{
                        flex: 2
                    }} 
                >
                    <span>About / Contact</span>
                </button>

            </div>

            <div 
                className={"enlarge-closeButton-container"}
                style={{
                    display: this.props.context.state.mobile ? "none" : "flex",
                    opacity: this.props.context.state.enlarge.open ? 1 : 0
                }}
                >
                <button 
                className="Mobilenav-button"
                style={{
                    border: "none"
                }}
                onClick={(e) => {
                    e.stopPropagation()
                    this.props.context.closeEnlarge()
                }}
                >
                    <span>close ></span>
                </button>
            </div>   
        </nav>)
    }
}
