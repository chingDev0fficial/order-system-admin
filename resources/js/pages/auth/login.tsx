import { Button } from '@/custom/components/button';
import { Checkbox, Input } from '@/custom/components/input';
import { router } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function Login() {
    // const { auth } = usePage<SharedData>().props;
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [processing, setProcessing] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>(
        {},
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(
            '/login',
            {
                email: email,
                password: password,
                remember: rememberMe,
            },
            {
                preserveScroll: true,
                onError: (errors) => {
                    setErrors(errors as { email?: string; password?: string });
                    setProcessing(false);
                },
                onSuccess: () => {
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <>
            <div className="flex h-[100vh] items-center justify-center">
                <form
                    className="grid-col-1 grid w-[580px] gap-5 rounded-md bg-[#FCF8F8] p-5 shadow-md"
                    onSubmit={handleSubmit}
                >
                    <div className="flex w-[100%] items-center justify-center">
                        <h1 className="text-[1.9rem] font-bold text-[#F96901]">
                            Login Admin
                        </h1>
                    </div>

                    <Input
                        type="email"
                        icon={<Mail size={20} />}
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        id="email"
                        required
                    />

                    <Input
                        type="password"
                        icon={<Lock size={20} />}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        id="password"
                        required
                    />

                    <div className="w-[100%]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    label="Remember me"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                            </div>

                            <a className="text-sm text-gray-500" href="#">
                                Forgot Password
                            </a>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={processing}
                        loading={processing}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </>
    );
}
