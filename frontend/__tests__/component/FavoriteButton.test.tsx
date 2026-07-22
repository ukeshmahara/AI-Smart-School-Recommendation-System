import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import FavoriteButton from '@/app/dashboard/schools/_components/FavoriteButton';
import { useAuth } from '@/lib/contexts/AuthContext';
import { handleAddFavorite, handleRemoveFavorite } from '@/lib/actions/favorite-action';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock('react-toastify', () => ({
    toast: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/lib/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/lib/actions/favorite-action', () => ({
    handleAddFavorite: jest.fn(),
    handleRemoveFavorite: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockHandleAddFavorite = handleAddFavorite as jest.Mock;
const mockHandleRemoveFavorite = handleRemoveFavorite as jest.Mock;

describe('FavoriteButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows an unfilled heart when not favorited', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });

        render(<FavoriteButton schoolId="school-1" initialFavorited={false} />);

        const button = screen.getByLabelText('Save to favorites');
        const heart = button.querySelector('svg');
        expect(heart).not.toHaveClass('fill-red-500');
    });

    test('shows a filled heart when already favorited', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });

        render(<FavoriteButton schoolId="school-1" initialFavorited={true} />);

        const button = screen.getByLabelText('Remove from favorites');
        const heart = button.querySelector('svg');
        expect(heart).toHaveClass('fill-red-500');
    });

    test('redirects to login instead of favoriting when not authenticated', async () => {
        const user = userEvent.setup();
        mockUseAuth.mockReturnValue({ isAuthenticated: false });

        render(<FavoriteButton schoolId="school-1" initialFavorited={false} />);
        await user.click(screen.getByLabelText('Save to favorites'));

        expect(toast.info).toHaveBeenCalledWith('Log in to save schools to your favorites');
        expect(mockPush).toHaveBeenCalledWith('/login');
        expect(mockHandleAddFavorite).not.toHaveBeenCalled();
    });

    test('calls handleAddFavorite when authenticated and clicked while unfavorited', async () => {
        const user = userEvent.setup();
        mockUseAuth.mockReturnValue({ isAuthenticated: true });
        mockHandleAddFavorite.mockResolvedValue({ success: true });

        render(<FavoriteButton schoolId="school-1" initialFavorited={false} />);
        await user.click(screen.getByLabelText('Save to favorites'));

        await waitFor(() => {
            expect(mockHandleAddFavorite).toHaveBeenCalledWith('school-1');
        });
    });

    test('reverts the optimistic update and shows an error toast when the server call fails', async () => {
        const user = userEvent.setup();
        mockUseAuth.mockReturnValue({ isAuthenticated: true });
        mockHandleAddFavorite.mockResolvedValue({ success: false, message: 'Something went wrong' });

        render(<FavoriteButton schoolId="school-1" initialFavorited={false} />);
        await user.click(screen.getByLabelText('Save to favorites'));

        // Wait for the reverted state to come back (button label flips back)
        await waitFor(() => {
            expect(screen.getByLabelText('Save to favorites')).toBeInTheDocument();
        });
        expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });
});