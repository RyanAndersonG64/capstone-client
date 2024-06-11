import { fetchCoasters, fetchUser, fetchParks } from "./api"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "./context"

const LocationSelector = () => {

    const { auth } = useContext(AuthContext)
    const [parkData, setParkData] = useState([])
    const [parkState, setParkState] = useState([])
    
    const peruLocations = ['La Libertad', 'Lima Province']
    const brazilLocations = ['São Paulo', 'Rio De Janeiro']

    const belgiumLocations = ['Flemish Region', 'Wallonia']
    const netherlandsLocations = ['Drenthe']
    const spainLocations = ['Andalusia', 'Aragon', 'Basque Country', 'Canary Islands', 'Catalonia', 'Community of Madrid', 'Galicia', 'Navarre', 'Valencian Community']
    const turkeyLocations = ['Istanbul', 'İzmir']
    const ukLocations = ['England', 'Scotland', 'Wales', 'Northern Ireland', 'Isle of Man']

    const tanzaniaLocations = ['Dar es Salaam']

    const indiaLocations = ['Karnataka']
    const koreaLocations = ['Seoul', 'Gyeongsangnam-do']
    const japanLocations = ['Yamaguchi','Wakayama', 'Tokyo', 'Tochigi', 'Shizuoka', 'Saitama', 'Osaka', 'Ōita', 'Niigata', 'Kumamoto', 'Kanagawa', 'Hyōgo', 'Hokkaido', 'Hiroshima', 'Gunma', 'Gifu', 'Fukuoka', 'Aichi']
    const chinaLocations = ['Anhui', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hubei', 'Hunan', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Nei Mongol', 'Ningxia Hui', 'Qinghai', 'Shaanxi', 'Shandong', 'Shanxi', 'Sichuan', 'Xinjiang Uygur', 'Xizang', 'Yunnan', 'Zhejiang']

    // useEffect(
    //     () => {
    // const initialParkData = fetchParks ({ auth })
                fetchParks ({ auth })
                    .then(response => {
                        const parkJson = response.json()
                        .then(parkJson => {
                        console.log('Fetch parks Success')
                        console.log('fetch parks response 2 = ', parkJson)
                        setParkData(parkJson)
                        })
                    })
                    .catch(error => console.log('Fetch parks Failure: ', error))
    // initialParkData()
            
    //     },
    //     []
    //   )

    const updatedCountries = parkData.map(park => {
        if (peruLocations.includes(park.country)) {
            park.country = 'Peru'
            console.log(park)
        } else if (brazilLocations.includes(park.country)) {
            park.country = 'Brazil'
        } else if (belgiumLocations.includes(park.country)) {
            park.country = 'Belgium'
        } else if (netherlandsLocations.includes(park.country)) {
            park.country = 'Netherlands'
        } else if (spainLocations.includes(park.country)) {
            park.country = 'Spain'
        } else if (turkeyLocations.includes(park.country)) {
            park.country = 'Turkey'
        } else if (ukLocations.includes(park.country)) {
            park.country = 'United Kingdom'
        } else if (tanzaniaLocations.includes(park.country)) {
            park.country = 'Tanzania'
        } else if (indiaLocations.includes(park.country)) {
            park.country = 'India'
        } else if (koreaLocations.includes(park.country)) {
            park.country = 'South Korea'
        } else if (japanLocations.includes(park.country)) {
            park.country = 'Japan'
        } else if (chinaLocations.includes(park.country)) {
            park.country = 'China'
        } else if (oark.country === '') {
            park.country = park.state
        }
    })

    setParkData(updatedCountries)

    // return (

    // )

}

export default LocationSelector