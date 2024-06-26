import { useState, useContext, useEffect } from "react"
import { useCollapse } from "react-collapsed"
import { useNavigate } from "react-router-dom"
import { AuthContext } from './context'
import { UserContext } from "./usercontext"
import { PostContext } from './postcontext'
import { ProfileContext } from "./profileContext"


import { getPosts, deletePost, editPost, addPost, likePost, getComments, addComment, editComment, deleteComment } from './api'

const Forum = () => {

    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(UserContext)
    const { allPosts, setAllPosts } = useContext(PostContext)
    const { profileView, setProfileView } = useContext(ProfileContext)

    const authStorage = localStorage.getItem('authStorage')
    const storedUser = JSON.parse(localStorage.getItem('storedUser'))

    const [postState, setPostState] = useState([])
    const [allComments, setAllComments] = useState([])
    const [commentState, setCommentState] = useState([])

    const [title, setTitle] = useState('')
    const [textContent, setTextContent] = useState('')
    
    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)
    
    const navigate = useNavigate()

    const [isExpanded, setExpanded] = useState({})
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })

    const expandOrCollapse = (postId) => {
        setExpanded((prevStates) => ({
            ...prevStates,
            [postId]: !prevStates[postId],
        }));
    };


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(
        () => {

            auth.setAccessToken(authStorage)
            setCurrentUser(storedUser)

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

    useEffect(
        () => {
            if (auth.accessToken) {
                getPosts({ auth })
                    .then(response => {
                        setPostState(response.data)
                        setAllPosts(response.data)
                        setLoading1(false)
                    })
                    .catch(error => console.log('Get Posts Failure: ', error))
                getComments({ auth })
                    .then(response => {
                        setAllComments(response.data)
                        setLoading2(false)
                    })
                    .catch(error => console.log('Get Comments Failure: ', error))
            }
        },
        [auth.accessToken]
    )

    const submit = () => {

        let poster = currentUser.id
        addPost({ auth, title, postedBy: poster, textContent })
            .then(response => {
                console.log('response from AddPost: ', response)
                getPosts({ auth })
                    .then(res => {
                        console.log('res from getPosts: ', res)
                        setPostState(res.data)
                    })
            })
            .catch(error => console.log('Create Post failure: ', error))
    }

    if (loading1 || loading2) {
        return <div><img src = 'https://http.cat/images/102.jpg'></img></div>
    }

    return (
        <div className="p-5">

            {/* -- Create posts -- */}

            <div>
                <h1>Create a Post</h1>
                <h2>Post Title</h2>
                <input
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                />
                <br></br>
                <h2>Post Content</h2>
                <input
                    onChange={e => setTextContent(e.target.value)}
                    value={textContent}
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
            <select id="postTypes" name="postTypes" onChange={(e) => {
                console.log(e.target.value)
                if (e.target.value === 'All Posts') {
                    // getPosts({ auth })
                    // .then(response => {
                    //     setPostState(response.data)
                    // })
                    // .catch(error => console.log('Get Posts Failure: ', error))
                    setPostState(allPosts)
                } else if (e.target.value === 'Your Posts') {
                    // getPosts({ auth })
                    // .then(response => {
                    //     setPostState(response.data.filter((post) => post.posted_by === currentUser.id))
                    // })
                    // .catch(error => console.log('Get Posts Failure: ', error))
                    setPostState(allPosts.filter((post) => post.posted_by === currentUser.id))
                } else if (e.target.value === 'Liked Posts') {
                    // getPosts({ auth })
                    // .then(response => {
                    //     setPostState(response.data.filter((post) => post.liked_by.includes(currentUser.id)))
                    // })
                    // .catch(error => console.log('Get Posts Failure: ', error))
                    setPostState(allPosts.filter((post) => post.liked_by.includes(currentUser.id)))
                } else {
                    setPostState(allPosts)
                }
            }
            }
            >
                <option value='All Posts'>All Posts</option>
                <option value='Your Posts'>Your Posts</option>
                <option value='Liked Posts'>Liked Posts</option>

            </select>

            {postState.toReversed().map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.text_content}</p>

                    <br></br>
                    <button onClick={() => {
                        console.log('Like has been pressed')
                        likePost({ auth, current_user: currentUser.id, post_id: post.id, likes: post.likes })
                            .then(response => {
                                console.log(response)
                                getPosts({ auth })
                                    .then(res => {
                                        console.log('res from likePosts: ', res)
                                        setAllPosts(res.data)
                                    })
                            })

                    }}>
                        Like
                    </button>

                    <button style={{ marginLeft: 20 }} onClick={() => {
                        if (post.posted_by === currentUser.id) {
                            console.log('Delete has been pressed')
                            deletePost({ auth, postId: post.id })
                                .then(response => {
                                    getPosts({ auth })
                                        .then(res => {
                                            console.log('res from getPosts: ', res)
                                            setAllPosts(res.data)
                                        })
                                })
                        } else {
                            alert("You can't delete someone else's post")
                        }
                    }}>
                        Delete
                    </button>

                    <button style={{ marginLeft: 20 }} onClick={() => {
                        if (post.posted_by === currentUser.id) {
                            console.log('Edit has been pressed')
                            editPost({ auth, postId: post.id, textContent: prompt('Enter new text content'), likeCount: post.like_count })
                                .then(response => {
                                    console.log('response from editPost: ', response)
                                    getPosts({ auth })
                                        .then(res => {
                                            console.log('res from getPosts: ', res)
                                            setAllPosts(res.data)
                                        })
                                })
                        } else {
                            alert("You can't edit someone else's post")
                        }
                    }}>
                        Edit
                    </button>

                    <button style={{ marginLeft: 20 }} onClick={() => {

                        console.log('Comment has been pressed')
                        addComment({ auth, postId: post.id, postedBy: currentUser.id, textContent: prompt('Enter comment') })
                            .then(response => {
                                console.log('response from addComment: ', response)
                                getComments({ auth })
                                    .then(res => {
                                        console.log('res from getComments: ', res)
                                        if (res.data) {
                                            setAllComments(res.data)
                                            setCommentState((res.data.filter(comment => comment.post === post.id)))
                                        }
                                    })
                            })
                    }}>
                        Comment
                    </button>
                    <h6> Likes: {post.likes}

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <button className="display-comments"
                            {...getToggleProps({
                                onClick: () => {
                                    expandOrCollapse(post.id)
                                    setCommentState(allComments.filter(comment => comment.post === post.id))
                                },
                            })}
                        >
                            {isExpanded[post.id] ? 'Collapse' : `Comments: ${(allComments.filter(comment => comment.post === post.id)).length}`}
                        </button>
                        <section {...getCollapseProps()}>
                            {isExpanded[post.id] &&
                                commentState.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <br></br>
                                        <p className="comment-text">{comment.text_content}</p>
                                        <button
                                            onClick={() => {
                                                if (comment.posted_by === currentUser.id) {
                                                    editComment({ auth, commentId: comment.id, textContent: prompt('Enter new text content') })
                                                        .then(response => {
                                                            getComments({ auth })
                                                                .then(res => {
                                                                    setAllComments(res.data)
                                                                    setCommentState((res.data.filter(comment => comment.post === post.id)))
                                                                })
                                                        })
                                                } else {
                                                    alert("You can't edit someone else's comment")
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button style={{ marginLeft: 20 }}
                                            onClick={() => {
                                                if (comment.posted_by === currentUser.id) {
                                                    deleteComment({ auth, commentId: comment.id })
                                                        .then(response => {
                                                            getComments({ auth })
                                                                .then(res => {
                                                                    setCommentState((res.data.filter(comment => comment.post === post.id)))
                                                                    setAllComments(res.data)
                                                                })
                                                        })
                                                } else {
                                                    alert("You can't delete someone else's comment")
                                                }
                                            }}>

                                            Delete
                                        </button>
                                        <br></br>
                                        <h6> Posted by {comment.poster_name} on {formatDate(comment.posted_at)} </h6>
                                    </div>
                                ))
                            }
                        </section>

                    </h6>

                    <br></br>
                    <h5> Posted by
                        <button className="profile-link"
                            onClick={() => {
                                if (post.posted_by === currentUser.id) {
                                    navigate('/profile')
                                } else {
                                    localStorage.setItem('storedProfile', [post.posted_by])
                                    setProfileView(post.posted_by)
                                    navigate('/otherprofile')
                                }
                            }
                            }>
                            {post.poster_name}
                        </button>
                        on {formatDate(post.posted_at)}
                    </h5>
                    <hr />
                </div>
            ))}
        </div>
    )

}

export default Forum