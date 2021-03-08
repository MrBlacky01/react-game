import React from 'react';
import styles from "./Timer.module.scss"

interface TimerProps {
    timeStart: number;
    shouldStart: boolean;
    shouldFinish: boolean;
    onTick: (time: number) => void;
}

interface TimerState {
    running: boolean;
    currentTime: number;
}

export class Timer extends React.Component<TimerProps, TimerState>{

    private _watch: null | ReturnType<typeof setInterval>;
    constructor(props: TimerProps){
        super(props);
        this.state = {
            running: false,
            currentTime: props.timeStart
        };
    }

    componentDidUpdate(prevProps: TimerProps){
        if(prevProps.shouldStart != this.props.shouldStart && this.props.shouldStart){
            this.start();
        }
        
        if(prevProps.shouldFinish != this.props.shouldFinish && this.props.shouldFinish){
            this.stop();
        }
    }

    start = () => {
        if (!this.state.running) {
            this.setState({ running: true, currentTime: this.props.timeStart });
            this._watch = setInterval(() => {
                this.step();
            }, 1000);
        }
    };
    
    stop = () => {
        this.setState({ running: false });
        clearInterval(this._watch);
    };

    reset = () => {
        this.setState({
          currentTime: 0,
        });
    };

    step = () => {
        this.setState({ currentTime: this.state.currentTime + 1 },
        () =>{
            if(this.props.onTick){
                this.props.onTick(this.state.currentTime)
            }
        });
    };

    render() {
        const {running,currentTime} = this.state;
        return (
          <>
            {currentTime}
          </>
        );
      }
}