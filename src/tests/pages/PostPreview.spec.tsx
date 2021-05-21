import { render, screen } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'


const post = {
    slug: "any slug",
    title: "any title",
    content: "<p>any content/text</p>",
    updatedAt: "01 de Abril de 2021"
}

jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

describe('Post preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])
        render(<Post post={post} />)

        expect(screen.getByText("any title")).toBeInTheDocument()
        expect(screen.getByText("any content/text")).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading ?")).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([{
            activeSubscription: "fake-active-subscription"
        }, false
        ] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/any slug')
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: "heading", text: "any title" }],
                    content: [{ type: "paragraph", text: "any text" }]
                },
                last_publication_date: "04-01-2021"
            })
        } as any)

        const response = await getStaticProps({ params: { slug: 'any slug' } })

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