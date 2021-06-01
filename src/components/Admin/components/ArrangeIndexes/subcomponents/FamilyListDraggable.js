import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import FilePreview from '../../FilePreview'

const DnDListDraggable = (props) => {
    if(!props.file){
        return null
    }
    return(
        <Draggable
        draggableId={props.file.fileName} 
        index={props.index}
        >
        {(provided)=>{
            return(
                <div className="draggable-container"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >  

                        <div
                            {...provided.dragHandleProps}
                            onMouseDown={(e)=>{
                                const dragHandle = e.target
                                if(!e.target.classList.contains('mouseDown')){
                                    e.target.classList.add('mouseDown')
                                }
                                provided.dragHandleProps.onMouseDown(e)

                                document.addEventListener('mouseup', () => {dragHandle.classList.remove('mouseDown')})
                                }
                            }
                        >
                            <div className="image-index-box">
                                <FilePreview 
                                    file={props.file}
                                />
                                <div className="draggable--index">
                                    <div>
                                        { props.relatedArtwork.column.fileIds.indexOf(props.file.fileName) }
                                    </div>
                                </div>
                            </div>
                        </div>


                        
                            
                        {/* <div className="button-container">
                                <div 
                                // className="draggable--dragHandle custom-button"
                                // id={`draghandle--${props.index}`}
                                {...provided.dragHandleProps}
                                onMouseDown={(e)=>{
                                    const dragHandle = e.target
                                    if(!e.target.classList.contains('mouseDown')){
                                        e.target.classList.add('mouseDown')
                                    }
                                    provided.dragHandleProps.onMouseDown(e)

                                    document.addEventListener('mouseup', () => {dragHandle.classList.remove('mouseDown')})
                                    }
                                }
                                >
                                    DRAG
                                </div>   
                        </div> */}

                
                </div>
            )
        }}
    </Draggable>
    )
}

export default DnDListDraggable