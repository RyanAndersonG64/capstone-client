import { useState, useContext, useEffect } from "react"
import { useCollapse } from "react-collapsed"
import { useNavigate } from "react-router-dom"
import { AuthContext } from './contexts/context.jsx'
import { DataContext } from "./contexts/DataContext"
import { UIContext } from './contexts/UIContext'
import { useError } from "./hooks/useError"
import { useModal } from './hooks/useModal'


import { getPosts, deletePost, editPost, addPost, likePost, getComments, addComment, editComment, deleteComment } from './api/forumApi'

const Forum = () => {

    const { setError } = useError()
    const { prompt } = useModal()
    const { auth } = useContext(AuthContext)
    const { currentUser, setCurrentUser } = useContext(DataContext)
    const { allPosts, setAllPosts, profileView, setProfileView } = useContext(UIContext)

    // the visible list is derived from allPosts rather than held as a second
    // copy, so a refresh after an edit keeps whichever sort is selected
    const [postFilter, setPostFilter] = useState('All Posts')
    const [allComments, setAllComments] = useState([])
    const [commentState, setCommentState] = useState([])

    const [title, setTitle] = useState('')
    const [textContent, setTextContent] = useState('')
    
    const [loading, setLoading] = useState(true)
    
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
            if (!auth.accessToken) {
                navigate('/')
            }
        },
        []
    )

    useEffect(
        () => {
            if (!auth.accessToken) return

            Promise.all([
                getPosts({ auth }),
                getComments({ auth })
            ])
                .then(([postsResponse, commentsResponse]) => {
                    setAllPosts(postsResponse.data)
                    setAllComments(commentsResponse.data)
                    setLoading(false)
                })
                .catch(() => {
                    setError('Error fetching posts and comments')
                    setLoading(false)
                })
        },
        [auth]
    )

    const visiblePosts = postFilter === 'Your Posts'
        ? allPosts.filter(post => post.posted_by === currentUser.id)
        : postFilter === 'Liked Posts'
            ? allPosts.filter(post => post.liked_by.includes(currentUser.id))
            : allPosts

    const refreshPosts = () => {
        return getPosts({ auth })
            .then(res => setAllPosts(res.data))
            .catch(() => setError('Error refreshing posts'))
    }

    const refreshComments = (postId) => {
        return getComments({ auth })
            .then(res => {
                setAllComments(res.data)
                setCommentState(res.data.filter(comment => comment.post === postId))
            })
            .catch(() => setError('Error refreshing comments'))
    }

    const submit = () => {

        let poster = currentUser.id
        addPost({ auth, title, postedBy: poster, textContent })
            .then(() => refreshPosts())
    }

    if (loading) {
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
            <select id="postTypes" name="postTypes" value={postFilter}
                onChange={(e) => setPostFilter(e.target.value)}
            >
                <option value='All Posts'>All Posts</option>
                <option value='Your Posts'>Your Posts</option>
                <option value='Liked Posts'>Liked Posts</option>

            </select>

            {visiblePosts.toReversed().map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.text_content}</p>

                    <br></br>
                    <button onClick={() => {
                        likePost({ auth, current_user: currentUser.id, post_id: post.id, likes: post.likes })
                            .then(() => refreshPosts())
                    }}>
                        Like
                    </button>

                    <button style={{ marginLeft: 20 }} onClick={() => {
                        if (post.posted_by === currentUser.id) {
                            deletePost({ auth, postId: post.id })
                                .then(() => refreshPosts())
                        } else {
                            setError("You can't delete someone else's post")
                        }
                    }}>
                        Delete
                    </button>

                    <button style={{ marginLeft: 20 }} onClick={async () => {
                        if (post.posted_by !== currentUser.id) {
                            setError("You can't edit someone else's post")
                            return
                        }
                        const textContent = await prompt('Enter new text content', {
                            defaultValue: post.text_content,
                            confirmText: 'Save',
                        })
                        if (textContent === null) return

                        editPost({ auth, postId: post.id, textContent, likeCount: post.like_count })
                            .then(() => refreshPosts())
                    }}>
                        Edit
                    </button>

                    <button style={{ marginLeft: 20 }} onClick={async () => {
                        const textContent = await prompt('Enter comment', { confirmText: 'Post comment' })
                        if (textContent === null) return

                        addComment({ auth, postId: post.id, postedBy: currentUser.id, textContent })
                            .then(() => refreshComments(post.id))
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
                                            onClick={async () => {
                                                if (comment.posted_by !== currentUser.id) {
                                                    setError("You can't edit someone else's comment")
                                                    return
                                                }
                                                const textContent = await prompt('Enter new text content', {
                                                    defaultValue: comment.text_content,
                                                    confirmText: 'Save',
                                                })
                                                if (textContent === null) return

                                                editComment({ auth, commentId: comment.id, textContent })
                                                    .then(() => refreshComments(post.id))
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button style={{ marginLeft: 20 }}
                                            onClick={() => {
                                                if (comment.posted_by === currentUser.id) {
                                                    deleteComment({ auth, commentId: comment.id })
                                                        .then(() => refreshComments(post.id))
                                                } else {
                                                    setError("You can't delete someone else's comment")
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