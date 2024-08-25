"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const roles = [
  { label: "Administrador", value: "admin" },
  { label: "Colaborador", value: "collaborator" },
] as const;

const formSchema = z
  .object({
    name: z.string().min(2).max(50),
    last_name: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    role: z.string().min(2).max(50),
    password: z.string().min(2).max(50),
    confirmPassword: z.string().min(2).max(50),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
      });
    }
  });

const AddUserPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const hashedPassword = await bcrypt.hash(values.password, 12);

    const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
      {
        email: values.email,
        password: values.password,
      }
    );

    if (signUpError) {
      throw new Error(signUpError.message);
    }

    const { error } = await supabase.from("users").insert({
      name: values.name,
      last_name: values.last_name,
      email: values.email,
      role: values.role,
      // password: hashedPassword,
      password: values.password,
    });

    if (error) {
      toast({
        variant: "success",
        title: "Error al agregar el usuario",
      });
    } else {
      toast({
        variant: "success",
        title: "Usuario agregado con éxito",
      });
      router.push("/view-users");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Agregar usuario
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Llena los campos correctamente para agregar a un nuevo usuario.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                              <CommandEmpty>No se encontro role.</CommandEmpty>
                              <CommandGroup>
                                {roles.map((role) => (
                                  <CommandItem
                                    value={role.label}
                                    key={role.value}
                                    onSelect={() => {
                                      form.setValue("role", role.value);
                                    }}
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
                      <FormLabel>Contraseña</FormLabel>
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
                      <FormLabel>Confirmar contraseña</FormLabel>
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
              Agregar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddUserPage;
