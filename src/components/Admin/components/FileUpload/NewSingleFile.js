import React from 'react';
import Button from 'react-bootstrap/Button'

import { Tab, Tabs } from 'react-bootstrap'
import ArtworkInfo from '../ArtworkInfo/ArtworkInfo'
import BootstrapModal from '../BootstrapModal'
import Filters from '../Filters/Filters'
import EditFamilyInfo from '../FamilyInfo/EditFamilyInfo';

import ImageBox from '../ImageBox/ImageBox';
import ArrangeFamilyIndexes from '../ArrangeIndexes/ArrangeFamilyIndexes';
import SeeAlsoPicker from '../SeeAlso/SeeAlsoPicker';

/**
 * @props file 
 * @props state
 * @props controls
 * @props familyDropDown 
 * @props themesDropDown
 * @props seeAlso {                    
 *  state: this.context.state,
    context: this.context,
    initialData: this.context.state.artworkInfoData,
    onChange: this.context.fileDataMethods.onChange, 
        }
 */
export default class NewSingleFile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            submitButtons: null,
            showModal: null,
            modalMessage: null
        }
    }

    onClose = () => {
        this.setState({showModal: false})
    }
    verify = () => {
        const result = this.props.context.verify()
        if(result.verified){
          return true
        }
        else{
          this.setState({...result})
          return false
        }
      }
    render(){
        if(!this.props.file){
            return null
        }
        return(
        <div className="FileInfo-container SingleFile-container">
            <div className="FileInfo-preview">
                <ImageBox 
                    customClass={"FileInfo-imageBox"}
                    file={this.props.file}
                />
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
                            const postRes = this.props.context.fileDataMethods.postArtworkInfo(this.props.file)
                            postRes
                            .then( res => {
                                console.log("postRes result")
                                console.log(res)
                            })
                            .catch(err => {
                                console.log("ERROR")
                            })
                        }
                        }
                    >
                        Submit to server
                    </Button>
                    </div>    
            </div>

            <div className="Tabs-container">
                <Tabs defaultActiveKey="artworkInfo" transition={false} id={`${this.props.file.fileName}-fileUpdate`}>
                    <Tab eventKey="artworkInfo" title="Edit Artwork Info">
                        <ArtworkInfo 
                            file={this.props.file}
                            fileName={this.props.file.fileName}
                            onChange={this.props.context.onChange}
                            state={this.props.context.state}
                            context={this.props.context}
                        />
                    </Tab>
                    <Tab eventKey="familyInfo" title="Edit Artwork Family Info">
                        <EditFamilyInfo 
                            context={this.props.context}
                            fileName={this.props.file.fileName}
                            uncontrolled
                        />
                    </Tab>
                    <Tab eventKey="filters" title="Filters">
                        <Filters 
                        context={this.props.context}
                        fileName={this.props.file.fileName}
                        />
                    </Tab>
                    <Tab eventKey="indexes" title="Arrange indexes">
                        <ArrangeFamilyIndexes 
                            data={this.props.context.state.relatedArtwork[this.props.file.artworkFamily]}
                            file={this.props.file}
                        />
                    </Tab>
                    <Tab eventKey="seeAlso" title="See Alsos">
                        <SeeAlsoPicker 
                            context={this.props.context}
                            state={this.props.context.state}
                            directory={this.props.context.state.fileData.files[this.props.file.fileName].seeAlso}
                            initialData={this.props.context.state.artworkInfoData}
                            parent={this.props.file}

                            file={this.props.file}
                            fileName={this.props.file.fileName}
                            onChange={this.props.context.onChange}

                            familySetupMethods={this.props.context.familySetupMethods}
                            highlightRef={this.props.context.state.fileData.files[this.props.file.fileName].seeAlso}
                        />
                    </Tab>
                </Tabs>
            </div>

            <BootstrapModal 
                showModal={this.state.showModal}
                message={this.state.modalMessage}
                onClose={() => {console.log("clicked on close"); this.setState({showModal: false})}}
            />
    
        </div>
        )
    }
}

