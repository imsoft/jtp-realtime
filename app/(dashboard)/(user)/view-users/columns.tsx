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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export type User = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  role: string;
  password?: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre(s)",
  },
  {
    accessorKey: "last_name",
    header: "Apellido(s)",
  },
  {
    accessorKey: "email",
    header: "Correo Electrónico",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const router = useRouter();
      const supabase = createClient();
      const { toast } = useToast();
      const [openAlertDialog, setOpenAlertDialog] = useState(false);

      const handleDelete = async () => {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", user.id);

        if (error) {
          toast({
            variant: "success",
            title: "Error al eliminar el usuario",
          });
        } else {
          toast({
            variant: "success",
            title: "Usuario eliminado con éxito",
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
                router.push(`/update-user/${user.id}`);
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
                    ¿Quieres eliminar a este usuario: <br /> "{user.name}{" "}
                    {user.last_name}"?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Los datos de este usuario serán eliminados de forma
                    permanente.
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
