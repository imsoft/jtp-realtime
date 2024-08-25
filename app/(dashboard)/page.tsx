import Image from "next/image";
import Link from "next/link";

const Index = () => {
  return (
    <>
      <div className="relative bg-white">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
          <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:py-40 xl:col-span-6">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <Image
                alt="JTP Logistics"
                src="/Logotipo-JTP-Logistics.png"
                className="h-10 w-auto"
                width={100}
                height={70}
              />
              <h1 className="mt-24 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
                JTP Logistics
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Con esta aplicación podras agregar rutas y verlas en tiempo real
                en donde sea y en cualquier momento
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="#"
                  className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Ver Rutas
                </Link>
                <Link
                  href="/view-users"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Ver Usuarios <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
            <Image
              alt="JTP Logistics"
              src="https://images.unsplash.com/photo-1718314786551-798f1398a7b1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
              width={500}
              height={750}
              priority
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
