export default function Tickets({ tickets }) {
    return (
        <>
        <h3>Tickets: </h3>
        {tickets.map(
            ticket => (
                <p>{ticket}</p>
            )
        )}
        </>
    )
}