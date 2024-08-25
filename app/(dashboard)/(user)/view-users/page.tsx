import Link from "next/link";
import { DataTable } from "./data-table";
import { columns, User } from "./columns";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const getData = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, last_name, email, role");

  if (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }

  return data.map((user) => ({
    id: user.id,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  }));
};

const ViewUsersPage = async () => {
  const data = await getData();

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Lista de usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Aqui podras ver la lista de usuarios agregados
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={"/add-user"}
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Agregar Usuario
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewUsersPage;
