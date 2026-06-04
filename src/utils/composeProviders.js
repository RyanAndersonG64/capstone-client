export const composeProviders = (providers) => {
    return providers.reduce(
        (Accumulated, Current) => {
            return ({ children }) => (
                <Accumulated>
                    <Current>
                        {children}
                    </Current>
                </Accumulated>
            )
        },
        ({ children }) => <>{children}</>
    )
}