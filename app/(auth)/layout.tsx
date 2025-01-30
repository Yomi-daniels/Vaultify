import React from "react";
import Image from "next/image";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center lg:flex xl:w-2/5">
        <div className="flex max-h-[50rem] max-w-[26.875rem] flex-col justify-center space-y-12">
          <div className="flex items-center ">
            <Image
              src="/assets/icons/circle-logo.png"
              alt="logo"
              width={100}
              height={82}
              className="h-auto"
            />
            <h2 className="text-white text-[32px] font-semibold">Vaultify</h2>
          </div>
          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store your documents.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="file"
            width={320}
            height={320}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-gray-50 p-4  lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden bg-brand-100 w-full p-10 rounded-[1.25rem]">
          <div className="flex items-center ">
            <Image
              src="/assets/icons/circle-logo.png"
              alt="logo"
              width={100}
              height={82}
              className="h-auto"
            />
            <h2 className="text-white text-[32px] font-semibold">Vaultify</h2>
          </div>
        </div>
        {children}
      </section>
    </div>
  );
};

export default Layout;
