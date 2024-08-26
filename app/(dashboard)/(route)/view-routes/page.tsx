import Link from "next/link";
import { DataTable } from "./data-table";
import { columns, Route } from "./columns";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const getData = async (): Promise<Route[]> => {
  const { data, error } = await supabase
    .from("routes")
    .select(
      "id, upload_date, client, origin, destination, final_client_destination, delivery_date, delivery_time, reference, operator, status"
    );

  if (error) {
    console.error("Error fetching routes:", error.message);
    return [];
  }

  return data.map((route) => ({
    id: route.id,
    upload_date: route.upload_date,
    client: route.client,
    origin: route.origin,
    destination: route.destination,
    final_client_destination: route.final_client_destination,
    delivery_date: route.delivery_date,
    delivery_time: route.delivery_time,
    reference: route.reference,
    operator: route.operator,
    status: route.status,
  }));
};

const ViewRoutesPage = async () => {
  const data = await getData();

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Lista de rutas
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Aquí puedes ver todas las rutas que tienes disponibles.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={"/add-route"}
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Agregar Ruta
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

export default ViewRoutesPage;
