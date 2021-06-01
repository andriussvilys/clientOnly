import React from 'react'
import ArtworkInfo from '../ArtworkInfo/ArtworkInfo'
import Filters from '../Filters/Filters'
import { Tab, Tabs } from 'react-bootstrap'
import BootstrapModal from '../BootstrapModal'
import { Button } from 'react-bootstrap' 
import ArrangeFamilyIndexes from '../ArrangeIndexes/ArrangeFamilyIndexes'
import SeeAlsoContainer from '../SeeAlso/SeeAlsoContainer'
import SelectFamily from '../FamilyInfo/subcomponents/SelectFamily'
import ImageBox from '../ImageBox/ImageBox'

export default class EditArtwork extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          submitButtons: null,
          showModal: null,
          modalMessage: null
        }
      }

      render(){
          return (
              <div key={`FileInfo_${this.props.file.fileName}`} className="FamilyList--detail">
  
                  <ImageBox
                      file={this.props.file}
                  >
                  </ImageBox>
  
                  <div className="FamilyList--detail__info">

                  <Tabs defaultActiveKey="artworkInfo" transition={false} id="uploadFile-details">
                    <Tab eventKey="artworkFamily" title="Select Artwork Family">
                        <SelectFamily 
                            context={this.props.context}
                            fileName={this.props.file.fileName}
                        />
                    </Tab>
                    <Tab eventKey="artworkInfo" title="Artwork Info">
                        <ArtworkInfo 
                            file={this.props.file}
                            fileName={this.props.file.fileName}
                            onChange={this.props.context.onChange}
                            state={this.props.context.state}
                            context={this.props.context}
                        />
                    </Tab>
                    <Tab eventKey="filters" title="Filters">
                        <Filters 
                            context={this.props.context}
                            fileName={this.props.file.fileName}
                        />
                    </Tab>
                    <Tab eventKey="arrangeIndexes" title="Arrange image indexes">
                        <ArrangeFamilyIndexes 
                            data={this.props.context.state.relatedArtwork[this.props.file.artworkFamily]}
                            file={this.props.file}
                        />
                    </Tab>
                    <Tab eventKey="seeAlso" title="Select See Also recommendations">
                        <SeeAlsoContainer 
                            directory={this.props.context.state.fileData.files[this.props.file.fileName].seeAlso}
                            initialData={this.props.context.state.artworkInfoData}
                            context={this.props.context}
                            parent={this.props.file}
                        />
                    </Tab>
                  </Tabs>
  
                  <div className="FamilyList--submit-delete-container">  
                      <Button
                          variant="danger"
                          className="custom-button"
                          onClick={ () => this.props.context.fileDataMethods.removeFile(this.props.file.fileName, this.props.artworkFamily)}
                      >
                          Remove
                      </Button>   
                      <Button
                          variant="success"
                          className="custom-button"
                          onClick={() => {
                              const verification = this.props.context.verify()
                              if(!verification.verified){
                                  return this.setState({showModal: true, modalMessage: verification.modalMessage})
                              }
                              this.setState({
                                  showModal: true,
                                  modalMessage: "loading..."
                              })
                              const postRes = this.props.context.fileDataMethods.postArtworkInfo(this.props.file)
                              postRes
                              .then( res => {
                                  this.setState({
                                      modalMessage: res
                                  })
                              })
                              .catch(err => {
                                  this.setState({
                                      modalMessage: err
                                  })
                              })
                          }
                          }
                      >
                          Submit to server
                      </Button>
  
                  </div>
  
                      <BootstrapModal 
                          showModal={this.state.showModal}
                          message={this.state.modalMessage}
                          onClose={() => {this.setState({showModal: false})}}
                      />
  
                  </div>    
  
              </div>
          )
      }
}

