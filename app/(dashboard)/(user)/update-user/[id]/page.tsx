"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import bcrypt from "bcryptjs";
import { useToast } from "@/components/ui/use-toast";

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

const supabase = createClient();

const roles = [
  { label: "Administrador", value: "admin" },
  { label: "Colaborador", value: "collaborator" },
] as const;

const formSchema = z
  .object({
    name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    email: z.string().email().min(2).max(50),
    role: z.string().min(2).max(50),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password && confirmPassword && confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
      });
    }
  });

const UpdateUserPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("name, last_name, email, role")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else if (data) {
        form.reset({
          name: data.name,
          last_name: data.last_name,
          email: data.email,
          role: data.role,
        });
      }
      setLoading(false);
    };

    getUserData();
  }, [params.id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updates = {
      name: values.name,
      last_name: values.last_name,
      email: values.email,
      role: values.role,
      password: values.password,
    };

    if (values.password) {
      updates.password = await bcrypt.hash(values.password, 12);
    }

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", params.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar el usuario",
      });
    } else {
      toast({
        variant: "success",
        title: "Usuario actualizado con éxito",
      });
      router.push("/view-users");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpenAlertDialog(true);
          }}
          className="space-y-8"
        >
          <div className="pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Actualizar usuario
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Llena los campos correctamente para actualizar la información del
              usuario.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Campos de formulario */}
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre(s)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido(s)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2.5">Role</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? roles.find(
                                    (role) => role.value === field.value
                                  )?.label
                                : "Selecciona un role"}
                              <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Busca un role..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandGroup>
                                {roles.map((role) => (
                                  <CommandItem
                                    value={role.label}
                                    key={role.value}
                                    onSelect={() =>
                                      form.setValue("role", role.value)
                                    }
                                  >
                                    {role.label}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        role.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input autoComplete="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <Button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Actualizar
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que deseas actualizar la información de este
              usuario?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Una vez actualizado, no podrás deshacer esta acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpdateUserPage;
