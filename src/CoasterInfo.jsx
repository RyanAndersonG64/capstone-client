import { useState, useContext, useEffect } from "react"
import LocationSelector from "./LocationSelector"
import { AuthContext } from "./context"
import { ParkContext } from "./parkcontext"
import { ParkContext2 } from "./parkcontext2"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"
import { useNavigate } from "react-router-dom"
import { fetchParks, fetchCoasters, addCredit, removeCredit, createDataImage, getDataImages } from "./api"

const CoasterSelector = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(UserContext)

    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const savedCoaster = JSON.parse(localStorage.getItem('coaster'))

    const [imperialStats, setImperialStats] = useState(true)

    useEffect(
        () => {

            auth.setAccessToken(authStorage)
            setCurrentUser(storedUser)
        },
        []
    )

    let stats = Object.entries(savedCoaster.stats)
    let newStats = []

    for (let i in stats) {
        let newFirstLetter = stats[i][0][0].toUpperCase()
        newStats[i] = [newFirstLetter + stats[i][0].slice(1), stats[i][1]]
        newStats[i][0] = newStats[i][0].replace(/([a-z])([A-Z])/g, '$1 $2')
    }
    stats = newStats

    return (
        <div className="coaster-info-panel">
            <h1> {savedCoaster.name} </h1>
            <h3> <a className='profile-link' href='/coasterselector'>{savedCoaster.park.name}</a> </h3>
            <h6> {savedCoaster.city}, {savedCoaster.state}, {savedCoaster.country} </h6>
            {savedCoaster.mainPicture.url && <img className='coaster-info-image' src={`${savedCoaster.mainPicture.url}`}></img>}
            <div>

                <label htmlFor="stat-types">Measurements: &nbsp;</label>
                <select id="stayType" name="statType" onChange={(e) => {
                    console.log(e.target.value)
                    if (e.target.value === 'Imperial') {
                        setImperialStats(true)
                    } else if (e.target.value === 'Metric') {
                        setImperialStats(false)
                    } else {
                        setImperialStats(true)
                    }
                }
                }
                >
                    <option value='Imperial'>Imperial</option>
                    <option value='Metric'>Metric</option>

                </select>

                <br></br><br></br>

                {imperialStats == true &&
                <div>
                    {savedCoaster.status.state && <div className="coasterStat">Status: {savedCoaster.status.state}</div>}
                    {savedCoaster.type && <div className="coasterStat">Type: {savedCoaster.type}</div>}
                    {savedCoaster.make && <div className="coasterStat">Manufacturer: {savedCoaster.make}</div>}
                    {savedCoaster.stats.length && <div className="coasterStat"> Length: {Math.round(savedCoaster.stats.length * 3.28)} ft</div>}
                    {savedCoaster.stats.height && <div className="coasterStat"> Height: {Math.round(savedCoaster.stats.height * 3.28)} ft</div>}
                    {savedCoaster.stats.drop && <div className="coasterStat"> Highest Drop: {Math.round(savedCoaster.stats.drop * 3.28)} ft</div>}
                    {savedCoaster.stats.speed && <div className="coasterStat"> Max Speed: {Math.round(savedCoaster.stats.speed / 1.60934)} mph</div>}
                    {savedCoaster.stats.inversions && <div className="coasterStat"> Inversions: {savedCoaster.stats.inversions} </div>}
                    {savedCoaster.stats.verticalAngle && <div className="coasterStat"> Max Vertical Angle: {savedCoaster.stats.verticalAngle}° </div>}
                    {savedCoaster.stats.duration && <div className="coasterStat"> Duration: {savedCoaster.stats.duration} </div>}
                </div>
                }

                {imperialStats == false &&
                <div>
                    {savedCoaster.status.state && <div className="coasterStat">Status: {savedCoaster.status.state}</div>}
                    {savedCoaster.type && <div className="coasterStat">Type: {savedCoaster.type}</div>}
                    {savedCoaster.make && <div className="coasterStat">Manufacturer: {savedCoaster.make}</div>}
                    {savedCoaster.stats.length && <div className="coasterStat"> Length: {Math.round(savedCoaster.stats.length)} m</div>}
                    {savedCoaster.stats.height && <div className="coasterStat"> Height: {Math.round(savedCoaster.stats.height)} m</div>}
                    {savedCoaster.stats.drop && <div className="coasterStat"> Highest Drop: {Math.round(savedCoaster.stats.drop)} m</div>}
                    {savedCoaster.stats.speed && <div className="coasterStat"> Max Speed: {Math.round(savedCoaster.stats.speed)} km/h</div>}
                    {savedCoaster.stats.inversions && <div className="coasterStat"> Inversions: {savedCoaster.stats.inversions} </div>}
                    {savedCoaster.stats.verticalAngle && <div className="coasterStat"> Max Vertical Angle: {savedCoaster.stats.verticalAngle}° </div>}
                    {savedCoaster.stats.duration && <div className="coasterStat"> Duration: {savedCoaster.stats.duration} </div>}
                </div>
                }
            </div>

            <a href={`https://rcdb.com/${savedCoaster.link}`}> RCDB Link </a>
            <br></br><br></br>
            <h2> Images </h2>
            <br></br><br></br>
            <div className="coaster-images-container">
                {savedCoaster.pictures.map(picture => (
                    <div className="coaster-image-wrapper" key={picture.id}>
                        <a href={`${picture.url}`} >
                            <img className="coaster-images"
                                src={`${picture.url}`}
                            />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CoasterSelector