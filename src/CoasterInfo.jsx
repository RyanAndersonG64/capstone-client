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
    console.log(stats)

    const fillArray = (arr) => {
        console.log('fillArray arr: ', arr)
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === '') {
                    arr[i] = arr[i - 1]
                }
            }
        }
        return arr
    }

    const formatStat = (label, value, unit) => {
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (value[i] === '') {
                    value[i] = value[i - 1]
                }
            }
            return value.map((v, i) => (
                <div className="multi-stat" key={`${label}-${i}`}>
                    {`${i === 0 ? label + ':' : ''} Track ${i + 1}: ${Math.round(v * (unit === "ft" ? 3.28 : 1))}${unit ? ' ' : ''}${unit}${i < value.length - 1 ? ',' : ''}`}
                </div>
            ));
        }
        return (
            <div className="coasterStat">
                {label}: {Math.round(value * (unit === "ft" ? 3.28 : 1))} {unit}
            </div>
        );
    };

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

                <br></br>
                <br></br>

                {imperialStats ? (
                    <div>
                        {savedCoaster.status.state && <div className="coasterStat">Status: {savedCoaster.status.state}</div>}
                        {savedCoaster.type && <div className="coasterStat">Type: {savedCoaster.type}</div>}
                        {savedCoaster.make && <div className="coasterStat">Manufacturer: {savedCoaster.make}</div>}

                        <div className="coasterStat">{savedCoaster.stats.length && formatStat("Length", savedCoaster.stats.length, "ft")}</div>

                        <div className="coasterStat">{savedCoaster.stats.height && formatStat('Height', savedCoaster.stats.height, 'ft')}</div>

                        <div className="coasterStat">{savedCoaster.stats.drop && formatStat('Highest Drop', savedCoaster.stats.drop, 'ft')}</div>

                        {fillArray(savedCoaster.stats.speed) && (
                            <div className="coasterStat">
                                Max Speed:{" "}
                                {Array.isArray(savedCoaster.stats.speed)
                                    ? savedCoaster.stats.speed.map((s, i) => (
                                        <div className="multi-stat" key={`speed-${i}`}>Track {i + 1}: {Math.round(s / 1.60934)} mph{i < savedCoaster.stats.speed.length - 1 ? ',' : ''} </div>
                                    ))
                                    : `${Math.round(savedCoaster.stats.speed / 1.60934)} mph`}
                            </div>
                        )}
                        <div className="coasterStat">{savedCoaster.stats.inversions && formatStat('Inversions', savedCoaster.stats.inversions, '')}</div>

                        <div className="coasterStat">{savedCoaster.stats.verticalAngle && formatStat('Max Vertical Angle', savedCoaster.stats.verticalAngle, '°')}</div>

                        {fillArray(savedCoaster.stats.duration) && (
                            <div className="coasterStat">
                                Duration:{" "}
                                {Array.isArray(savedCoaster.stats.duration)
                                    ? savedCoaster.stats.duration.map((s, i) => (
                                        <div className="multi-stat" key={`duration-${i}`}>Track {i + 1}: {s}{i < savedCoaster.stats.speed.length - 1 ? ',' : ''} </div>
                                    ))
                                    : savedCoaster.stats.duration}
                            </div>
                        )}
                    </div>


                ) : (
                    <div>
                        {savedCoaster.status.state && <div className="coasterStat">Status: {savedCoaster.status.state}</div>}
                        {savedCoaster.type && <div className="coasterStat">Type: {savedCoaster.type}</div>}
                        {savedCoaster.make && <div className="coasterStat">Manufacturer: {savedCoaster.make}</div>}

                        <div className="coasterStat">{savedCoaster.stats.length && formatStat("Length", savedCoaster.stats.length, "m")}</div>

                        <div className="coasterStat">{savedCoaster.stats.height && formatStat('Height', savedCoaster.stats.height, 'm')}</div>

                        <div className="coasterStat">{savedCoaster.stats.drop && formatStat('Highest Drop', savedCoaster.stats.drop, 'm')}</div>

                        <div className="coasterStat">
                            {fillArray(savedCoaster.stats.speed) && (
                                <div className="multi-stat">
                                    Max Speed:{" "}
                                    {Array.isArray(savedCoaster.stats.speed)
                                        ? savedCoaster.stats.speed.map((s, i) => (
                                            <div className="multi-stat" key={`speed-${i}`}>Track {i + 1}: {s} km/h{i < savedCoaster.stats.speed.length - 1 ? ',' : ''} </div>
                                        ))
                                        : `${savedCoaster.stats.speed} mph`}
                                </div>
                            )}
                        </div>
                        <div className="coasterStat">{savedCoaster.stats.inversions && formatStat('Inversions', savedCoaster.stats.inversions, '')}</div>

                        <div className="coasterStat">{savedCoaster.stats.verticalAngle && formatStat('Max Vertical Angle', savedCoaster.stats.verticalAngle, '°')}</div>

                        {fillArray(savedCoaster.stats.duration) && (
                            <div className="coasterStat">
                                Duration:{" "}
                                {Array.isArray(savedCoaster.stats.duration)
                                    ? savedCoaster.stats.duration.map((s, i) => (
                                        <div className="multi-stat" key={`duration-${i}`}>Track {i + 1}: {s}{i < savedCoaster.stats.speed.length - 1 ? ',' : ''} </div>
                                    ))
                                    : savedCoaster.stats.duration}
                            </div>
                        )}
                    </div>
                )}
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