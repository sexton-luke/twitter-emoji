import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db"
import superjson from 'superjson';
import { PageLayout } from "~/components/pageLayout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";


type ProfileFeedProps = {
  userId: string;
}

const ProifileFeed = ({ userId }: ProfileFeedProps) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ userId });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return <div className="flex flex-col">
    {data.map((fullPost) => (<PostView {...fullPost} key={fullPost.post.id} />))}
  </div>

}


type ProfilePageProps = {
  username: string;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({ username });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] rounded-full border-4 border-black bg-black ml-4"
          />
        </div>
        <div className="h-[64px]" />
        <div className="p-4 text-2xl font-bold">
          {`@${data.username ?? ""}`}
        </div>
        <div className="w-full border-b border-slate-400" />
        <ProifileFeed userId={data.id} />
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== 'string') throw new Error("no slug");

  const username = slug.replace("@", "");
  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export default ProfilePage;
