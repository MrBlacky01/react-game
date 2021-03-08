import React from 'react';
import styles from  "./Slider.module.scss"

interface SlidrerProps {
    value: number;
    onChange: (value: number) => void;
};

export const Slidrer: React.FC<SlidrerProps> = (props: SlidrerProps) => {

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(props.onChange){
            props.onChange(Number(event.target.value));
        }
    }
    return (
        <div className={styles.slideContainer}>
            <input type="range" min="1" max="100" value={props.value} onChange={handleOnChange} className={styles.slider}/>
        </div>
    );
}