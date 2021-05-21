import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'


const posts = [{
    slug: "any slug",
    title: "any title",
    excerpt: "any excerpt/text",
    updatedAt: "any Date"
}]

jest.mock('../../services/prismic')

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText("any title")).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [{
                    uid: 'any uid/slug',
                    data: {
                        title: [{ type: "heading", text: "any text" }],
                        content: [{ type: "paragraph", text: "any text" }]
                    },
                    last_publication_date: "04-01-2021"
                }]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        excerpt: "any text",
                        slug: 'any uid/slug',
                        title: 'any text',
                        updatedAt: "01 de abril de 2021"
                    }]
                }
            })
        )
    })
})