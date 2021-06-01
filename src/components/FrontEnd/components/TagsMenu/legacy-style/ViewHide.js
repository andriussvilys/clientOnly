import React from 'react'

export default class ViewHide extends React.Component{
    constructor(props){
        super(props);
      this.state = {view: true}
    }
    render(){
        const onDisplay = Object.keys(this.props.context.state.artworkOnDisplay)
        return(
            <div className="button_legacy-style--container">
                <button
                    disabled={onDisplay.length > 0}
                    className={`button_legacy-style ${!onDisplay.length > 0 ? `button_legacy-style_disable` : `button_legacy-style_enable`}`}
                    onClick={() => {
                        this.setState({view: !this.state.view})
                        this.props.context.resetAll()}}
                >View all</button>
                <button
                    disabled={!onDisplay.length > 0}
                    className={`button_legacy-style ${onDisplay.length > 0 ? `button_legacy-style_disable` : `button_legacy-style_enable`}`}
                    onClick={() => {
                        this.setState({view: !this.state.view})
                        this.props.context.resetAll(true)}}
                >Hide all</button>
            </div>
        )
    }
}