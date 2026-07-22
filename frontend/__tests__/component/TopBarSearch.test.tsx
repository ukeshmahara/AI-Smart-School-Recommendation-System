import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TopBarSearch from '@/app/dashboard/_components/TopBarSearch';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('TopBarSearch', () => {
    beforeEach(() => {
        mockPush.mockClear();
    });

    test('navigates with a search query param when submitted with text', async () => {
        const user = userEvent.setup();
        render(<TopBarSearch />);

        const input = screen.getByPlaceholderText('Search schools by name or location');
        await user.type(input, 'Imperial');
        await user.keyboard('{Enter}');

        expect(mockPush).toHaveBeenCalledWith('/dashboard/schools?search=Imperial');
    });

    test('navigates without a search param when submitted empty', async () => {
        render(<TopBarSearch />);

        const input = screen.getByPlaceholderText('Search schools by name or location');
        // Explicitly focus the field first - pressing Enter only submits a form
        // if focus is actually inside it.
        input.focus();
        const user = userEvent.setup();
        await user.keyboard('{Enter}');

        expect(mockPush).toHaveBeenCalledWith('/dashboard/schools?');
        expect(mockPush).not.toHaveBeenCalledWith(expect.stringContaining('search='));
    });
});