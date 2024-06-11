import { useContext, useState, useEffect } from "react"
import { Container, Column } from "react-bootstrap"
import { AuthContext } from "./context";

/*-
add candidate
one vote per person?
select option one throught number of candidates


-*/

function CreateVote() {
    const { state, dispatch } = useContext(AuthContext);
    const [votes, setVotes ] = useState(0)
    const [candidates, setCandidates] = useState()
    const [rounds, setRounds] = useState()


    return (
        <>
        <Container>
            <Column>
            {/* candidates */}
            </Column>
            <Column>
            {/* votes */}
            </Column>
        </Container>
        </>
    )
}

export default CreateVote