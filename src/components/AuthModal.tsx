import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { signIn, signUp } from '../lib/auth';
import type { AuthSession } from '../lib/auth';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (session: AuthSession) => void;
}

interface AuthFormValues {
  username: string;
  password: string;
}

// Dialog with Sign In / Sign Up tabs. Calls onAuthSuccess with the new session on success.
// Input: open (boolean), onOpenChange (fn), onAuthSuccess (fn). Output: JSX element.
export default function AuthModal({ open, onOpenChange, onAuthSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('signin');
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const signInForm = useForm<AuthFormValues>({ defaultValues: { username: '', password: '' } });
  const signUpForm = useForm<AuthFormValues>({ defaultValues: { username: '', password: '' } });

  // Resets both forms and error state when the dialog closes.
  // Input: open (boolean) — new open state. Output: void.
  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      signInForm.reset();
      signUpForm.reset();
      setSignInError('');
      setSignUpError('');
      setActiveTab('signin');
    }
    onOpenChange(open);
  };

  // Handles sign-in form submission, calls auth library and notifies parent on success.
  // Input: values (AuthFormValues) — validated form data. Output: Promise<void>.
  const onSubmitSignIn = async (values: AuthFormValues): Promise<void> => {
    setSignInError('');
    const result = await signIn(values.username, values.password);
    if (result.success) {
      signInForm.reset();
      onAuthSuccess(result.session);
    } else {
      setSignInError(result.error);
    }
  };

  // Handles sign-up form submission, calls auth library and notifies parent on success.
  // Input: values (AuthFormValues) — validated form data. Output: Promise<void>.
  const onSubmitSignUp = async (values: AuthFormValues): Promise<void> => {
    setSignUpError('');
    const result = await signUp(values.username, values.password);
    if (result.success) {
      signUpForm.reset();
      onAuthSuccess(result.session);
    } else {
      setSignUpError(result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🏴‍☠️ Treasure Hunt — Account</DialogTitle>
          <DialogDescription>
            Sign in or create an account to save your scores.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSubmitSignIn)}>
                <div className="flex flex-col gap-4 mt-2">
                  <FormField
                    control={signInForm.control}
                    name="username"
                    rules={{ required: 'Username is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="your_username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    rules={{ required: 'Password is required' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {signInError && (
                    <p className="text-destructive text-sm">{signInError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={signInForm.formState.isSubmitting}
                    className="w-full"
                  >
                    {signInForm.formState.isSubmitting ? 'Signing in…' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            <Form {...signUpForm}>
              <form onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}>
                <div className="flex flex-col gap-4 mt-2">
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    rules={{
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Username must be at least 3 characters' },
                      pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="your_username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    rules={{
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {signUpError && (
                    <p className="text-destructive text-sm">{signUpError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={signUpForm.formState.isSubmitting}
                    className="w-full"
                  >
                    {signUpForm.formState.isSubmitting ? 'Creating account…' : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-2">
          <p className="text-muted-foreground text-sm mb-2">Just want to try?</p>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
