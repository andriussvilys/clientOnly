import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import FamilyListDraggable from './FamilyListDraggable';

const DndListDroppable = (props) => {

    return(
            <Droppable 
            droppableId={`${props.artworkFamily}-relatedArtworks`}
            >
            {provided =>{
                let orderData = props.column.fileIds 
                // ? props.column.fileIds : Object.keys(props.files)
                            return(
                                <div 
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="DnDfilesList"
                                >
                                    {orderData.map((fileId, index) => {
                                        return (

                                        <FamilyListDraggable
                                            key={`${fileId}-in-${props.column.id}-${index}-familyList`} 
                                            file={props.files[fileId]} 
                                            columnId={props.column.id}
                                            index={index}
                                            relatedArtwork={props}
                                            >
                                        </FamilyListDraggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )
                        }}
            </Droppable>
        )
}

export default DndListDroppable