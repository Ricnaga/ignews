import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'


const post = {
    slug: "any slug",
    title: "any title",
    content: "<p>any content/text</p>",
    updatedAt: "01 de Abril de 2021"
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText("any title")).toBeInTheDocument()
        expect(screen.getByText("any content/text")).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({ params: { slug: "any slug" } } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: "heading", text: "any title" }],
                    content: [{ type: "paragraph", text: "any text" }]
                },
                last_publication_date: "04-01-2021"
            })
        } as any)

        const response = await getServerSideProps({ params: { slug: "any slug" } } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        content: "<p>any text</p>",
                        slug: "any slug",
                        title: "any title",
                        updatedAt: "01 de abril de 2021"
                    }
                }
            })
        )

    })
})