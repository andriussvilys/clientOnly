import React, { Fragment } from 'react';
import FamilyList from './FamilyList'
import { Context } from '../../../Provider';


export default class MainContainer extends React.Component{

    static contextType = Context;
    
    filesData = () => Object.keys(this.props.data.files).map(objName => {
        return this.props.data.files[objName]
    })
    
    /**
     * @returns returns an object with 
     * #1: familyNames: an Array of FamilyNames of uploaded files 
     * #2: fileByFamily: an Object that's a collection of arrays sorted by artworkFamily
     */
    sortByFamily = () => {

        let fileByFamily = {}
        let familyNames = []

            this.filesData().forEach(file => {
            if(!file.artworkFamily){
                if(!fileByFamily.none){
                    fileByFamily.none = []
                }
                return fileByFamily.none = [...fileByFamily.none, file]
            }
            if(!fileByFamily[file.artworkFamily]){
                fileByFamily[file.artworkFamily] = []
            }
            fileByFamily[file.artworkFamily] = [...fileByFamily[file.artworkFamily], file]
        })

        familyNames = Object.keys(fileByFamily)

        return {fileByFamily, familyNames}
    }

    renderNames = (data) => {
        if(!data){
            return
        }

        const sortedData = this.sortByFamily()

        let list = this.sortByFamily().familyNames.map(familyName => {
            return (
                <FamilyList 
                    key={`familyList-${familyName}`}
                    familyName={familyName}
                    context={this.context}
                    files={sortedData.fileByFamily[familyName]}
                />
            ) 
        })
        return list
    }
    
    render(){
        return(
            <Context.Consumer>
                {() => {
                    return(
                        <Fragment key={'main_container'}>
                            {this.renderNames(this.props.data.files)}
                        </Fragment>
                    )
                }}
            </Context.Consumer>
        )
    }
}
