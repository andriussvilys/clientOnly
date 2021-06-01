import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class BootstrapModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            show: props.showModal,
            setShow: false
        }
        this.handleClose = () => this.setState({setShow: false, show: false}, console.log(this.state));
        this.handleShow = () => this.setState({setShow: true, show: true});
    }

    static getDerivedStateFromProps(props){
        if(props.showModal){
            return{show: true}
        }
        else{
            return {show:false}
        }
    }

    render(){
        return(
            <>
            <Modal show={this.state.show} onHide={this.handleClose}>

                <Modal.Body>
                {this.props.message}
                {this.props.children}
                </Modal.Body>

                <Modal.Footer>
                    {this.props.confirm ?
                    <Button 
                        variant="success"
                        onClick={() => {
                            this.props.confirmedAction()
                            }
                        }   
                        >
                            Confirm
                    </Button> :
                    null  
                    }                 
                        <Button 
                        disabled={this.props.blockClose ? true : false} 
                        variant={this.props.confirm ? "danger" : "success"} onClick={ () => {this.props.onClose()}}>
                            {this.props.confirm ? "Cancel" : "Okay"}
                        </Button>
                        
                </Modal.Footer>

            </Modal>
            </>
        )

    }
}