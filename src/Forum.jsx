import { useContext, useEffect } from "react"
import { useState } from "react"
import { AuthContext } from './context'
import { getPosts, deletePost, editPost, fetchUser, addPost, likePost } from './api'

import { AuthContext } from "./context"
import { UserContext } from "./usercontext"
import { PostContext } from "./postcontext"

const Forum = () => {

    const { auth } = useContext(AuthContext)
    const {currentUser, setCurrentUser} = useContext(UserContext)

    const authStorage = localStorage.getItem('authStorage')
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))

    const [allPosts, setAllPosts] = useState([])
    const {postState, setPostState} = useContext([])

    const [title, setTitle] = useState('')
    const [textContent, setTextContent] = useState('')

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
                getPosts({ auth })
                    .then(response => {
                        setPostState(response.data)
                        setAllPosts(response.data)
                    })
                    .catch(error => console.log('Get Posts Failure: ', error))
            }
        },
        [auth.accessToken]
    )

    const submit = () => {

            let poster = currentUser.id
                addPost ({ auth, title, postedBy: poster, textContent })
                .then(response => { 
                    console.log('response from AddPost: ', response)
                    getPosts({ auth })
                    .then(res => {
                        console.log('res from getPosts: ', res)
                        setPostState(res.data)}) 
                })
                .catch(error => console.log('Create Post failure: ', error))
    }

    return (
        <div className="p-5">

            {/* -- Create posts -- */}

            <div>
            <h1>Create a Post</h1>
            <h2>Post Title</h2>
            <input
                onChange = {e =>setTitle(e.target.value)}
                value = {title}
            />
            <br></br>
            <h2>Post Content</h2>
            <input
                onChange = {e =>setTextContent(e.target.value)}
                value = {textContent}
            />
            <hr />
            <div>
                
            </div>
            <div>
                <button onClick={() => submit()}>
                    Submit Post

                </button>
            </div>
            <hr />
        </div>
            
            {/* -- Display posts -- */}

            <hr />
            <h1>Posts</h1>
            <label htmlFor="postFilter">Sort posts by:</label>
            <select id="postTypes" name="postTypes" onChange = {(e) => {
                console.log(e.target.value)
                if (e.target.value === 'All Posts') {
                        setPostState(allPosts)
                } else if (e.target.value === 'Your Posts') {
                        setPostState(allPosts.filter((post) => post.posted_by === userId))
                } else if (e.target.value === 'Liked Posts') {
                        setPostState(allPosts.filter((post) => post.liked_by.includes(userId)))
                } else {
                    setPostState(userPosts)
                }
                    }
                }
                >
            <option value = 'All Posts'>All Posts</option>
            <option value = 'Your Posts'>Your Posts</option>
            <option value = 'Liked Posts'>Liked Posts</option>

            </select>

            {postState.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.text_content}</p>

                    <br></br>
                    <button onClick = {() => {
                        console.log('Like has been pressed')
                        likePost ({ auth, current_user: currentUser.id, post_id: post.id, likes: post.likes }) 
                        .then(response => { 
                            getPosts({ auth })
                            .then(res => {
                                console.log('res from likePosts: ', res)
                                setPostState(res.data)}) 
                        })  
                        
                     }}>
                        Like
                    </button>

                    <button style={{ marginLeft: 20 }} onClick = {() => {
                        if (post.posted_by === userId) {
                            console.log('Delete has been pressed')
                            deletePost ({ auth, postId : post.id }) 
                            .then(response => { 
                                getPosts({ auth })
                                .then(res => {
                                    console.log('res from getPosts: ', res)
                                    setPostState(res.data)}) 
                            })  
                        } else {
                            alert("You can't delete someone else's post")
                        }
                    }}>
                        Delete
                    </button>
                    <button style={{ marginLeft: 20 }} onClick = {() => {
                       if (post.posted_by === userId) {
                            console.log('Edit has been pressed')
                            editPost ({ auth, postId: post.id, textContent: prompt('Enter new text content'), likeCount: post.like_count })
                            .then(response => { 
                                console.log('response from editPost: ', response)
                                getPosts({ auth })
                                .then(res => {
                                    console.log('res from getPosts: ', res)
                                    setPostState(res.data)}) 
                            })
                        } else {
                            alert("You can't edit someone else's post")
                        }
                    }}>
                        Edit
                    </button>
                    <h6> Likes: {post.likes} </h6>

                    <br></br>
                    <h6> Posted by {post.poster_name} at {post.posted_at} </h6>
                    <hr />
                </div>
            ))}
        </div>
    )

}

export default Forum