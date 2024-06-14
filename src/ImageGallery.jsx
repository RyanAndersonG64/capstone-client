import { useContext, useEffect } from "react"
import { useState } from "react"
import { AuthContext } from './context'
import { UserContext } from "./usercontext"


import { getImages, deleteImage, createImage, likeImage } from './api'

const ImageGallery = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)

    const authStorage = localStorage.getItem('authStorage')
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))

    const [allImages, setAllImages] = useState([])
    const [imageState, setImageState] = useState([])

    const [image, setImage] = useState(undefined)
    const [title, setTitle] = useState('')


    useEffect (
        () => {

              auth.setAccessToken(authStorage)
              setCurrentUser(storedUser)
                
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

    useEffect (
        () => {
            if (auth.accessToken) {
                getImages({ auth })
                    .then(response => {
                        setImageState(response.data)
                        setAllImages(response.data)
                        console.log(response.data)
                    })
                    .catch(error => console.log('Get Images Failure: ', error))
            }
        },
        [auth.accessToken]
    )

    const submit = () => {

            let poster = currentUser.id
                createImage ({ auth, title, postedBy: poster, image })
                .then(response => { 
                    console.log('response from createImage: ', response)
                    getImages({ auth })
                    .then(res => {
                        console.log('res from getImages: ', res)
                        setImageState(res.data)}) 
                })
                .catch(error => console.log('Create Image failure: ', error))
    }
    console.log(imageState)
    return (
        <div className="p-5">

            {/* -- Create images -- */}

            <div>
            <h1>Upload an Image</h1>
            <h2>Image Title</h2>
            <input
                onChange = {e =>setTitle(e.target.value)}
                value = {title}
            />
            <br></br>
            <div>
                <input 
                    accept='image/*'
                    type='file'
                    onChange={e => setImage(e.target.files[0])}
                />
            </div>
            <div>
                <button onClick={() => submit()}>
                    Submit

                </button>
            </div>
        </div>
            
            {/* -- Display images -- */}

            <hr />
            <h1>Image Gallery</h1>
            <label htmlFor="imageFilter">Sort images by:</label>
            <select id="imageTypes" name="imageTypes" onChange = {(e) => {
                console.log(e.target.value)
                if (e.target.value === 'All Images') {
                    getImages({ auth })
                    .then(response => {
                        setImageState(response.data)
                    })
                    .catch(error => console.log('Get Images Failure: ', error))
                } else if (e.target.value === 'Your Images') {
                    getImages({ auth })
                    .then(response => {
                        setImageState(response.data.filter((image) => image.posted_by === currentUser.id))
                    })
                    .catch(error => console.log('Get Images Failure: ', error))
                } else if (e.target.value === 'Liked Images') {
                    getImages({ auth })
                    .then(response => {
                        setImageState(response.data.filter((image) => image.liked_by.includes(currentUser.id)))
                    })
                    .catch(error => console.log('Get Images Failure: ', error))
                } else {
                    setImageState(allImages)
                }
                    }
                }
                >
            <option value = 'All Images'>All Images</option>
            <option value = 'Your Images'>Your Images</option>
            <option value = 'Liked Images'>Liked Images</option>

            </select>

            {ImageGallery && imageState.map(image => (
                <div key={image.id}>
                    <h3>{image.title}</h3>
                    <div>
                        <img src={`http://127.0.0.1:8000/${image.image}`}
                        style = {{width: '50%'}}
                        />
                    </div>
                    <br></br>
                    <button onClick = {() => {
                        console.log('Like has been pressed')
                        likeImage ({ auth, currentUser: currentUser.id, image: image.id, likes: image.likes }) 
                        .then(response => { 
                            getImages({ auth })
                            .then(res => {
                                console.log('res from likeImage: ', res)
                                setImageState(res.data)}) 
                        })  
                        
                     }}>
                        Like
                    </button>

                    <button style={{ marginLeft: 20 }} onClick = {() => {
                        if (image.posted_by === currentUser.id) {
                            console.log('Delete has been pressed')
                            deleteImage ({ auth, imageId : image.id }) 
                            .then(response => { 
                                getImages({ auth })
                                .then(res => {
                                    console.log('res from getImages: ', res)
                                    setImageState(res.data)}) 
                            })  
                        } else {
                            alert("You can't delete someone else's image")
                        }
                    }}>
                        Delete
                    </button>
                    
                    <h6> Likes: {image.likes} </h6>

                    <br></br>
                    <h6> Posted by {image.poster_name} at {image.created_at} </h6>
                    <hr />
                </div>
            ))}
        </div>
    )

}

export default ImageGallery