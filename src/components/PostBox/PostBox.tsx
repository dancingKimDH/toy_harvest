import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Pagination from "../Utils/Pagination";
import { NEWS_CATEGORY_ARR } from "../data/data";
import AuthContext from "../../context/AuthContext";
import { db } from "../../firebaseApp";

import { PostProps } from "../../interface";

import Link from "next/link";

export default function PostBox() {

    const [posts, setPosts] = useState<PostProps[]>([]);
    const [displayPosts, setDisplayPosts] = useState<PostProps[]>([]);

    const user = useContext(AuthContext);

    const [limit, setLimit] = useState<number>(6);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(posts.length);

    const [subject, setSubject] = useState<string>("title");
    const [searchWord, setSearchWord] = useState<string>("");


    const offset = (page - 1) * limit;

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            let postRef = collection(db, "posts");
            let postQuery = query(postRef, orderBy("createdAt", "desc"));

            onSnapshot(postQuery, (snapshot) => {
                let dataObj = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc?.id,
                }))
                setPosts(dataObj as PostProps[]);
                setDisplayPosts(dataObj as PostProps[]);
            })

        }
    }, [user])

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { target: { name, value } } = e;
        if (name === "subject") {
            setSubject(value);
        } else if (name === "searchWord") {
            setSearchWord(value);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const keywords = searchWord.trim().split(/\s+/);
        const filteredPosts = posts.filter((post) => {
            if (subject === "title") {
                return keywords.some(keyword => post.title?.toLowerCase().includes(keyword.toLowerCase()));
            } else if (subject === "content") {
                return keywords.some(keyword => post.content?.toLowerCase().includes(keyword.toLowerCase()));
            } else {
                return keywords.some(keyword => post.hashTags?.includes(keyword.toLowerCase()));
            }

        })
        setDisplayPosts(filteredPosts as PostProps[]);
    }

    return (
        <>
            <div className="lg:w-[1000px] mx-auto">
                <div className="search__bar--newsbox">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="px-3 mt-3 flex items-center justify-between">
                            <select onChange={onChange} name="subject" id="" className="outline-none">
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="hashtag">해시태그</option>
                            </select>
                            <input onChange={onChange} type="text" name="searchWord" className="text-sm w-full outline-none p-1" id="" placeholder="제목..." />
                            <select name="" id="" className="outline-none">
                                <option value="" className="text-sm"><span className="text-sm">카테고리 선택</span></option>
                                {NEWS_CATEGORY_ARR.map((data) => (
                                    <option className="" key={data}>{data.slice(0, -2)}</option>
                                ))}
                            </select>
                            <button type="submit" className="text-sm search__btn text-white font-semibold">검색하기</button>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 gap-8 px-10 my-5 mx-auto md:grid-cols-3 ">
                    {displayPosts.slice(offset, offset + limit).map((post, index) => (
                        <div className="" key={index} onClick={() => navigate(`/community/${post?.id}`)}>
                            <div className="flex justify-center mx-auto">
                                <img className="rounded-lg shadow-sm" src="/images/3.jpg" alt="" />
                            </div>
                            <div className="flex justify-center font-semibold py-1">
                                {post.title}
                            </div>
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <FaRegUserCircle />{post.name}</div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MdDateRange /> {post.createdAt}</div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <CiHeart /> {post.likes}</div>
                            </div>
                        </div>

                    ))}
                </div>

                <div className="flex justify-center mt-5">
                    <Pagination total={posts.length} limit={limit} setPage={setPage} page={page} />
                </div>

                <div className="flex justify-end p-3">
                    <button type="button" className="bg-primaryYellow rounded-lg p-1 text-sm flex" onClick={() => { navigate("/news/new") }}>새 글 작성하기</button>
                </div>

            </div>
        </>
    )
}