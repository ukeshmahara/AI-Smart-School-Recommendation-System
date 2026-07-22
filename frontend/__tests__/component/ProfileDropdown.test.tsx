import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileDropdown from '@/app/dashboard/_components/ProfileDropdown';
import { useAuth } from '@/lib/contexts/AuthContext';

jest.mock('@/lib/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockLogout = jest.fn();

const mockUser = {
    fullName: 'Ukesh Mahara',
    email: 'ukesh@example.com',
    profileImage: null,
};

describe('ProfileDropdown', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    });

    test('the dropdown menu is closed by default', () => {
        render(<ProfileDropdown />);

        expect(screen.queryByText('ukesh@example.com')).not.toBeInTheDocument();
    });

    test('opens the dropdown showing the user\'s name and email when clicked', async () => {
        const user = userEvent.setup();
        render(<ProfileDropdown />);

        await user.click(screen.getByRole('button'));

        expect(screen.getByText('Ukesh Mahara')).toBeInTheDocument();
        expect(screen.getByText('ukesh@example.com')).toBeInTheDocument();
    });

    test('shows policy links (Privacy Policy, Terms, Help) when showPolicyLinks is true', async () => {
        const user = userEvent.setup();
        render(<ProfileDropdown showPolicyLinks={true} />);

        await user.click(screen.getByRole('button'));

        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        expect(screen.getByText('Terms of Service')).toBeInTheDocument();
        expect(screen.getByText('Help & Support')).toBeInTheDocument();
    });

    test('hides policy links when showPolicyLinks is false (admin variant)', async () => {
        const user = userEvent.setup();
        render(<ProfileDropdown showPolicyLinks={false} />);

        await user.click(screen.getByRole('button'));

        expect(screen.queryByText('Privacy Policy')).not.toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('calls logout when the Logout button is clicked', async () => {
        const user = userEvent.setup();
        render(<ProfileDropdown />);

        await user.click(screen.getByRole('button'));
        await user.click(screen.getByText('Logout'));

        expect(mockLogout).toHaveBeenCalledTimes(1);
    });
});