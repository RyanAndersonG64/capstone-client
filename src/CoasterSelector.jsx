import { useState, useContext } from "react"
import LocationSelector from "./LocationSelector"

const CoasterSelector = () => {

    const { auth } = useContext(AuthContext)
    const {allParks, setAllParks} = useContext(ParkContext)
    const {allCoasters, setAllCoasters} = useContext(ParkContext)

}

export default CoasterSelector