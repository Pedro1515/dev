import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import classNames from "classnames";
import { Input, NoAccount, Spinner } from "../components";
import { useAuth, useNotification, useUser } from "../context";
import { LockIcon } from "../components";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { mutateUser } = useUser({ redirectTo: "/", redirectIfFound: true });
  const { login, loading } = useAuth();
  const { show } = useNotification();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    router.prefetch("/");
  }, []);

  const onSubmit = async ({ username, password }) => {
    try {
      const response = await login(username, password);
      mutateUser(response);
    } catch (error) {
      console.log('error');
      console.log(error);
      show({
        type: "error",
        title: "Error",
        message: "An error occurred while trying to log in",
      });
      setValue("password", "");
    }
  };

  return (
    <div className="min-h-screen flex-center bg-gray-100">
      <div className="max-w-md w-full py-12 px-6">
        <img
          className="mx-auto h-32 w-auto"
          src="/assets/logo_lippia_final_color.png"
          alt="lippia"
        />
        <p className="mt-6 text-sm leading-5 text-center text-gray-900">
          Lippia Report Server
        </p>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm">
            <Input
              type="text"
              ref={register({ required: true })}
              aria-label="Username"
              name="username"
              className={classNames("rounded-t-md")}
              placeholder="Username"
            />
            <div className="-mt-px relative">
              <Input
                type="password"
                name="password"
                ref={register({ required: true })}
                aria-label="Password"
                className={classNames("rounded-b-md")}
                placeholder="Password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <Link href="/recover-password">
                  <a className="text-gray-900 underline">
                    Forgot Password?
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className={classNames(
                "relative",
                "block",
                "w-full",
                "py-2",
                "px-3",
                "border",
                "border-transparent",
                "rounded-md",
                "text-white",
                "font-semibold",
                "bg-gray-800",
                "hover:bg-gray-700",
                "focus:bg-gray-900",
                "focus:outline-none",
                "focus:shadow-outline",
                "sm:text-sm",
                "sm:leading-5"
              )}
            >
              <span className="absolute left-0 inset-y pl-3">
                <div className="h-5 w-5 text-gray-500">
                  {loading ? <Spinner /> : <LockIcon />}
                </div>
              </span>
              Log In
            </button>
          </div>
        </form>
        <NoAccount />
      </div>
    </div>
  );
}
