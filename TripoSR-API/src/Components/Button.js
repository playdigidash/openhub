function Button(){

    const handleClick = (e) =>e.target.textContent = "Please Wait Your 3D Object is Being Generated";
    return(<button className="Button" onClick={(e) => handleClick(e)} >Generate 3D Objects 🌟</button>);   

}

export default Button