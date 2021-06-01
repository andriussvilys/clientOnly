import React from 'react';
import { Context } from '../Provider';
// import axios from 'axios';
// import BootstrapModal from './BootstrapModal';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import '../css/components/extendedList.css';
import '../css/components/imageInfo.css';
// import openIconic from 'open-iconic';

class AddNew extends React.Component{

static contextType = Context;

constructor(props){
    super(props);

    this.state = {
        setShow: false,
        show: false,
        saveButtonText: "Save Changes",
        spinnerDisplay: "d-none",
        saveButtonDisable: false
    }
    // this.openModal = () => {
    //     this.setState({modalShow: !this.state.modalShow})
    // }
    this.handleClose = () => this.setState({
        setShow: false, 
        show: false,
        saveButtonText: "Save Changes",
        spinnerDisplay: "d-none",
        saveButtonDisable: false
    });

    this.handleShow = (e) => {
        e.preventDefault()
        this.setState({setShow: true, show: true})
    };
    this.changeButtonText = () => {
        this.setState({spinnerDisplay: "d-none", saveButtonText: "Done", saveButtonDisable: true})
    };
}


render(){
    return(

        <Modal show={this.props.showModal} onHide={this.handleClose}>
            <Modal.Body>
                <div>
                    ...loading data 
                    <Spinner 
                        style={{
                            height: "20px",
                            width: "20px",
                            borderWidth: "2px"
                        }}
                        animation="border" 
                        variant="purple" 
                        className={this.state.spinnerDisplay}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
    }
}

export default AddNew;