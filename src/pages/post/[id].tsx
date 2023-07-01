import { type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/pageLayout";

const SinglePostPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <div>
          Posts View
        </div>
      </PageLayout>
    </>

  );
}

export default SinglePostPage;
