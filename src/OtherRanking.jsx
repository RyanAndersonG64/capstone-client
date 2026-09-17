import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchAllUsers } from './api/authApi'
import { fetchParks, fetchCoasters, setFavorite } from './api/coasterApi'

import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"
import { UIContext } from "./contexts/UIContext"
import { useError } from './hooks/useError'


const OtherRanking = () => {
    const { auth } = useContext(AuthContext)
    const { setError } = useError()
    const { currentUser, allCoasters, setAllCoasters } = useContext(DataContext)
    const { profileView } = useContext(UIContext)

    const [coasterState, setCoasterState] = useState([])
    const [allUsers, setAllUsers] = useState([])

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [editable, setEditable] = useState(false)
    const [buttonText, setButtonText] = useState(numbers.map(() => 'Change'))
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(true)

    const changeButtonText = (index) => {
        const newButtonText = [...buttonText]
        if (buttonText[index] === 'Change') {
            newButtonText[index] = 'Set'
        } else if (buttonText[index] === 'Set') {
            newButtonText[index] = 'Change'
        }
        setButtonText(newButtonText)
    }

    const navigate = useNavigate()

    useEffect(
        () => {
            fetchAllUsers({ auth })
                .then(response => {
                    setAllUsers(response.data)
                    const userBeingViewed = response.data.find(user => user.id === profileView)
                    if (!userBeingViewed) {
                        setLoading(false)
                        return
                    }
                    return fetchCoasters({ auth })
                        .then(response => response.json())
                        .then(coasterJson => {
                            const ridden = coasterJson.filter((coaster) => userBeingViewed.coasters_ridden.includes(coaster.id))
                            setAllCoasters(ridden)
                            setCoasterState(ridden)
                            setLoading(false)
                        })
                })
                .catch(() => {
                    setError('Error loading rankings')
                    setLoading(false)
                })
        },
        []
    )

    useEffect(
        () => {
            if (!auth.accessToken) {
                navigate('/')
            }
        },
        []
    )



    function getUserFromId(inputId) {
        return allUsers.find(user => user.id === inputId)
    }


    const userBeingViewed = getUserFromId(profileView)

    if (loading) {
        return <div><img src='https://http.cat/images/102.jpg'></img></div>
    }

    if (!userBeingViewed) {
        return (
            <div className="p-5">
                <br></br>
                <h1> No profile selected. </h1>
            </div>
        )
    } else if (userBeingViewed.profile_view_state === 'FRIENDS ONLY' && !userBeingViewed.friends.includes(currentUser.id)) {
        return (
            <div className="p-5">
                <br></br>
                <h1> This user&apos;s profile can only be viewed by their friends. </h1>
            </div>
        )
    } else if (userBeingViewed.profile_view_state === 'PRIVATE') {
        return (
            <div className="p-5">
                <br></br>
                <h1> This user&apos;s profile is private. </h1>
            </div>
        )
    } else {
        return (
            <div className='other-ranking'>
                <br></br>
                <h1> {userBeingViewed.first_name} {userBeingViewed.last_name}&apos;s Top 10 </h1>
                <Link style={{ marginRight: 20 }} to='/otherprofile'>All Coasters Ridden</Link>
                <br></br><br></br>
                {numbers.map((number) => {
                    return (
                        <div key={number}>
                            <span className="rankingNumber">{number}</span>
                            <input type="text" key={number} name={'number' + number} readOnly={!editable} defaultValue={userBeingViewed.favorites[number - 1]}
                                onChange={(e) => {
                                    setCoasterState(allCoasters.filter((coaster) => coaster.name.includes(e.target.value)))
                                    setInputValue(e.target.value)
                                }
                                }
                            >
                            </input>
                        </div>
                    )
                })}


                <br></br>
                {coasterState.map(coaster =>
                    <div key={coaster.id}>
                        <p> {coaster.name}, {coaster.park.name} </p>
                    </div>
                )
                }
            </div>
        )
    }
}

export default OtherRanking