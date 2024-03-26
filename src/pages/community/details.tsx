import Header from "components/Utils/Header"
import AuthContext from "context/AuthContext";
import { User } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "interface";
import { Context, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CommunityPostDetail() {

    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState<PostProps | null>(null);

    const getPost = async () => {
        if (id) {
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);
            setPost({ ...(docSnap.data() as PostProps) });
        }
    }

    useEffect(() => {
        getPost();
    }, [user, id])

    return (
        <>
            <Header />
            <div className="px-5">
                {post ? (
                    <div className="flex justify-center">
                        <div className="mx-auto lg:w[1600px] md:w-[1000px] w-[300px] box-border">
                            <div className="flex left-0 right-0 mt-8 px-2 sm:px-0">
                                <h3 className="w-full bg-gray-200 rounded-lg p-3 text-lg shaow-gray-300 underline font-semibold leading-7 text-gray-900">{post?.title}</h3>
                            </div>
                            <div className="px-4 py-6">
                                {post?.imageUrl && (
                                    <div className="flex justify-center">
                                        <img className="object-cover" src={post?.imageUrl} alt="이미지" />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <div className="grow mt-3 border-t border-gray-300">
                                    <dl className="divide-y divide-gray-100">
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">작성 날짜</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{post?.createdAt}</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">해시태그</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                {post?.hashTags?.map((hashTag, index) => (
                                                    <span className="text-blue-500 font-semibold">#{hashTag}{' '}</span>
                                                ))}</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">작성자</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                {user?.displayName ? user?.displayName : '익명'}</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">이메일 주소</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{post?.email}</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">작성 글</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                {post?.content}
                                            </dd>
                                        </div>

                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>웹페이지가 존재하지 않습니다</div>
                )}

            </div>
        </>
    )
}

function usesContext(AuthContext: Context<{ user: User | null; }>) {
    throw new Error("Function not implemented.");
}
