import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import {
  apolloClient,
  getSdk,
  usePreviewMode,
  useStoryblok,
} from '@quansight/shared/storyblok-sdk'

import Page from '../components/Page'

const Container = ({ data, preview }) => {
  const previewMode = usePreviewMode(preview)
  console.log('previewMode:', previewMode)

  const story = useStoryblok(data, preview)

  return (
    <>
      {story?.content?.component === 'Page' && (
        <Page body={story?.content?.body} />
      )}
    </>
  )
}

const dataSdk = getSdk(apolloClient)

export const getStaticPaths: GetStaticPaths = async () => {
  // Just a sample link to existing page
  return { paths: [{ params: { slug: 'kontakt' } }], fallback: false }
}

export const getStaticProps: GetStaticProps = async ({
  params: { slug },
  preview = false,
}) => {
  const data = await dataSdk.getPageItem({ slug })

  return {
    props: {
      data: data.data.PageItem,
      preview,
    },
  }
}

export default Container
