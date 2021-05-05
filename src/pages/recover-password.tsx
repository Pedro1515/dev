import React from "react";
import classNames from "classnames";
import { Input, NoAccount } from "src/components";
import { LockIcon } from "src/components";

export default function Login() {
  return (
    <div className="min-h-screen flex-center bg-gray-100">
      <div className="max-w-md w-full py-12 px-6">
        <img
          className="mx-auto h-32 w-auto"
          src="/assets/logo_lippia_final_color.png"
          alt="lippia"
        />
        <h2 className="mt-10 text-3xl font-semibold text-center leading-9 font-display">
          Recover password
        </h2>
        <p className="mt-5 text-sm leading-5 text-center text-gray-600">
          Enter your email and we'll send you a link to get back into your account..
        </p>
        <form className="mt-5">
          <div className="rounded-md shadow-sm">
            <div>
              <Input
                aria-label="Email"
                name="email"
                type="email"
                className={classNames("rounded")}
                placeholder="Email"
              />
            </div>
          </div>
          <div className="mt-5">
            <button className="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700 focus:bg-gray-900 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5">
              <span className="absolute left-0 inset-y pl-3">
                <div className="h-5 w-5 text-gray-500">
                  <LockIcon />
                </div>
              </span>
              Recover password
            </button>
          </div>
        </form>
        <NoAccount />
      </div>
    </div>
  );
}
