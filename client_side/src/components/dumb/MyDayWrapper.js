import React from 'react';

const MyDayWrapper = isPast => {
    console.log("here, MyDayWrapper")
    return props => (
        <div className={ isPast ? "inPast" : "" } style={{
            background: "black"
        }}>
        ggggg
        { props.children }
       </div>
      )
}

export default MyDayWrapper;