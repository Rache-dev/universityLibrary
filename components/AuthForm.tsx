"use client"
import { ZodType } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { FIELD_NAMES, FIELD_TYPES } from "@/constants"
import ImageUpload from "./ImageUpload"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string}>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues> ({type, schema, defaultValues, onSubmit} : Props<T>) => {

  const router = useRouter();

  const isSignIn = type === 'SIGN_IN';

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log("data from submit", data)
    const result = await onSubmit(data)

    if (result.success){
      toast({
        title: "Success",
        description: isSignIn ? "You have successfully signed in." : "You have successfully signed up."
      })
      router.push("/")
    } else{
      toast({
        title: `Error ${isSignIn ? "signing in" : "signing up"}`,
        description: result.error ?? "An error occurred.",
        variant: "destructive"
      })
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome Back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn ? "Access the vast collection of resources, and stay updated" : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
        {
          Object.keys(defaultValues).map((field) => (
            <FormField control={form.control} name={field as Path<T>} key={field}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
              <FormControl>
                {
                  field.name === "universityCard" ? (<ImageUpload  onFileChange={field.onChange} />) : (<Input required className="form-input" type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} />)
                }
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          ))
        }
        <Button type="submit" className="form-btn">{isSignIn ? 'Sign In': 'Sign Up'}</Button>

        <p>
          {isSignIn ? "Don't have an account already? ": "Have an account already? "}
           <Link href={isSignIn ? '/sign-up': '/sign-in'} className="font-bold text-primary"> { isSignIn ? 'Register Here' : 'Log In'}</Link>
        </p>
      </form>
    </Form>
    </div>
  )
}

export default AuthForm