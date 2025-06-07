import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Zod schema
const customerInfoSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Not a valid email").min(6, "Email is required"),
  postalCode: z.coerce
    .number()
    .min(100000, "Postal code is required")
    .max(999999999, "Max limit crossed!"),
  dob: z.string().optional(),
});

const medicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce
    .number()
    .min(1, "Quantity is required")
    .max(20, "Max limit crossed!"),
});

const customerMedicationSchema = z.object({
  customerInfo: customerInfoSchema,
  medications: z
    .array(medicationSchema)
    .nonempty("At least one medication is required"),
});

type FormData = z.infer<typeof customerMedicationSchema>;

const CreateMedication = ({ licenceKey }: { licenceKey: string }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(customerMedicationSchema),
    defaultValues: {
      customerInfo: {
        name: "",
        email: "",
        postalCode: 0,
      },
      medications: [{ name: "", quantity: 0 }],
    },
  });

  const { control, reset, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    axios
      .post("/api/transition/createbynewcustomer", data, {
        headers: {
          licencekey: licenceKey,
        },
      })
      .then((res) => {
        console.log(res);
        reset();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
        );
      });
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Create Medication Transition
          </CardTitle>
          <CardDescription>
            Enter customer and medication information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Customer Info Section */}
              <div>
                <legend className="text-lg font-semibold mb-2">
                  Customer Info
                </legend>
                <div className="grid gap-4 grid-cols-2">
                  <FormField
                    control={control}
                    name="customerInfo.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Customer Name" {...field} />
                        </FormControl>
                        <FormMessage className="truncate text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="customerInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage className="truncate text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="customerInfo.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Postal Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="truncate text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="customerInfo.dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage className="truncate text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Medication Section */}
              <div>
                <legend className="text-lg font-semibold mb-2">
                  Medication Info
                </legend>
                <div className="flex flex-col gap-4">
                  {fields.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
                    >
                      <FormField
                        control={control}
                        name={`medications.${idx}.name`}
                        render={({ field }) => (
                          <FormItem className="sm:col-span-3">
                            <FormLabel>Medication Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage className="truncate text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`medications.${idx}.quantity`}
                        render={({ field }) => (
                          <FormItem className="sm:col-span-1">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Qty"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="truncate text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="sm:col-span-1"
                        onClick={() => remove(idx)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ name: "", quantity: 1 })}
                    className="w-fit mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Submit Medication
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMedication;
