import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import LoginForm from '@/app/(auth)/_components/LoginForm';
import { useAuth } from '@/lib/contexts/AuthContext';
import { handleLoginUser } from '@/lib/actions/auth-action';

const mockPush = jest.fn();
const mockCheckAuth = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

jest.mock('@/lib/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/lib/actions/auth-action', () => ({
    handleLoginUser: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockHandleLoginUser = handleLoginUser as jest.Mock;

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({ checkAuth: mockCheckAuth });
    });

    test('shows a validation error when submitting an invalid email', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        await user.type(screen.getByLabelText('Email'), 'not-an-email');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(mockHandleLoginUser).not.toHaveBeenCalled();
        });
    });

    test('toggles password visibility when the eye icon is clicked', async () => {
        const user = userEvent.setup();
        render(<LoginForm />);

        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toHaveAttribute('type', 'password');

        await user.click(screen.getByLabelText('Show password'));
        expect(passwordInput).toHaveAttribute('type', 'text');

        await user.click(screen.getByLabelText('Hide password'));
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('calls handleLoginUser with the entered credentials on valid submit', async () => {
        const user = userEvent.setup();
        mockHandleLoginUser.mockResolvedValue({ success: true, data: { role: 'student' } });

        render(<LoginForm />);

        await user.type(screen.getByLabelText('Email'), 'student@example.com');
        await user.type(screen.getByLabelText('Password'), 'Test@1234');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(mockHandleLoginUser).toHaveBeenCalledWith({
                email: 'student@example.com',
                password: 'Test@1234',
            });
        });
    });

    test('redirects a student to /dashboard on successful login', async () => {
        const user = userEvent.setup();
        mockHandleLoginUser.mockResolvedValue({ success: true, data: { role: 'student' } });

        render(<LoginForm />);

        await user.type(screen.getByLabelText('Email'), 'student@example.com');
        await user.type(screen.getByLabelText('Password'), 'Test@1234');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    test('redirects an admin to /admin/analytics on successful login', async () => {
        const user = userEvent.setup();
        mockHandleLoginUser.mockResolvedValue({ success: true, data: { role: 'admin' } });

        render(<LoginForm />);

        await user.type(screen.getByLabelText('Email'), 'admin@example.com');
        await user.type(screen.getByLabelText('Password'), 'Test@1234');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin/analytics');
        });
    });

    test('shows an error toast and does not redirect when login fails', async () => {
        const user = userEvent.setup();
        mockHandleLoginUser.mockResolvedValue({ success: false, message: 'Invalid email or password' });

        render(<LoginForm />);

        await user.type(screen.getByLabelText('Email'), 'student@example.com');
        await user.type(screen.getByLabelText('Password'), 'WrongPassword');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
        });
        expect(mockPush).not.toHaveBeenCalled();
    });
});