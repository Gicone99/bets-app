export default function Tickets({ tickets }) {
    return (
        <>
        <h3>Tickets: </h3>
        {/* we destructure the prop and map over tickets so we can use ticket as value like in a foreach loop */}
        {tickets.map(
            ticket => (
                <p>{ticket}</p>
            )
        )}
        </>
    )
}