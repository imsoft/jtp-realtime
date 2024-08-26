"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export type Route = {
  id: string;
  upload_date: Date;
  client: string;
  origin: string;
  destination: string;
  final_client_destination: string;
  delivery_date: Date;
  delivery_time: Date;
  reference: string;
  operator: string;
  status: string;
};

export const columns: ColumnDef<Route>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "upload_date",
    header: "Fecha de carga",
  },
  {
    accessorKey: "client",
    header: "Cliente",
  },
  {
    accessorKey: "origin",
    header: "Origen",
  },
  {
    accessorKey: "destination",
    header: "Destino",
  },
  {
    accessorKey: "final_client_destination",
    header: "Destino final del cliente",
  },
  {
    accessorKey: "delivery_date",
    header: "Fecha de entrega",
  },
  {
    accessorKey: "delivery_time",
    header: "Hora de entrega",
  },
  {
    accessorKey: "reference",
    header: "Referencia",
  },
  {
    accessorKey: "operator",
    header: "Operador",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const route = row.original;
      const router = useRouter();
      const supabase = createClient();
      const { toast } = useToast();
      const [openAlertDialog, setOpenAlertDialog] = useState(false);

      const handleDelete = async () => {
        const { error } = await supabase
          .from("routes")
          .delete()
          .eq("id", route.id);

        if (error) {
          toast({
            variant: "success",
            title: "Error al eliminar la ruta",
          });
        } else {
          toast({
            variant: "success",
            title: "Ruta eliminada con éxito",
          });
          router.refresh();
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/update-route/${route.id}`);
              }}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setOpenAlertDialog(true);
              }}
            >
              Eliminar
            </DropdownMenuItem>

            <AlertDialog
              open={openAlertDialog}
              onOpenChange={setOpenAlertDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Quieres eliminar esta ruta del cliente: <br /> "
                    {route.client}"?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Los datos de esta ruta serán eliminados de forma permanente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
