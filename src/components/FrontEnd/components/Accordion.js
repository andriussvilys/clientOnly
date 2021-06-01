import React from 'react'
import {Accordion as BootstrapAccordion, Card, Button} from 'react-bootstrap'

const Accordion = (props) => {

    const toggle = (toggle) => {
        if(toggle){
           return  <BootstrapAccordion.Toggle 
            as={Button} 
            variant="link" 
            eventKey="0"
            // className={props.level ? `tagsMenu-Button tagsMenu-Button_${props.level}` : "tagsMenu-Button"}
            className="tagsMenu-Button"
            >
                {props.title}
            </BootstrapAccordion.Toggle>
        }
        else{
            return(
            <BootstrapAccordion 
            variant="link" 
            eventKey="0"
            className={props.level === "category" ? "tagsMenu-Button tagsMenu-Button_category noClick" : "tagsMenu-Button tagsMenu-Button_subcategory noClick"}
            style={{width: "auto"}}
            >
                {props.title}
            </BootstrapAccordion>
            )
        }
    }
    const createAcc = () => {
        return <div
                    className={`
                    TagsMenu-Card-Title 
                    ${props.className}
                    ${props.checked ? 'checkbox-selected' : null}
                    `}
                >
                    {toggle(props.toggle)}
                        {props.checkbox}
                </div>
    }
    return(
        <BootstrapAccordion defaultActiveKey={props.open? "0" : "1"}>
            <Card className={`TagsMenu-Card`}>
                {createAcc()}
                <BootstrapAccordion.Collapse id={props.collapseId} eventKey="0">
                <Card.Body id={props.collapseToggle} className={`${props.level}-collapse`}>
                    {props.children}
                </Card.Body>
                </BootstrapAccordion.Collapse>
            </Card>
        </BootstrapAccordion>  
    )
}

export default Accordion