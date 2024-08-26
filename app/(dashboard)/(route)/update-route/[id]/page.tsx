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
import {
  CalendarIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
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
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const supabase = createClient();

const formSchema = z.object({
  upload_date: z.date(),
  client: z.string().min(2).max(50),
  origin: z.string().min(2).max(50),
  destination: z.string().min(2).max(50),
  final_client_destination: z.string().min(2).max(50),
  delivery_date: z.date(),
  delivery_time: z.date(),
  reference: z.string().min(2).max(50),
  operator: z.string().min(2).max(50),
  status: z.string().min(2).max(50),
});

const UpdateRoutePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upload_date: undefined,
      client: "",
      origin: "",
      destination: "",
      final_client_destination: "",
      delivery_date: undefined,
      delivery_time: undefined,
      reference: "",
      operator: "",
      status: "",
    },
  });

  useEffect(() => {
    const getRouteData = async () => {
      const { data, error } = await supabase
        .from("routes")
        .select(
          "upload_date, client, origin, destination, final_client_destination, delivery_date, delivery_time, reference, operator, status"
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching route:", error.message);
      } else if (data) {
        form.reset({
          upload_date: data.upload_date,
          client: data.client,
          origin: data.origin,
          destination: data.destination,
          final_client_destination: data.final_client_destination,
          delivery_date: data.delivery_date,
          delivery_time: data.delivery_time,
          reference: data.reference,
          operator: data.operator,
          status: data.status,
        });
      }
      setLoading(false);
    };

    getRouteData();
  }, [params.id, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updates = {
      upload_date: values.upload_date,
      client: values.client,
      origin: values.origin,
      destination: values.destination,
      final_client_destination: values.final_client_destination,
      delivery_date: values.delivery_date,
      delivery_time: values.delivery_time,
      reference: values.reference,
      operator: values.operator,
      status: values.status,
    };

    const { error } = await supabase
      .from("routes")
      .update(updates)
      .eq("id", params.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar la ruta",
      });
    } else {
      toast({
        variant: "success",
        title: "Ruta actualizada con éxito",
      });
      router.push("/view-routes");
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
          <div className="pb-6">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Agregar ruta
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Llena los campos para agregar una nueva ruta.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <FormField
                  control={form.control}
                  name="upload_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2.5">Fecha de carga</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
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
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del cliente</FormLabel>
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
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origen</FormLabel>
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
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino</FormLabel>
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
                  name="final_client_destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino final del cliente</FormLabel>
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
                  name="delivery_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2.5">Fecha de entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
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
                  name="delivery_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2.5">Hora de entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
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
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia</FormLabel>
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
                  name="operator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operador</FormLabel>
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estatus</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
              ¿Estás seguro de que deseas actualizar la información de esta
              ruta?
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

export default UpdateRoutePage;
