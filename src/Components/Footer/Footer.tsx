import React from 'react';
import { Navbar, NavbarBrand, Container } from 'reactstrap';
import RsSchoolSvg from "../../Assets/images/rs_school_js.svg"
import styles from  "./Footer.module.scss"

export const Footer = () => {

    return (
        <div className="fixed-bottom">  
            <Navbar color="dark" dark>
                <Container>
                    <a href="https://rs.school/react/">
                        <img className={styles.svgImage} src={RsSchoolSvg}/>
                    </a>
                    <span className={styles.yearValue}>2021</span>
                    <a href="https://github.com/MrBlacky01">Dmitry M</a>
                </Container>
            </Navbar>
        </div>
    );
}