import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import { Async } from "."

test('it renders correctcly', async () => {
    render(<Async />)
    expect(screen.getByText('Exemplo de testes assíncronos')).toBeInTheDocument()

    await waitFor(() => {
        return expect(screen.queryByText('Button')).not.toBeInTheDocument()
    })
})