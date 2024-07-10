'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'
import { extractText } from "lib/extract-text";
import Container from "components/container";
import PostHeader from "components/post-header";
import PostBody from "components/post-body";
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from 'components/two-column'
import ConvertBody from "components/convert-body";
import PostCategories from "components/post-categories";
import imgixLoader from '/lib/image'
import Image from "next/image";

// ローカルの代替アイキャッチ画像
import { eyecatchLocal } from "lib/constants";
import { Kings } from 'next/font/google';


export function Post() {
  const [postData, setPostData] = useState(null)

  const searchParams = useSearchParams()

  const contentId = searchParams.get('id');
  const draftKey = searchParams.get('draftKey');

  useEffect(() => {
    const fetchData = async () => {
      const post = await fetch(`https://${process.env.NEXT_PUBLIC_SERVICE_DOMAIN}.microcms.io/api/v1/blogs/${contentId}?draftKey=${draftKey}`, {headers: { 'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_API_KEY }}).then(res => res.json())
      setPostData(post)
    }
    fetchData()
  }, [contentId, draftKey])

  if (!postData) {
    return <p>Loading...</p>;
  }
  
  const { title, publishDate: publish, content, categories } = postData

  const eyecatch = postData.eyecatch ?? eyecatchLocal

  return (
    <Container>
      <article>
        <PostHeader title={title} subtitle="Blog Article" publish={publish} />

        <figure>
          <Image
            loader={imgixLoader}
            src={eyecatch.url}
            alt=""
            width={eyecatch.width}
            height={eyecatch.height}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </figure>

        <TwoColumn>
          <TwoColumnMain>
            <PostBody>
              <ConvertBody contentHTML={content} />
            </PostBody>
          </TwoColumnMain>
          <TwoColumnSidebar>
            <PostCategories categories={categories} />
          </TwoColumnSidebar>
        </TwoColumn>
      </article>
    </Container>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Post />
    </Suspense>
  )
}