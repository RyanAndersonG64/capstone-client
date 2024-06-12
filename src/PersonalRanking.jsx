import { useState, useContext, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { fetchParks, fetchCoasters, setFavorite } from "./api"

import { AuthContext } from "./context"
import { ParkContext2 } from "./parkcontext2"
import { CoasterContext } from "./coasterContext"
import { UserContext } from "./usercontext"

import Profile from "./Profile"

const PersonalRanking = () => {
    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const {allCoasters, setAllCoasters} = useContext(CoasterContext)
    
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))
    const authStorage = localStorage.getItem('authStorage')
    const storedCoasters = JSON.parse(localStorage.getItem('storedCoasters'))
    const [coasterState, setCoasterState] = useState([])
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [editable, setEditable] = useState(false)
    const [buttonText, setButtonText] = useState(numbers.map(() => 'Change'))
    const [inputValue, setInputValue] = useState('')

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

    useEffect (
        () => {

              auth.setAccessToken(authStorage)
              setCurrentUser(storedUser)
                
              fetchCoasters ({ auth })
              .then(response => {
                const coasterJson = response.json()
                .then(coasterJson => {
                  setAllCoasters(coasterJson.filter((coaster) => currentUser.coasters_ridden.includes(coaster.id)))
                  setCoasterState(coasterJson.filter((coaster) => currentUser.coasters_ridden.includes(coaster.id)))
                })
              })
        },
        []
      )

    useEffect (
        () => {
            if (!auth.accessToken) {
            navigate('/')
          }
        },
        []
      )
    
      console.log(currentUser.favorites)
    return (
        <div className = 'personalRanking'>
            <br></br>
            <h1> {currentUser.first_name} {currentUser.last_name}'s Top 10 </h1>
            <Link style={{ marginRight: 20 }} to='/Profile'>All Coasters Ridden</Link>
            <br></br><br></br>
            {numbers.map((number) => {
                return (
                <div key = {number}>
                    <span className="rankingNumber">{number}</span>
                        <input type="text" key = {number} name={'number' + number} readOnly = {!editable} defaultValue={currentUser.favorites[number-1]}
                            onChange={(e) => {
                            setCoasterState(allCoasters.filter((coaster) => coaster.name.includes(e.target.value)))
                            setInputValue(e.target.value)
                            }
                    }
                    >
                    </input>
                    <button style={{marginLeft: 10}} id= {number} value = 'Change'
                        onClick = {(e) => {
                            console.log(buttonText[number])
                            setEditable(!editable)
                            changeButtonText(number-1)
                            if (buttonText[number-1] === 'Set') {
                                setCoasterState(allCoasters)
                                let coasterNames = allCoasters.map(coaster => coaster.name)
                                if (coasterNames.includes(inputValue)) {
                                    setFavorite ({ auth, id: currentUser.id, coaster: inputValue, rank: number })
                                } else {
                                    alert('You have not ridden a coaster with that name. Note that name entries are case-sensitive')
                                }
                            }
                        }
                        }
                    > 
                        {buttonText[number-1]}
                    </button>
                </div>
            )})}


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

export default PersonalRanking
               