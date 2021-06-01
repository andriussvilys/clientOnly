import React from 'react'
import Category from './Category'
import ViewHide from './ViewHide'
import Switch from './slider'

export class List extends React.Component{
    constructor(props){
        super(props);
      this.state = {
          opened: false
      }
      this.createList = (data) => {
          const list = data.map(categoryObj => {
              const isOnDisplay = () => {
                if(this.props.context.state.categoriesOnDisplay.category[categoryObj.category]){
                    return this.props.context.state.categoriesOnDisplay.category[categoryObj.category].display
                }
                else{ return false}
              } 
              if(isOnDisplay()){
                  return <Category 
                              key={categoryObj.category}
                              data={categoryObj}
                              context={this.props.context}
                          />
              }
              else{return null}
                  })
          return list
      }
    }
    render(){
        return(<div id="TagsMenu" 
        className={`FilterTree-container ${this.props.context.state.showFilters ? "show-menu" : ""}`}
        >
                <div className={"FilterTree-wrapper"}>
                    {this.props.data ? this.createList(this.props.data) : null}
                    {this.props.context.state.artworkOnDisplay ?                 
                    <ViewHide 
                        context={this.props.context}
                    /> : null
                    }
                    <Switch 
                        context={this.props.context}
                    />
                </div>
            </div>
        )
    }
}

export default List