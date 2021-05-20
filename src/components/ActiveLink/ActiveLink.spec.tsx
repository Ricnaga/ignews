import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})

describe('ActiveLink component', () => {
    it('renders correctly', () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a>Any content</a>
            </ActiveLink>
        )

        expect(screen.getByText('Any content')).toBeInTheDocument()
    })

    it('adds active class if the link is currently active', () => {
        render(
            <ActiveLink href="/" activeClassName="active">
                <a>Any content</a>
            </ActiveLink>
        )

        expect(screen.getByText('Any content')).toHaveClass('active')
    })
})
