export const ErrorDisplay = (props: { error: Error }) => (
    <div>
        <h3>An error has occured</h3>
        <p>{props.error.message}</p>
    </div>
)