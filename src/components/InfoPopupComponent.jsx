import React from 'react';
import './style/InfoPopup.css';

function InfoPopup(props) {
    return (props.trigger)?(
        <div className="popup">
          <div className="popup-inner">
          <button type="button" className="close-btn" onClick={() => props.setTrigger(false)}>X</button>
            <div dangerouslySetInnerHTML={{__html: props.children}}></div>
          </div>
        </div>
    ): "";
}

export default InfoPopup;