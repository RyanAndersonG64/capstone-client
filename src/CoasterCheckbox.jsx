import { useContext, useEffect } from "react"
import { AuthContext } from "./contexts/context.jsx"
import { DataContext } from "./contexts/DataContext"
import { addCredit, removeCredit } from './api/coasterApi'
import { useLocalStorage } from "./hooks/useLocalStorage.js"

const CoasterCheckbox = ({coaster}) => {

    const { auth } = useContext(AuthContext)
    const { allCoasters, setAllCoasters, currentUser, setCurrentUser } = useContext(DataContext)

    const [storedUser, setStoredUser] = useLocalStorage('storedUser', null)
    const [storedPark] = useLocalStorage('storedPark', null)
    const [storedCoasters] = useLocalStorage('storedCoasters', null)
    const [, setCoaster] = useLocalStorage('coaster', null)

    return (
        <div key={coaster.id}>
            <input type="checkbox" id={coaster.id} name={coaster.name} value={coaster.name} style={{ marginRight: 10 }}
                checked={currentUser.coasters_ridden.includes(coaster.id) ? true : false}
                onChange={(e) => {
                    if (e.target.checked === true) {
                        addCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                            .then(response => {
                                setCurrentUser(response.data)
                                setStoredUser(response.data)
                            })
                    } else if (e.target.checked === false) {
                        removeCredit({ auth, userId: currentUser.id, coasterId: coaster.id })
                            .then(response => {
                                setCurrentUser(response.data)
                                setStoredUser(response.data)
                            })
                    }
                }
                }
            />
            <a className='profile-link' href='./coasterinfo' onClick={() => setCoaster(coaster)}> {coaster.name} </a>
        </div>
    )
}

export default CoasterCheckbox