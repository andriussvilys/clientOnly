import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Context } from '../Provider';

import { Tab, Tabs } from 'react-bootstrap'
import EditDetailContainer from './components/EditPage/EditDetailContainer';
import ServerFileUpdate from './components/EditPage/ServerFileUpdate';
import BootstrapModal from './components/BootstrapModal';
import Filters from './components/Filters/Filters';
import EditFamilyInfo from './components/FamilyInfo/EditFamilyInfo'
import SubmitFamilyInfo from './components/FamilyInfo/subcomponents/SubmitFamilyInfo'
import Themes from './components/Filters/subcomponents/Themes'
import Categories from './components/Filters/subcomponents/Categories'
import CategoriesOnDisplay from './components/Filters/subcomponents/categoriesOnDisplay/CategoriesOnDisplay'
import ArtworkOnDisplay from './components/Create/ArtworkOnDisplay'

export default class Edit extends Component{
    static contextType = Context;
    constructor(props){
      super(props);
      this.state = {
        submitButtons: null,
        confirmedAction: null
      }
    }
  

    //returns an array from a names collection
    filesData = (dataObj) => Object.keys(dataObj).map(objName => {
        return dataObj[objName]
    })

    sortByFamily = () => {

        let fileByFamily = {}
        let familyNames = []
            this.filesData(this.context.state.artworkInfoData).forEach(file => {
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

    submitButtons = () => {
        const currentFamily = this.context.state.familySetupData.artworkFamily
        const recordedFamilyNames = this.context.state.artworkFamilyList
      
        const submitAction = () => {
      
          const verification = this.context.verify()
      
          if(!verification.verified){
            const refuseAction = () => {
              this.setState({
                showModal: true,
                modalMessage: verification.message
              })
            }
            return refuseAction
          }
      
          if(recordedFamilyNames.includes(currentFamily)){
            const submitUpdate = () => {
              this.setState({
                showModal: true,
                modalMessage: "...loading..."
                }, () => {
      
                  this.context.familySetupMethods.updateFamilySetup(this.context.state.familySetupData.artworkFamily)
                    .then(res => {
                      this.setState({
                        modalMessage: res
                      })
                    })
                    .catch(err => {
                      this.setState({
                        modalMessage: err
                      })
                    })
              })
            }
            return submitUpdate
          }
      
          else{
            const submitNew = () => {
              this.setState({
                showModal: true,
                modalMessage: "...loading..."
                }, () => {
                    this.context.familySetupMethods.createFamilySetup()
                      .then(res => {
                        this.setState({
                          modalMessage: res
                        })
                      })
                      .catch(err => {
                        this.setState({
                          modalMessage: err
                        })
                      })
                })
            }
            return submitNew
          }
        }
        return(
          <SubmitFamilyInfo 
            context={this.context}
            submitAction={submitAction()}
          />
        )
    }

    modalInvoke = (options, callbackPromise) => {
      let newState = {...this.state}
      newState = {
        ...newState,         
        showModal: true,
        modalMessage: "...loading..."
      }
      if(options && options.requireActionConfirm){
        newState.confirm = true
      }
      else{
        newState.confirm = false
      }

      this.setState(newState, () => {
          if(!options || !options.requireActionConfirm){
            // callbackPromise
            options.confirmedAction
            .then(res => {
              this.setState({
                modalMessage: res.modalMessage
              })
            })
            .catch(err => {
              this.setState({
                modalMessage: err.modalMessage
              })
            })
          }
          else{
                this.setState({
                  confirmedAction: options.confirmedAction,
                  modalMessage: options.modalMessage,
                })
          }

        })
      }

    render(){
        return(
                <Context.Consumer>
                {
                    () => {
                        return(
                                <Switch>
                                    <Route exact path="/admin/edit">
                                        {/* <h3>Edit</h3> */}
                                          <div className="Tabs-container">
                                            <Tabs defaultActiveKey="editArtwork" transition={false} id="edit-artwork-family">
                                            <div style={{backgroundColor: "#e4e4e4", padding: "7px"}}>
                                                {this.submitButtons()}  
                                                <div>
                                                    current Artwork Family:
                                                    <strong>{this.context.state.familySetupData.artworkFamily}</strong>
                                                </div>
                                                </div>
                                                <Tab eventKey="editArtwork" title="Edit by Artwork">
                                                    <EditDetailContainer 
                                                        context={this.context}
                                                        state={this.context.state}
                                                        familySetupMethods={this.context.familySetupMethods}
                                                    />
                                                </Tab>
                                                <Tab eventKey="editFamily" title="Edit Artwork Families">
                                                    {this.submitButtons()} 
                                                    <EditFamilyInfo 
                                                        context={this.context}
                                                    />
                                                    <Filters 
                                                        context={this.context}
                                                    /> 
                                                </Tab>
                                                <Tab eventKey="new_theme" title="Delete data filters">
                                                  <div className="Tabs-container">
                                                    <Tabs>
                                                      <Tab eventKey="delete_theme" title="Delete Themes">
                                                        <Themes 
                                                        context={this.context}
                                                        dataArray={this.context.state.themesData}
                                                        onChange={this.context.familySetupMethods.onChange}
                                                        modalInvoke={this.modalInvoke}
                                                        allowDelete
                                                      />
                                                      </Tab>
                                                      <Tab eventKey="delete_category" title="Delete Categories">
                                                        <Categories 
                                                        context={this.context}
                                                        modalInvoke={this.modalInvoke}
                                                        allowDelete
                                                        />
                                                      </Tab>
                                                    </Tabs>
                                                  </div>
                                                </Tab>
                                                <Tab eventKey="DisplayFilters" title="Select displayed filters">
                                                  <CategoriesOnDisplay 
                                                    context={this.context}
                                                    modalInvoke={this.modalInvoke}
                                                  />
                                                </Tab>
                                                <Tab eventKey="artworkOnDisplay" title="Arrange Artwork on Display">
                                                  <ArtworkOnDisplay 
                                                    context={this.context}
                                                    state={this.context.state}
                                                    familySetupMethods={this.context.familySetupMethods}
                                                    highlightRef={Object.keys(this.context.state.staticState.artworkOnDisplay)}
                                                  />
                                                </Tab>
                                            </Tabs>
                                          </div>
                                          <BootstrapModal 
                                              showModal={this.state.showModal || this.context.state.showModal}
                                              message={this.state.modalMessage}
                                              onClose={() => {this.setState({showModal: false})}}
                                              confirm={this.state.confirm || false}
                                              confirmedAction={() => {
                                                this.state.confirmedAction()
                                                  .then(res => {
                                                    this.setState({
                                                      confirm: res.confirm,
                                                      modalMessage: res.modalMessage
                                                    })
                                                  })
                                                  .catch(err => {
                                                    this.setState({
                                                      confirm: err.confirm,
                                                      modalMessage: err.modalMessage
                                                    })
                                                  })
                                              }}
                                            >
                                          </BootstrapModal>

                                    </Route>
                                    <Route 
                                        path="/admin/edit/:fileName"
                                        render={(props) => 
                                            {return <ServerFileUpdate 
                                                    // relatedArtwork={this.context.state.relatedArtwork[familyName]}
                                                    context={this.context}
                                                    familyName={this.context.state.artworkInfoData[props.match.params.fileName].artworkFamily}
                                                    file={this.context.state.fileData.files[props.match.params.fileName]}
                                                    files={this.sortByFamily().fileByFamily[this.context.state.artworkInfoData[props.match.params.fileName].artworkFamily]}
                                                    relatedArtwork={this.context.state.relatedArtwork[this.context.state.artworkInfoData[props.match.params.fileName].artworkFamily]}

                                                    removeFile={this.context.fileDataMethods.removeFile}

                                                />
                                            }
                                        }
                                    /> 
                                    {/* <BootstrapModal 
                                        showModal={this.context.state.showModal}
                                        message="updating database"
                                        onClose={this.context.onClose}
                                    /> */}
                                </Switch>
                        )
                    }
                }
                </Context.Consumer>
        )
    }
}