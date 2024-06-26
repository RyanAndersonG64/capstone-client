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

    // const baseUrl = "http://127.0.0.1:8000"
    // const baseUrl = 'https://ryan-anderson-capstone-server-2.fly.dev'

    const baseUrl = import.meta.env.VITE_BASE_URL

    const { auth } = useContext(AuthContext)
    const { selectedPark, setSelectedPark } = useContext(ParkContext2)
    const { allCoasters, setAllCoasters } = useContext(CoasterContext)
    const { currentUser, setCurrentUser } = useContext(UserContext)

    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const storedPark = JSON.parse(localStorage.getItem('storedPark'))
    const storedCoasters = JSON.parse(localStorage.getItem('storedCoasters'))

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(
        () => {

            auth.setAccessToken(authStorage)
            setCurrentUser(storedUser)
            setSelectedPark(storedPark)
        },
        []
    )

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




    const coastersAtPark = allCoasters.filter((coaster) => coaster.park.id === selectedPark.id)

    const operatingCoasters = coastersAtPark.filter((coaster) => coaster.status.state === 'Operating')

    const defunctCoasters = coastersAtPark.filter((coaster) => coaster.status.state === 'Operated' || coaster.status.state === 'SBNO')

    const underConstruction = coastersAtPark.filter((coaster) => coaster.status.state === 'Under Construction')

    if (loading) {
        return <div><img src = 'https://http.cat/images/102.jpg'></img></div>
    }

    return (
        <div className='coaster-selector'>
            <h1> {selectedPark.name} </h1>
            {storedPark.mainPicture && <img className='park-main-picture' src={`https://rcdb.com${storedPark.mainPicture.url}`}></img>}
            <br></br>
            <h2> Operating Coasters</h2>
                <h5>Check off coasters you have ridden (or uncheck ones you checked by mistake)</h5>
            {operatingCoasters.map(coaster => {
                return (
                    <div key={coaster.id}>
                        <input type="checkbox" id={coaster.id} name={coaster.name} value={coaster.name} style={{ marginRight: 10 }}
                            checked={currentUser.coasters_ridden.includes(coaster.id) ? true : false}
                            onChange={(e) => {
                                if (e.target.checked === true) {
                                    addCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                        .then(response => {
                                            setCurrentUser(response.data)
                                            localStorage.setItem('storedUser', JSON.stringify(response.data))
                                        })
                                        .catch(error => console.log('addCredit failure: ', error))
                                } else if (e.target.checked === false) {
                                    removeCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                        .then(response => {
                                            setCurrentUser(response.data)
                                            localStorage.setItem('storedUser', JSON.stringify(response.data))
                                        })
                                        .catch(error => console.log('removeCredit failure: ', error))
                                }
                            }
                            }
                        />
                        <a className='profile-link' href='./coasterinfo' onClick={() => localStorage.setItem('coaster', JSON.stringify(coaster))}> {coaster.name} </a>
                    </div>
                )
            })}
            <br></br>
            <h2> Defunct Coasters</h2>
            {defunctCoasters.map(coaster => {
                return (
                    <div key={coaster.id}>
                        <input type="checkbox" id={coaster.id} name={coaster.name} value={coaster.name} style={{ marginRight: 10 }}
                            checked={currentUser.coasters_ridden.includes(coaster.id) ? true : false}
                            onChange={(e) => {
                                if (e.target.checked === true) {
                                    addCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                        .then(response => {
                                            setCurrentUser(response.data)
                                            localStorage.setItem('storedUser', JSON.stringify(response.data))
                                        })
                                        .catch(error => console.log('addCredit failure: ', error))
                                } else if (e.target.checked === false) {
                                    removeCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                        .then(response => {
                                            setCurrentUser(response.data)
                                            localStorage.setItem('storedUser', JSON.stringify(response.data))
                                        })
                                        .catch(error => console.log('removeCredit failure: ', error))
                                }
                            }
                            }
                        />
                        <a className='profile-link' href='./coasterinfo' onClick={() => localStorage.setItem('coaster', JSON.stringify(coaster))}> {coaster.name} </a>
                    </div>
                )
            })}
            <br></br>
            <h2> Coasters Under Construction </h2>
            {underConstruction.map(coaster => {
                return (
                    <div key={coaster.id}>
                        {/* <input type="checkbox" id = {coaster.id} name = {coaster.name} value={coaster.name} style={{ marginRight: 10}} 
                        checked = {currentUser.coasters_ridden.includes(coaster.id) ? true : false }
                            onChange={(e) => {
                                if (e.target.checked === true) {
                                        addCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                            .then(response => {
                                                setCurrentUser(response.data)
                                                localStorage.setItem('storedUser', JSON.stringify(response.data))
                                        })
                                            .catch(error => console.log('addCredit failure: ', error))
                                } else if (e.target.checked === false) {
                                    removeCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                                    .then(response => {
                                        setCurrentUser(response.data)
                                        localStorage.setItem('storedUser', JSON.stringify(response.data))
                                })
                                    .catch(error => console.log('removeCredit failure: ', error))
                                }
                            }
                        }
                        /> */}
                        <a className='profile-link' href='./coasterinfo' onClick={() => localStorage.setItem('coaster', JSON.stringify(coaster))}> {coaster.name} </a>
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