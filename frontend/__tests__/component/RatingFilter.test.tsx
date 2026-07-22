import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingFilter from '@/app/admin/reviews/_components/RatingFilter';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    usePathname: () => '/admin/reviews',
    useSearchParams: () => new URLSearchParams(),
}));

describe('RatingFilter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all 6 rating options', () => {
        render(<RatingFilter initialRating="" />);

        expect(screen.getByText('All ratings')).toBeInTheDocument();
        expect(screen.getByText('5 stars')).toBeInTheDocument();
        expect(screen.getByText('4 stars')).toBeInTheDocument();
        expect(screen.getByText('3 stars')).toBeInTheDocument();
        expect(screen.getByText('2 stars')).toBeInTheDocument();
        expect(screen.getByText('1 star')).toBeInTheDocument();
    });

    test('navigates with a rating param and resets page to 1 when a rating is selected', async () => {
        const user = userEvent.setup();
        render(<RatingFilter initialRating="" />);

        await user.selectOptions(screen.getByRole('combobox'), '5');

        expect(mockPush).toHaveBeenCalledWith('/admin/reviews?rating=5&page=1');
    });

    test('removes the rating param when switching back to "All ratings"', async () => {
        const user = userEvent.setup();
        render(<RatingFilter initialRating="5" />);

        await user.selectOptions(screen.getByRole('combobox'), '');

        expect(mockPush).toHaveBeenCalledWith('/admin/reviews?page=1');
    });

    test('reflects the initialRating prop as the selected value', () => {
        render(<RatingFilter initialRating="4" />);

        const select = screen.getByRole('combobox') as HTMLSelectElement;
        expect(select.value).toBe('4');
    });
});