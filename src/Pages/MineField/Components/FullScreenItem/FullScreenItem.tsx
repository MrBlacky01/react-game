import React from 'react';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./FullScreenItem.module.scss";

interface MyHTMLElement extends HTMLElement {
    mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;
    webkitRequestFullscreen(options?: FullscreenOptions): Promise<void>;
    msRequestFullscreen(options?: FullscreenOptions): Promise<void>;
}

export class FullScreenItem extends React.Component{

    
    _handleFullScreen = () =>{
        this._activateFullscreen(document.body as MyHTMLElement);
    }

    private _activateFullscreen(element: MyHTMLElement) {
        if(element.requestFullscreen) {
          element.requestFullscreen();        // W3C spec
        }
        else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();     // Firefox
        }
        else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();  // Safari
        }
        else if(element.msRequestFullscreen) {
          element.msRequestFullscreen();      // IE/Edge
        }
    }

    render(){
        return(
            <FontAwesomeIcon className={styles.icon} onClick={this._handleFullScreen} icon={faExpandArrowsAlt}/>
        );
    }
}