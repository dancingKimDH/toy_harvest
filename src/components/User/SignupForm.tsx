import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { GrFormPrevious } from "react-icons/gr";
import { FaCheck } from "react-icons/fa";
import { app, db } from "../../firebaseApp";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { addDoc, collection, doc } from "firebase/firestore";

export default function SignUpForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        name: user?.displayName || "사용자",
        uid: user?.uid,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        email: user?.email,
        imageUrl: user?.photoURL || "",
      })

      navigate("/");
      toast.success("회원가입에 성공하였습니다");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);
      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해 주세요");
      } else {
        setError("");
      }
    }

    if (name === "password_confirmation") {
      setPasswordConfirmation(value);
    }
  };

  const onClickSocialLogIn = async (e: any) => {
    const auth = getAuth(app);
    let provider;
    provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider as GoogleAuthProvider);
    await addDoc(collection(db, "users"), {
      name: user?.displayName || "사용자",
      uid: user?.uid,
      createdAt: new Date()?.toLocaleDateString("ko", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      email: user?.email,
      imageUrl: user?.photoURL || "",
    })
    navigate("/");
    toast.success("회원가입에 성공하였습니다");
  };

  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  return (
    <>
      <div className="login__container ">
        <div className="background-blue h-screen w-full md:w-[500px]">
          <div className="button-prev">
            <button
              className="text-lg"
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              <GrFormPrevious />
            </button>
          </div>
          <form action="" onSubmit={onSubmit} className="form__signup">
            <h1 className="form__signup__title">
              <span className="font-semibold"> 푸른대로와 </span> <br />
              <span className="font-semibold text-highlight">
                함께 시작해 볼까요?
              </span>
            </h1>
            <div className="form__signup__block">
              <label htmlFor="email">
                <MdOutlineMail />
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                onChange={onChange}
                placeholder="이메일"
              />
            </div>
            <div className="form__signup__block">
              <label htmlFor="password">
                <RiLockPasswordFill />
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                onChange={onChange}
                placeholder="비밀번호 입력"
              />
            </div>
            <div className="form__signup__block">
              <label htmlFor="password_confirm">
                <FaCheck />
              </label>
              <input
                type="password"
                name="password_confirm"
                id="password_confirm"
                required
                onChange={onChange}
                placeholder="비밀번호 확인"
              />
            </div>
            {error && error?.length > 0 && (
              <div className="form__signup__block error__msg">{error}</div>
            )}

            <div className="form__signup__btn">
              <input
                type="submit"
                value="회원가입"
                className="form__signup__btn-submit"
                disabled={error?.length > 0}
              />
            </div>

            {/* error 수정! */}
            <div className="form__signup__btn google">
              <input
                type="submit"
                value="Sign Up with Google"
                onClick={onClickSocialLogIn}
                className="form__signup__btn-submit"
                disabled={error?.length > 0}
              />
            </div>

            <div className="form__signup__block-login text-sm">
              계정이 있으신가요?
              <Link to="/login" className="form__signup__block-login-link text-sm">
                로그인하기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
