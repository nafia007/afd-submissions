
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"

interface CommonFormFieldsProps {
  form: UseFormReturn<any>
}

export const CommonFormFields = ({ form }: CommonFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Film Title *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your film title" 
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="director"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Director *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Director's full name" 
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a detailed description of your film..."
                className="min-h-[100px] resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Describe your film's plot, themes, and what makes it unique
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (ETH) *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0.05" 
                  type="number"
                  step="0.001"
                  min="0"
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Set your film's price in ETH
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tokenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token ID *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1001" 
                  type="number"
                  min="1"
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Unique identifier for your NFT token
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
