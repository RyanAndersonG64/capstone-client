import { fetchCoasters, fetchUser } from "./api"
import { AuthContext } from "./context"
import { useContext } from "react"


function App() {
  const { auth } = useContext(AuthContext)
  fetchUser({ auth })
        .then(response => {
            console.log('fetchUser response: ', response.data.first_name)
            setUserId(response.data.id)
        })
  fetchCoasters ({ auth })
    .then(response => {
      console.log(response.json())
    })
    .catch(error => console.log('fetch coasters error: ', error))
  return (

    <div className="p-5">
      poogers

    </div>
  )
}

export default App
