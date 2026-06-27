import { useState, useContext, useEffect } from "react"
import LocationSelector from "./LocationSelector"
import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"
import { useNavigate } from "react-router-dom"
import { fetchParks, fetchCoasters, addCredit, removeCredit, createDataImage, getDataImages } from './api/coasterApi'
import { useLocalStorage } from "./hooks/useLocalStorage.js"
import CoasterCheckbox from "./CoasterCheckbox.jsx"

const CoasterSelector = () => {

    const baseUrl = import.meta.env.VITE_BASE_URL

    const { auth } = useContext(AuthContext)
    const { allCoasters, setAllCoasters, currentUser, setCurrentUser } = useContext(DataContext)

    const [storedUser, setStoredUser] = useLocalStorage('storedUser', null)
    const [storedPark] = useLocalStorage('storedPark', null)
    const [storedCoasters] = useLocalStorage('storedCoasters', null)
    const [coaster, setCoaster] = useLocalStorage('coaster', null)

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(
        () => {
            if (auth.accessToken) {
                fetchCoasters({ auth })
                    .then(response => {
                        const coasterJson = response.json()
                            .then(coasterJson => {
                                setAllCoasters(coasterJson)
                                setLoading(false)
                            })
                    })
            }
            else {
                navigate('/')
            }
        },
        []
    )




    if (loading || !storedPark) {
        return <div><img src = 'https://http.cat/images/102.jpg'></img></div>
    }

    const coastersAtPark = allCoasters.filter((coaster) => coaster.park?.id === storedPark.id)

    const operatingCoasters = coastersAtPark.filter((coaster) => coaster.status.state === 'Operating')

    const defunctCoasters = coastersAtPark.filter((coaster) => coaster.status.state === 'Operated' || coaster.status.state === 'SBNO')

    const underConstruction = coastersAtPark.filter((coaster) => coaster.status.state === 'Under Construction')

    return (
        <div className='coaster-selector'>
            <h1> {storedPark.name} </h1>
            {storedPark.mainPicture && <img className='park-main-picture' src={`https://rcdb.com${storedPark.mainPicture.url}`}></img>}
            <br></br>
            <h2> Operating Coasters</h2>
                <h5>Check off coasters you have ridden (or uncheck ones you checked by mistake)</h5>
            {operatingCoasters.map(coaster => {
                return (
                    <CoasterCheckbox key={coaster.id} coaster={coaster} />
                )
            })}
            <br></br>
            <h2> Defunct Coasters</h2>
            {defunctCoasters.map(coaster => {
                return (
                    <CoasterCheckbox key={coaster.id} coaster={coaster} />
                )
            })}
            <br></br>
            <h2> Coasters Under Construction </h2>
            {underConstruction.map(coaster => {
                return (
                    <div key={coaster.id}>
                        <a className='profile-link' href='./coasterinfo' onClick={() => setCoaster(coaster)}> {coaster.name} </a>
                    </div>
                )
            })}
            <br></br>
            <h2> Images </h2>
            <div className='coaster-images-container container-fluid'>
                {storedPark.pictures.map(picture => (
                    <div className="coaster-image-wrapper sm-2 lg-6" key={picture.id}>
                        <img className="coaster-images" src={`https://rcdb.com${picture.url}`} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CoasterSelector