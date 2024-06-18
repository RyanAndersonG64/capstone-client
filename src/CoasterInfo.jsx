import { useState, useContext, useEffect } from "react"
import LocationSelector from "./LocationSelector"
import { AuthContext } from "./context"
import { ParkContext } from "./parkcontext"
import { ParkContext2 } from "./parkcontext2"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"
import { useNavigate } from "react-router-dom"
import { fetchParks, fetchCoasters,addCredit, removeCredit, createDataImage, getDataImages } from "./api"

const CoasterSelector = () => {

    const savedCoaster = JSON.parse(localStorage.getItem('coaster'))
    console.log(savedCoaster)
    let stats = Object.entries(savedCoaster.stats)
    let newStats = []
    for (let i in stats) {
        let newFirstLetter = stats[i][0][0].toUpperCase()
        newStats[i] = [newFirstLetter + stats[i][0].slice(1), stats[i][1]]
        newStats[i][0] = newStats[i][0].replace(/([a-z])([A-Z])/g, '$1 $2')
    }
    stats = newStats
    console.log(stats)
    console.log(savedCoaster)
    return (
        <div className="coaster-info-panel">
            <h1> {savedCoaster.name} </h1>
            <h3> {savedCoaster.park.name} </h3>
            <h6> {savedCoaster.city}, {savedCoaster.state}, {savedCoaster.country} </h6>
            { <img className = 'coaster-info-image' src={`${savedCoaster.mainPicture.url}`}></img>}
            <div> 
                Status: {savedCoaster.status.state} 
                <br></br> 
                Type: {savedCoaster.type}
                <br></br>
                Manufacturer: {savedCoaster.make}
            </div>

            {stats.slice(0, 7).map(stat => 
            <div key = {stats.indexOf(stat)} className="coasterStat">
                {`${stat[0]} : `} {stat[1]}
            </div>
            )}
            <a href = {`https://rcdb.com/${savedCoaster.link}`}> RCDB Link </a>
            <br></br><br></br>
            <h2> Images </h2>
            <br></br><br></br>
            <div className="coaster-images-container">
                {savedCoaster.pictures.map(picture => (
                    <div className="coaster-image-wrapper" key={picture.id}>
                        <img className="coaster-images" src={`${picture.url}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CoasterSelector