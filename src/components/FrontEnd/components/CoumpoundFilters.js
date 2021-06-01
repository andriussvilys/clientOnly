import React from 'react'

const CompoundFilters = props => {
    return(<div>
        <label htmlFor="compoundFilters">Coumpount Filters</label>
        <input 
        type="checkbox" 
        id="compoundFilters" 
        onChange={() => props.context.compoundFilters()}
        checked={props.context.state.compoundFilters}
        />
    </div>)
}

export default CompoundFilters