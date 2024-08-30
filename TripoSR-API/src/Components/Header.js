import Logo from './logo.png'

function Header() {
    const Styles ={

        height:"3px",
        borderWidth:"10",
        backgroundColor:"gray",
    }

    return(
        <div className='Headdesign'>
            <img className='LogoDesign' src={Logo} alt="Lid Vizion Logo"></img>
            <h1 className='TitleDesign'>LID VIZION </h1>
            <p className='SubTitleDesign'>TripoSR & Dream Fusion Virtual Run Space</p>
            <nav>
                <ul className='MenuDesign'>
                    <ul><a href="https://www.lidvizion.com/">LidVizion</a></ul>
                    <ul><a href="https://www.playdigidash.io/">Digi Dash</a></ul>
                    {/* <ul><a href="#">3D Object Run Spaces</a></ul> */}
                    <ul><a href="https://www.lidvizion.com/about-us/">About Us</a></ul>
                    <ul><a href="https://www.lidvizion.com/contact/">Contact</a></ul>

                </ul>
            </nav>
            <br></br>
            <br></br>
            <hr style={Styles}></hr>
        </div>
    )
}

export default Header