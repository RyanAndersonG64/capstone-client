import React from 'react'

export const composeProviders = (providers) => {
    return providers.reduce(
        (Accumulated, Current) => {
            return ({ children }) => React.createElement(
                Accumulated,
                null,
                React.createElement(Current, null, children)
            )
        },
        ({ children }) => children
    )
}