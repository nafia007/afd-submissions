import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createProposal, allocateVotesToAllUsers } from '@/integrations/supabase/voting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';

const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  quorum: z.number().int().min(0).max(100).optional().or(z.literal('')),
});

export default function CreateProposal() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof proposalSchema>>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      quorum: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof proposalSchema>) => {
    if (!user) return;

    setLoading(true);

    try {
      const proposal = await createProposal({
        title: values.title,
        description: values.description,
        voting_options: ['For', 'Against', 'Abstain'],
        start_date: values.startDate,
        end_date: values.endDate,
        quorum_required: values.quorum === '' ? null : Number(values.quorum),
      }, user.id);

      if (proposal) {
        // Allocate votes to all registered users
        await allocateVotesToAllUsers(proposal.id);
        
        toast({
          title: 'Proposal Created!',
          description: 'Proposal created successfully and votes allocated to all users.',
          variant: 'default',
        });
        form.reset();
      } else {
        toast({
          title: 'Failed to Create Proposal',
          description: 'There was an error creating the proposal.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating the proposal.',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-card/40 border-2 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary">📋</span>
          Create New Proposal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Proposal Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter proposal title"
                      {...field}
                      className="bg-card/60 border-border/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter proposal description"
                      {...field}
                      className="h-32 bg-card/60 border-border/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className="bg-card/60 border-border/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        className="bg-card/60 border-border/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quorum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Quorum Required (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter quorum percentage (optional)"
                      {...field}
                      min="0"
                      max="100"
                      className="bg-card/60 border-border/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? 'Creating...' : 'Create Proposal'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

