import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'

jest.mock('next-auth/client')

describe('SignInButton component', () => {
    it('renders correctly when user is not logged in', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])
        render(
            <SignInButton />
        )

        expect(screen.getByText('Sign In with GitHub')).toBeInTheDocument()
    })

    it('renders correctly when user is logged in', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce(
            [{
                user: {
                    name: "John Doe",
                    email: "john.doe@mail.com"
                }, expires : ''
            }, false
        ])
        
        render(
            <SignInButton />
        )

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

})
